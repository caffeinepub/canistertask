import Set "mo:core/Set";
import Nat "mo:core/Nat";
import Blob "mo:core/Blob";
import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Float "mo:core/Float";
import Stripe "stripe/stripe";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";

import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import BlobStorage "blob-storage/Storage";

actor {
  // Authorization + blob storage - Must be first
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Stripe configuration state
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Platform fee configuration (7%)
  let PLATFORM_FEE_PERCENTAGE : Float = 0.07;

  // HCoragem wallet address for platform fees
  var platformFeeWallet : ?Principal = null;

  // Push Notification Types
  type PushNotification = {
    id : Nat;
    workerId : Principal;
    taskId : Nat;
    taskDetails : Text;
    timestamp : Int;
    isRead : Bool;
  };

  // Statistics Types
  type DailySummary = {
    day : Int;
    taskCount : Nat;
    totalAmount : Float;
    completedTasks : Nat;
    completedAmount : Float;
  };

  // Chart Types // TODO: Rename to keep backwards compatibility only
  type DailyStats = {
    date : Int;
    totalFees : Float;
    taskCount : Nat;
  };

  // Data structures
  type TaskId = Nat;
  type TaskStatus = {
    #inactive;
    #active;
    #completed;
    #declined;
    #inProgress;
    #cancelled;
  };

  type Skill = {
    #photography;
    #delivery;
    #verification;
    #arCaptures;
    #custom : Text;
  };

  type Location = {
    lat : Float;
    lon : Float;
    radius : Float;
  };

  type Payment = {
    id : Nat;
    amount : Float;
    taskId : TaskId;
    createdAt : Int;
    paidBy : Principal;
  };

  type TaskPayment = {
    taskId : Nat;
    amount : Float;
    paymentId : Nat;
  };

  type HumanWorkerProfile = {
    principal : Principal;
    name : Text;
    photo : ?Blob;
    skills : [Skill];
    location : Location;
    price : Float;
    available : Bool;
    rating : Float;
    createdAt : Int;
  };

  type AiAgentClientProfile = {
    principal : Principal;
    agentName : Text;
    description : Text;
    createdAt : Int;
  };

  type Task = {
    id : Nat;
    taskType : Text;
    details : Text;
    estimatedDuration : Text;
    price : Float;
    location : Location;
    status : Text;
    createdAt : Int;
    createdBy : Principal;
  };

  type Submission = {
    task : Task;
    data : Blob;
    createdAt : Int;
    location : ?Location;
    submittedBy : Principal;
  };

  public type DashboardStats = {
    totalTasks : Nat;
    totalRevenue : Float;
    totalPlatformFees : Float;
    completedTasks : Nat;
    activeWorkers : Nat;
  };

  public type UserProfile = {
    profileType : { #humanWorker; #aiAgent };
    humanWorker : ?HumanWorkerProfile;
    aiAgent : ?AiAgentClientProfile;
  };

  let pushNotifications = Map.empty<Nat, PushNotification>();
  let humanWorkerProfiles = Map.empty<Principal, HumanWorkerProfile>();
  let aiAgentProfiles = Map.empty<Principal, AiAgentClientProfile>();
  let tasks = Map.empty<Nat, Task>();
  let submissions = Map.empty<Nat, Submission>();
  let payments = Map.empty<Nat, Payment>();
  let activeTasks = Set.empty<Nat>();
  let taskPayments = Map.empty<Nat, TaskPayment>();

  var currentPrice : (?Text, Float) = (null, 0.0);

  // Helper functions
  public shared ({ caller }) func getAndUpdateCurrentPrice() : async {
    currency : ?Text;
    price : Float;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access pricing");
    };
    { currency = currentPrice.0; price = currentPrice.1 };
  };

  // Admin function to set platform fee wallet
  public shared ({ caller }) func setPlatformFeeWallet(wallet : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set platform fee wallet");
    };
    platformFeeWallet := ?wallet;
  };

  // Stripe integration core functions
  public query ({ caller }) func isStripeConfigured() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check Stripe configuration");
    };
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check session status");
    };
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Required user profile system
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };

    switch (humanWorkerProfiles.get(caller)) {
      case (?hwProfile) {
        ?{
          profileType = #humanWorker;
          humanWorker = ?hwProfile;
          aiAgent = null;
        };
      };
      case (null) {
        switch (aiAgentProfiles.get(caller)) {
          case (?aiProfile) {
            ?{
              profileType = #aiAgent;
              humanWorker = null;
              aiAgent = ?aiProfile;
            };
          };
          case (null) { null };
        };
      };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };

    switch (humanWorkerProfiles.get(user)) {
      case (?hwProfile) {
        ?{
          profileType = #humanWorker;
          humanWorker = ?hwProfile;
          aiAgent = null;
        };
      };
      case (null) {
        switch (aiAgentProfiles.get(user)) {
          case (?aiProfile) {
            ?{
              profileType = #aiAgent;
              humanWorker = null;
              aiAgent = ?aiProfile;
            };
          };
          case (null) { null };
        };
      };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    switch (profile.profileType) {
      case (#humanWorker) {
        switch (profile.humanWorker) {
          case (?hwProfile) {
            let updatedProfile = {
              hwProfile with
              principal = caller;
            };
            humanWorkerProfiles.add(caller, updatedProfile);
          };
          case (null) { Runtime.trap("Human worker profile data missing") };
        };
      };
      case (#aiAgent) {
        switch (profile.aiAgent) {
          case (?aiProfile) {
            let updatedProfile = {
              aiProfile with
              principal = caller;
            };
            aiAgentProfiles.add(caller, updatedProfile);
          };
          case (null) { Runtime.trap("AI agent profile data missing") };
        };
      };
    };
  };

  // Profile system
  // Human worker
  public shared ({ caller }) func registerHumanWorker(
    name : Text,
    skills : [Skill],
    location : Location,
    price : Float,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as workers");
    };

    humanWorkerProfiles.add(
      caller,
      {
        principal = caller;
        name;
        photo = null;
        skills;
        location;
        price;
        available = true;
        rating = 0.0;
        createdAt = Time.now();
      },
    );
  };

  public shared ({ caller }) func updateHumanWorkerProfile(
    name : Text,
    skills : [Skill],
    location : Location,
    price : Float,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    switch (humanWorkerProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile : HumanWorkerProfile = {
          profile with
          name;
          skills;
          location;
          price;
        };
        humanWorkerProfiles.add(caller, updatedProfile);
      };
      case (null) { Runtime.trap("Profile not found") };
    };
  };

  public shared ({ caller }) func uploadProfilePicture(photo : Blob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload profile pictures");
    };

    switch (humanWorkerProfiles.get(caller)) {
      case (?profile) {
        let updatedProfile : HumanWorkerProfile = {
          profile with
          photo = ?photo;
        };
        humanWorkerProfiles.add(caller, updatedProfile);
      };
      case (null) { Runtime.trap("Profile not found") };
    };
  };

  // AI agent/client
  public shared ({ caller }) func registerAiAgent(agentName : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register as AI agents");
    };

    aiAgentProfiles.add(
      caller,
      {
        principal = caller;
        agentName;
        description;
        createdAt = Time.now();
      },
    );
  };

  // Task management
  public shared ({ caller }) func createTask(
    taskType : Text,
    details : Text,
    duration : Text,
    price : Float,
    location : Location,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create tasks");
    };

    let taskId = tasks.size();
    tasks.add(
      taskId,
      {
        id = taskId;
        taskType;
        details;
        estimatedDuration = duration;
        price;
        location;
        status = "open";
        createdAt = Time.now();
        createdBy = caller;
      },
    );

    // Notify matching workers
    for (worker in humanWorkerProfiles.values()) {
      var hasMatchingSkill = false;
      for (skill in worker.skills.vals()) {
        switch (skill) {
          case (#custom(text)) {
            if (Text.equal(text, taskType)) {
              hasMatchingSkill := true;
            };
          };
          case (#photography) {
            if (Text.equal(taskType, "photography")) {
              hasMatchingSkill := true;
            };
          };
          case (#delivery) {
            if (Text.equal(taskType, "delivery")) {
              hasMatchingSkill := true;
            };
          };
          case (#verification) {
            if (Text.equal(taskType, "verification")) {
              hasMatchingSkill := true;
            };
          };
          case (#arCaptures) {
            if (Text.equal(taskType, "arCaptures")) {
              hasMatchingSkill := true;
            };
          };
        };
      };

      let distance = calculateDistance(location.lat, location.lon, worker.location.lat, worker.location.lon);

      if (hasMatchingSkill and distance <= worker.location.radius) {
        let notificationId = pushNotifications.size();
        pushNotifications.add(
          notificationId,
          {
            id = notificationId;
            workerId = worker.principal;
            taskId;
            taskDetails = taskType # ": " # details;
            timestamp = Time.now();
            isRead = false;
          },
        );
      };
    };

    taskId;
  };

  // Complete task with automatic 7% platform fee deduction
  public shared ({ caller }) func completeTaskPayment(taskId : Nat, paymentAmount : Float) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete task payments");
    };

    // Verify task exists
    let task = switch (tasks.get(taskId)) {
      case (?t) { t };
      case (null) { Runtime.trap("Task not found") };
    };

    // Verify caller is the task creator (payer)
    if (task.createdBy != caller) {
      Runtime.trap("Unauthorized: Only task creator can complete payment");
    };

    // Verify task is not already completed
    if (task.status == "completed") {
      Runtime.trap("Task already completed");
    };

    // Calculate platform fee (7%)
    let platformFee = paymentAmount * PLATFORM_FEE_PERCENTAGE;
    let workerPayment = paymentAmount - platformFee;

    // Create payment record
    let paymentId = payments.size();
    payments.add(
      paymentId,
      {
        id = paymentId;
        amount = paymentAmount;
        taskId;
        createdAt = Time.now();
        paidBy = caller;
      },
    );

    // Record platform fee
    taskPayments.add(
      taskId,
      {
        taskId;
        amount = platformFee;
        paymentId;
      },
    );

    // Update task status to completed
    let updatedTask = {
      task with
      status = "completed";
    };
    tasks.add(taskId, updatedTask);
  };

  // PUBLIC SEARCH ENDPOINT - No authentication for public API
  public query func search(skills : [Text], lat : Float, lon : Float) : async [
    HumanWorkerProfile
  ] {
    var matchingWorkers = List.empty<HumanWorkerProfile>();

    let workersIter = humanWorkerProfiles.values();
    for (worker in workersIter) {
      var hasSkill = false;

      for (searchSkill in skills.vals()) {
        for (workerSkill in worker.skills.vals()) {
          switch (workerSkill) {
            case (#custom(text)) {
              if (Text.equal(text, searchSkill)) {
                hasSkill := true;
              };
            };
            case (#photography) {
              if (Text.equal(searchSkill, "photography")) {
                hasSkill := true;
              };
            };
            case (#delivery) {
              if (Text.equal(searchSkill, "delivery")) {
                hasSkill := true;
              };
            };
            case (#verification) {
              if (Text.equal(searchSkill, "verification")) {
                hasSkill := true;
              };
            };
            case (#arCaptures) {
              if (Text.equal(searchSkill, "arCaptures")) {
                hasSkill := true;
              };
            };
          };
        };
      };

      let distance = calculateDistance(lat, lon, worker.location.lat, worker.location.lon);

      if (hasSkill and distance <= worker.location.radius) {
        matchingWorkers.add(worker);
      };
    };

    matchingWorkers.values().toArray();
  };

  func calculateDistance(lat1 : Float, lon1 : Float, lat2 : Float, lon2 : Float) : Float {
    // Haversine formula
    Float.sqrt((lat1 - lat2) * (lat1 - lat2) + (lon1 - lon2) * (lon1 - lon2));
  };

  // DASHBOARD AND FEE SUPPORT - Admin only
  public query ({ caller }) func getDashboardStats() : async DashboardStats {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view dashboard statistics");
    };

    var completedCount = 0;
    for (task in tasks.values()) {
      if (task.status == "completed") { completedCount += 1 };
    };

    var totalRevenue : Float = 0.0;
    for (payment in payments.values()) {
      totalRevenue += payment.amount;
    };

    var totalPlatformFees : Float = 0.0;
    for (taskPayment in taskPayments.values()) {
      totalPlatformFees += taskPayment.amount;
    };

    {
      totalTasks = tasks.size();
      totalRevenue;
      totalPlatformFees;
      completedTasks = completedCount;
      activeWorkers = humanWorkerProfiles.size();
    };
  };

  // Calculate total platform fees
  public query ({ caller }) func calculatePlatformFees() : async Float {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can calculate platform fees");
    };

    var total : Float = 0.0;
    for (taskPayment in taskPayments.values()) {
      total += taskPayment.amount;
    };
    total;
  };

  // Get current platform fee total
  public query ({ caller }) func getPlatformFeeTotal() : async Float {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view platform fee total");
    };

    var total : Float = 0.0;
    for (payment in taskPayments.values()) {
      total += payment.amount;
    };
    total;
  };

  // Check notifications - users can only see their own
  public query ({ caller }) func getUnreadNotifications() : async [PushNotification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };

    pushNotifications.values().toArray().filter(func(notification) { notification.workerId == caller and not notification.isRead });
  };

  // See all notifications - users can only see their own
  public query ({ caller }) func getAllNotifications() : async [PushNotification] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notifications");
    };

    pushNotifications.values().toArray().filter(func(notification) { notification.workerId == caller });
  };

  // Mark notification as read - users can only mark their own notifications
  public shared ({ caller }) func markNotificationAsRead(notificationId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can modify notifications");
    };

    // Find the notification and verify ownership
    switch (pushNotifications.get(notificationId)) {
      case (?existingNotification) {
        if (existingNotification.workerId != caller) {
          Runtime.trap("Unauthorized: Can only mark your own notifications as read");
        };
        let updatedNotification = {
          existingNotification with isRead = true;
        };
        pushNotifications.add(notificationId, updatedNotification);
      };
      case (null) {
        Runtime.trap("Notification ID does not exist");
      };
    };
  };

  // Get unread notifications count - users can only see their own count
  public query ({ caller }) func getUnreadNotificationsCount() : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view notification count");
    };

    var count = 0;
    for (notification in pushNotifications.values()) {
      if (notification.workerId == caller and not notification.isRead) {
        count += 1;
      };
    };
    count;
  };

  // Daily Earnings Dashboard - Admin only
  public query ({ caller }) func getDailyEarningsStats(from : Int, to : Int) : async [DailyStats] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view daily earnings stats");
    };

    // Group payments by date
    let dailyStatsMap = Map.empty<Int, { var totalFees : Float; var taskCount : Nat }>();

    for (taskPayment in taskPayments.values()) {
      // Get the payment to access timestamp
      switch (payments.get(taskPayment.paymentId)) {
        case (?payment) {
          // Convert timestamp to day (nanoseconds to days)
          let dayTimestamp = payment.createdAt / 86400000000000;

          // Filter by date range
          if (dayTimestamp >= from and dayTimestamp <= to) {
            switch (dailyStatsMap.get(dayTimestamp)) {
              case (?existing) {
                existing.totalFees += taskPayment.amount;
                existing.taskCount += 1;
              };
              case (null) {
                dailyStatsMap.add(dayTimestamp, { var totalFees = taskPayment.amount; var taskCount = 1 });
              };
            };
          };
        };
        case (null) {};
      };
    };

    // Convert to array
    let result = List.empty<DailyStats>();
    for ((date, stats) in dailyStatsMap.entries()) {
      result.add({
        date;
        totalFees = stats.totalFees;
        taskCount = stats.taskCount;
      });
    };

    result.values().toArray();
  };

  // NEW - ONLY THE FOLLOWING 2 ENDPOINTS WERE ADDED TO ORIGINAL CODE

  // Frontend queried dashboard cards for all users
  public query ({ caller }) func getDailySummary() : async {
    day : Int;
    taskCount : Nat;
    totalAmount : Float;
    completedTasks : Nat;
    completedAmount : Float;
  } {
    // Calculate current day
    let now = Time.now();
    let currentDay = now / 86400000000000;

    // Initialize summary for today
    var taskCount = 0;
    var totalAmount : Float = 0.0;
    var completedTasks = 0;
    var completedAmount : Float = 0.0;

    // Iterate through tasks to count and total today's
    for (task in tasks.values()) {
      if (task.createdAt / 86400000000000 == currentDay) {
        taskCount += 1;
        totalAmount += task.price;

        // Count completed tasks
        if (task.status == "completed") {
          completedTasks += 1;
          completedAmount += task.price;
        };
      };
    };

    // Create summary for today
    {
      day = currentDay;
      taskCount;
      totalAmount;
      completedTasks;
      completedAmount;
    };
  };

  // Get last 7 days stats for earnings chart and sidebar stats
  public query ({ caller }) func getLast7DaysStats() : async [DailySummary] {
    let now = Time.now();
    let currentDay = now / 86400000000000;

    var results = List.empty<DailySummary>();

    // Calculate stats for each of last 7 days
    var day = 0;
    while (day < 7) {
      let targetDay = currentDay - day;

      var taskCount = 0;
      var totalAmount : Float = 0.0;
      var completedTasks = 0;
      var completedAmount : Float = 0.0;

      // Iterate through tasks for the specific day
      for (task in tasks.values()) {
        if (task.createdAt / 86400000000000 == targetDay) {
          taskCount += 1;
          totalAmount += task.price;

          // Count completed tasks
          if (task.status == "completed") {
            completedTasks += 1;
            completedAmount += task.price;
          };
        };
      };

      // Create summary for the day
      let daySummary = {
        day = targetDay;
        taskCount;
        totalAmount;
        completedTasks;
        completedAmount;
      };

      // Add the day's summary to the results list
      results.add(daySummary);
      day += 1;
    };

    // Return all daily stats for last 7 days
    results.values().toArray();
  };
};
