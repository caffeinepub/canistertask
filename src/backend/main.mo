import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Blob "mo:core/Blob";
import Array "mo:core/Array";
import Text "mo:core/Text";
import List "mo:core/List";
import Order "mo:core/Order";
import Map "mo:core/Map";
import Stripe "stripe/stripe";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import OutCall "http-outcalls/outcall";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import BlobStorage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Authorization + storage
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  include MixinStorage();

  // Stripe configuration state
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Data structures
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

  public type HumanWorkerProfile = {
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

  public type AiAgentClientProfile = {
    principal : Principal;
    agentName : Text;
    description : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    profileType : { #humanWorker; #aiAgent };
    humanWorker : ?HumanWorkerProfile;
    aiAgent : ?AiAgentClientProfile;
  };

  public type Task = {
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

  public type TaskStatus = {
    #inactive;
    #active;
    #completed;
    #declined;
    #inProgress;
    #cancelled;
  };

  public type TaskPackage = {
    #physical : Text;
    #data : Blob;
  };

  type Submission = {
    task : Task;
    data : Blob;
    createdAt : Int;
    location : ?Location;
    submittedBy : Principal;
  };

  type Payment = {
    id : Nat;
    amount : Float;
    task : Task;
    createdAt : Int;
    paidBy : Principal;
  };

  type WorkerPosition = (Principal, Location);

  // State
  let humanWorkerProfiles = Map.empty<Principal, HumanWorkerProfile>();
  let aiAgentProfiles = Map.empty<Principal, AiAgentClientProfile>();
  let tasks = Map.empty<Nat, Task>();
  let submissions = Map.empty<Nat, Submission>();
  let payments = Map.empty<Nat, Payment>();
  let workerPositions = Map.empty<Principal, Location>();
  let taskAssignments = Map.empty<Nat, Principal>();

  let activeTasks = Set.empty<Nat>();

  // Payment logic
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

  // Stripe integration core functions
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can set Stripe configuration");
    };
    stripeConfig := ?config;
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform transform");
    };
    OutCall.transform(input);
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
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
        createdAt = 0;
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
        createdAt = 0;
      },
    );
  };

  // Task management
  // Function to create a new task
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
        createdAt = 0;
        createdBy = caller;
      },
    );
    taskId;
  };

  // The rest of the actor remains unchanged...
};
