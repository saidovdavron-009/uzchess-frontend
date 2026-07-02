import axios from "axios";
import {AuthDraft, AuthMethod} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function toProfileImageUrl(raw: string | null | undefined): string | null {
    if (!raw) return null;
    return raw.startsWith("http") ? raw : `${API_URL}/${raw}`;
}

export type LoginType = "number" | "email";

export function toLogin(method: AuthMethod, draft: AuthDraft) {
    return method === "phone" ? `+998${draft.phone}` : draft.email.trim();
}

export function toLoginType(method: AuthMethod): LoginType {
    return method === "phone" ? "number" : "email";
}

export async function signUp(fullName: string, login: string, loginType: LoginType) {
    await axios.post(`${API_URL}/auth/sign-up`, {fullName, login, loginType});
}

export async function signIn(login: string, password: string) {
    const {data} = await axios.post<{ accessToken: string }>(`${API_URL}/auth/sign-in`, {login, password});
    return data;
}

export async function verifyOtp(login: string, code: string) {
    await axios.post(`${API_URL}/auth/verify-otp`, {login, code});
}

export async function resendOtp(login: string, loginType: LoginType) {
    await axios.post(`${API_URL}/auth/resend-otp`, {login, loginType});
}

export async function setPassword(login: string, code: string, password: string) {
    await axios.post(`${API_URL}/auth/set-password`, {login, code, password});
}

const TOKEN_KEY = "uzchess_token";

export function saveToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
}

function decodeToken(token: string): { id: number; login: string; role: string } | null {
    try {
        const payload = token.split(".")[1];
        return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    } catch {
        return null;
    }
}

export interface CurrentUser {
    id: number;
    fullName: string;
    profileImageUrl: string | null;
    login: string;
    loginType: LoginType;
    birthDate: string | null;
}

export async function fetchCurrentUser(token: string): Promise<CurrentUser | null> {
    const decoded = decodeToken(token);
    if (!decoded) return null;
    try {
        const {data} = await axios.get(`${API_URL}/admin/users/${decoded.id}`, {
            headers: {Authorization: `Bearer ${token}`},
        });
        return {
            id: decoded.id,
            fullName: data.fullName,
            profileImageUrl: toProfileImageUrl(data.profileImage),
            login: data.login,
            loginType: data.loginType,
            birthDate: data.birthDate,
        };
    } catch {
        return null;
    }
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export function isTokenExpired(token: string): boolean {
    try {
        const payload = token.split(".")[1];
        const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
        if (!decoded.exp) return false;
        return Date.now() >= decoded.exp * 1000;
    } catch {
        return true;
    }
}

export async function updateProfile(id: number, token: string, fields: {
    fullName?: string;
    birthDate?: string;
    profileImage?: File;
}): Promise<CurrentUser> {
    const formData = new FormData();
    if (fields.fullName !== undefined) formData.append("fullName", fields.fullName);
    if (fields.birthDate !== undefined) formData.append("birthDate", fields.birthDate);
    if (fields.profileImage) formData.append("profileImage", fields.profileImage);
    const {data} = await axios.patch(`${API_URL}/admin/users/${id}`, formData, {
        headers: {Authorization: `Bearer ${token}`},
    });
    return {
        id,
        fullName: data.fullName,
        profileImageUrl: toProfileImageUrl(data.profileImage),
        login: data.login,
        loginType: data.loginType,
        birthDate: data.birthDate,
    };
}

export async function updateLogin(id: number, token: string, login: string, loginType: LoginType) {
    await axios.patch(`${API_URL}/admin/users/${id}`, {login, loginType}, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

export async function markVerified(id: number, token: string) {
    await axios.patch(`${API_URL}/admin/users/${id}`, {isVerified: true}, {
        headers: {Authorization: `Bearer ${token}`},
    });
}

const ERROR_MESSAGES: Record<string, string> = {
    "Unauthorized": "Login yoki parol noto‘g‘ri",
    "User with given login already exists": "Bu login bilan foydalanuvchi allaqachon ro‘yxatdan o‘tgan",
    "Codes do not match": "Kod noto‘g‘ri kiritildi",
    "Code expired": "Kod muddati tugagan, qaytadan yuboring",
    "Code not expired yet": "Kod hali amal qiladi, biroz kutib turing",
    "Does not exist": "Bunday foydalanuvchi topilmadi",
    "User with given login does not exist": "Bunday foydalanuvchi topilmadi",
    "User with given login and loginType does not exist": "Bunday foydalanuvchi topilmadi",
    "Code is wrong": "Kod noto‘g‘ri",
};

export function getErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        if (Array.isArray(message)) return "Ma’lumotlarni tekshirib, qaytadan urinib ko‘ring";
        if (typeof message === "string") return ERROR_MESSAGES[message] || message;
    }
    return "Xatolik yuz berdi, qaytadan urinib ko‘ring";
}