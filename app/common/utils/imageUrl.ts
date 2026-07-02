const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export function resolveImageUrl(raw: string | null | undefined): string {
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    return `${API_URL}/${raw.replace(/\\/g, "/")}`;
}
