export type AuthMethod = "phone" | "email";
export type AuthFlow = "signup" | "forgot";
export type AuthStep = "signin" | "signup" | "verify" | "create-password";

export interface AuthDraft {
    name: string;
    phone: string;
    email: string;
}