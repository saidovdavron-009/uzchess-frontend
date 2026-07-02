import axios from "axios";
import {resolveImageUrl} from "@/app/common/utils/imageUrl";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface CartItem {
    id: number;
    userId: number;
    target: "book" | "souvenir";
    targetId: number;
    quantity: number;
}

export interface BookDetail {
    id: number;
    title: string;
    image: string;
    price: string;
    newPrice: string;
}

export interface OrderWithDetail {
    cartId: number;
    target: "book" | "souvenir";
    quantity: number;
    item: BookDetail;
}

function formatPrice(price: string): string {
    const num = Math.round(Number(price));
    return num.toLocaleString("ru-RU").replace(/,/g, " ") + ".00 UZS";
}

export function getOrderStatus(id: number): { label: string; color: string; bg: string; bgCls: string; colorCls: string } {
    const n = id % 3;
    if (n === 0) return { label: "Yetkazib berildi",            color: "#82CC27", bg: "rgba(130,204,39,0.08)", bgCls: "bg-[rgba(130,204,39,0.08)]", colorCls: "text-[#82CC27]" };
    if (n === 1) return { label: "Buyurtma ko'rib chiqilmoqda", color: "#E0B431", bg: "rgba(224,181,49,0.08)", bgCls: "bg-[rgba(224,181,49,0.08)]", colorCls: "text-[#E0B431]" };
    return         { label: "Bekor qilingan",                   color: "#DB2C2C", bg: "rgba(221,77,33,0.08)",  bgCls: "bg-[rgba(221,77,33,0.08)]",  colorCls: "text-[#DB2C2C]" };
}

async function fetchCartItems(token: string): Promise<CartItem[]> {
    if (!token) return [];
    try {
        const { data } = await axios.get(`${API_URL}/public/cart`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return Array.isArray(data) ? data : (data.data ?? []);
    } catch {
        return [];
    }
}

async function fetchBookDetail(id: number): Promise<BookDetail | null> {
    try {
        const { data } = await axios.get(`${API_URL}/public/book/${id}`);
        return {
            id: data.id,
            title: data.title,
            image: resolveImageUrl(data.image),
            price: formatPrice(data.newPrice ?? data.price),
            newPrice: formatPrice(data.price),
        };
    } catch {
        return null;
    }
}

export async function fetchMyOrders(token: string): Promise<OrderWithDetail[]> {
    const items = await fetchCartItems(token);
    const results = await Promise.all(
        items.map(async (item) => {
            const detail = await fetchBookDetail(item.targetId);
            if (!detail) return null;
            return {
                cartId: item.id,
                target: item.target,
                quantity: item.quantity,
                item: detail,
            };
        })
    );
    return results.filter((r): r is OrderWithDetail => r !== null);
}