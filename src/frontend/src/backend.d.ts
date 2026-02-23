import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Location {
    lat: number;
    lon: number;
    radius: number;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface DailyStats {
    date: bigint;
    totalFees: number;
    taskCount: bigint;
}
export interface AiAgentClientProfile {
    principal: Principal;
    createdAt: bigint;
    agentName: string;
    description: string;
}
export interface HumanWorkerProfile {
    principal: Principal;
    name: string;
    createdAt: bigint;
    available: boolean;
    rating: number;
    photo?: Uint8Array;
    price: number;
    skills: Array<Skill>;
    location: Location;
}
export interface DashboardStats {
    totalTasks: bigint;
    totalPlatformFees: number;
    completedTasks: bigint;
    activeWorkers: bigint;
    totalRevenue: number;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface DailySummary {
    day: bigint;
    completedAmount: number;
    completedTasks: bigint;
    taskCount: bigint;
    totalAmount: number;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type Skill = {
    __kind__: "custom";
    custom: string;
} | {
    __kind__: "arCaptures";
    arCaptures: null;
} | {
    __kind__: "delivery";
    delivery: null;
} | {
    __kind__: "verification";
    verification: null;
} | {
    __kind__: "photography";
    photography: null;
};
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface PushNotification {
    id: bigint;
    workerId: Principal;
    taskDetails: string;
    isRead: boolean;
    taskId: bigint;
    timestamp: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface UserProfile {
    aiAgent?: AiAgentClientProfile;
    humanWorker?: HumanWorkerProfile;
    profileType: Variant_aiAgent_humanWorker;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_aiAgent_humanWorker {
    aiAgent = "aiAgent",
    humanWorker = "humanWorker"
}
export interface backendInterface {
    acceptTask(taskId: bigint): Promise<void>;
    activateTestMode(): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculatePlatformFees(): Promise<number>;
    completeTaskPayment(taskId: bigint, _paymentAmount: number): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createTask(taskType: string, details: string, duration: string, price: number, location: Location): Promise<bigint>;
    getAdminDashboardStats(): Promise<DashboardStats>;
    getAllNotifications(): Promise<Array<PushNotification>>;
    getAllUserIds(): Promise<Array<Principal>>;
    getAndUpdateCurrentPrice(): Promise<{
        currency?: string;
        price: number;
    }>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyEarningsStats(from: bigint, to: bigint): Promise<Array<DailyStats>>;
    getDailySummary(): Promise<{
        day: bigint;
        completedAmount: number;
        completedTasks: bigint;
        taskCount: bigint;
        totalAmount: number;
    }>;
    getDashboardStats(): Promise<DashboardStats>;
    getLast7DaysStats(): Promise<Array<DailySummary>>;
    getPlatformFeeTotal(): Promise<number>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTodayAdminStats(): Promise<{
        day: bigint;
        totalEarnings: number;
        acceptedTasks: bigint;
    }>;
    getUnreadNotifications(): Promise<Array<PushNotification>>;
    getUnreadNotificationsCount(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    isTestModeEnabled(): Promise<boolean>;
    markNotificationAsRead(notificationId: bigint): Promise<void>;
    registerAiAgent(agentName: string, description: string): Promise<void>;
    registerHumanWorker(name: string, skills: Array<Skill>, location: Location, price: number): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    search(skills: Array<string>, lat: number, lon: number): Promise<Array<HumanWorkerProfile>>;
    setPlatformFeeWallet(wallet: Principal): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateHumanWorkerProfile(name: string, skills: Array<Skill>, location: Location, price: number): Promise<void>;
    uploadProfilePicture(photo: Uint8Array): Promise<void>;
}
