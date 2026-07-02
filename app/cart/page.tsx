"use client"
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import axios from "axios";
import {getToken} from "@/app/common/components/Auth/authApi";
import Anons from "@/app/common/components/Anons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface CartRow {
    id: number;
    target: "book" | "souvenir";
    targetId: number;
    quantity: number;
}

interface CartItem extends CartRow {
    title: string;
    image: string;
    price: number;
    newPrice: number;
}

function fixUrl(path: string): string {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${API_URL}/${path.replace(/\\/g, "/")}`;
}

function formatPrice(price: number): string {
    return Number(price).toLocaleString("ru-RU").replace(/,/g, " ") + ".00 uzs";
}

async function fetchItemDetail(target: string, targetId: number) {
    try {
        if (target === "book") {
            const {data} = await axios.get(`${API_URL}/public/book/${targetId}`);
            return {
                title: data.title ?? "",
                image: fixUrl(data.image ?? ""),
                price: Number(data.price ?? 0),
                newPrice: Number(data.newPrice ?? data.price ?? 0),
            };
        } else {
            const {data} = await axios.get(`${API_URL}/public/souvenir/${targetId}`);
            const img = data.souvenirImage?.[0]?.image ?? data.image ?? "";
            return {
                title: data.title ?? "",
                image: fixUrl(img),
                price: Number(data.price ?? 0),
                newPrice: Number(data.newPrice ?? data.price ?? 0),
            };
        }
    } catch {
        return null;
    }
}

export default function CartPage() {
    const router = useRouter();
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [kupon, setKupon] = useState("");

    useEffect(() => {
        const token = getToken() ?? "";
        if (!token) {
            setLoading(false);
            return;
        }
        axios.get(`${API_URL}/public/cart`, {headers: {Authorization: `Bearer ${token}`}})
            .then(async res => {
                const rows: CartRow[] = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                const filled = await Promise.all(rows.map(async row => {
                    const detail = await fetchItemDetail(row.target, row.targetId);
                    return detail ? {...row, ...detail} : null;
                }));
                setItems(filled.filter((i): i is CartItem => i !== null));
            })
            .catch(() => {
            })
            .finally(() => setLoading(false));
    }, []);

    async function handleQuantity(cartId: number, delta: number, current: number) {
        const next = current + delta;
        if (next < 1) return;
        const token = getToken() ?? "";
        try {
            await axios.patch(`${API_URL}/public/cart/${cartId}`, {quantity: next}, {headers: {Authorization: `Bearer ${token}`}});
            setItems(prev => prev.map(i => i.id === cartId ? {...i, quantity: next} : i));
        } catch {
        }
    }

    async function handleRemove(cartId: number) {
        const token = getToken() ?? "";
        try {
            await axios.delete(`${API_URL}/public/cart/${cartId}`, {headers: {Authorization: `Bearer ${token}`}});
            setItems(prev => prev.filter(i => i.id !== cartId));
        } catch {
        }
    }

    const tolovNarxi = items.reduce((s, i) => s + (i.price > 0 ? i.price : i.newPrice) * i.quantity, 0);
    const chegirma = items.reduce((s, i) => s + Math.max(0, i.price - (i.newPrice > 0 ? i.newPrice : i.price)) * i.quantity, 0);
    const jami = tolovNarxi - chegirma;

    return (
        <div className="min-h-screen flex flex-col bg-[#202020]">
            <HeaderItem/>

            <div className="flex gap-[8px] h-[44px] items-center ml-[64px]">
                <Image src="/NewsImage/icon8.svg" alt="" width={16} height={16}/>
                <span className="text-[#6D7274] text-[14px] font-medium font-poppins">Asosiy</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">Savatcha</span>
            </div>

            <div className="flex gap-[24px] px-[32px] pb-[40px] mt-[24px]">
                <div className="flex flex-col gap-[20px] flex-1">
                    {loading ? (
                        <p className="text-white font-poppins text-center mt-20">Yuklanmoqda...</p>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-20 gap-4">
                            <Image src="/HeaderImage/icon3.svg" alt="" width={64} height={64}/>
                            <p className="text-[#9DA1A3] font-poppins text-[18px]">Savatcha bo'sh</p>
                        </div>
                    ) : items.map(cartItem => {
                        const {id, quantity, title, image, price, newPrice} = cartItem;
                        const displayPrice = newPrice > 0 ? newPrice : price;
                        const hasDiscount = price > newPrice && newPrice > 0;

                        return (
                            <div key={id}
                                 className="relative w-[1024px] h-[184px] bg-[#1A1D1F] rounded-[8px] shrink-0 border border-[#1F272A]">
                                <button
                                    onClick={() => handleRemove(id)}
                                    className="absolute top-[-10px] right-[-10px] w-[32px] h-[32px] bg-[#151D21] rounded-full border border-[#1F272A] flex items-center justify-center hover:opacity-80 transition-opacity z-10"
                                >
                                    <Image src="/icon-cart-remove.svg" alt="" width={11} height={11}/>
                                </button>

                                <div
                                    className="absolute left-[20px] top-[20px] w-[144px] h-[144px] bg-[#13181C] rounded-[6px] overflow-hidden">
                                    {image ? (
                                        <Image src={image} alt={title} fill className="object-cover" unoptimized/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Image src="/HeaderImage/icon3.svg" alt="" width={40} height={40}/>
                                        </div>
                                    )}
                                </div>

                                <div className="absolute left-[176px] top-[24px] w-[602px]">
                                    <h3 className="text-[#F7F9FA] text-[20px] font-bold font-poppins leading-6 line-clamp-2">
                                        {title}
                                    </h3>
                                </div>

                                <div className="absolute left-[176px] top-[108px] flex flex-col gap-[4px]">
                                    <span className="text-[#82CC27] text-[24px] font-bold font-poppins leading-tight">
                                        {formatPrice(displayPrice)}
                                    </span>
                                    {hasDiscount && (
                                        <div className="relative w-fit">
                                            <span className="text-[#F7F9FA] text-[16px] font-poppins opacity-60">
                                                {formatPrice(price)}
                                            </span>
                                            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-[#DB2C2C]"/>
                                        </div>
                                    )}
                                </div>

                                <div className="absolute right-[24px] top-[108px] flex items-center gap-[6px]">
                                    <button
                                        onClick={() => handleQuantity(id, -1, quantity)}
                                        className="w-[40px] h-[40px] bg-[#DB2C2C] rounded-[6px] flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                                    >
                                        <Image src="/icon-minus.svg" alt="" width={12} height={12}/>
                                    </button>
                                    <div
                                        className="w-[88px] h-[40px] bg-[#13181C] rounded-[6px] flex items-center justify-center">
                                        <span className="text-[#F7F9FA] text-[16px] font-medium font-poppins">
                                            {quantity}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleQuantity(id, +1, quantity)}
                                        className="w-[40px] h-[40px] bg-[#82CC27] rounded-[6px] flex items-center justify-center hover:opacity-80 transition-opacity shrink-0"
                                    >
                                        <Image src="/icon-plus.svg" alt="" width={12} height={12}/>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {items.length > 0 && (
                    <div className="w-[326px] shrink-0 flex flex-col gap-[24px]">
                        <div
                            className="w-[326px] bg-[#0B1418] rounded-[8px] p-[16px] flex flex-col gap-[16px] border border-[#1F272A]">
                            <div className="flex flex-col gap-[12px]">
                                <div className="flex justify-between items-center">
                                    <span className="text-[#F7F9FA] text-[14px] font-poppins">To'lov narxi:</span>
                                    <span
                                        className="text-[#F7F9FA] text-[14px] font-poppins">{formatPrice(tolovNarxi)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#F7F9FA] text-[14px] font-poppins">Chegirma:</span>
                                    <span className="text-[#F7F9FA] text-[14px] font-poppins">
                                        {formatPrice(chegirma)}{chegirma > 0 ? ` (${Math.round(chegirma / tolovNarxi * 100)}%)` : ""}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#F7F9FA] text-[14px] font-poppins">Kupon:</span>
                                    <span className="text-[#F7F9FA] text-[14px] font-poppins">0 UZS</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#F7F9FA] text-[14px] font-poppins">Yetkazib berish</span>
                                    <span className="text-[#F7F9FA] text-[14px] font-poppins">0 UZS</span>
                                </div>
                            </div>

                            <div className="w-full h-[1px] bg-[#1D2529]"/>

                            <div className="flex justify-between items-center">
                                <span className="text-[#F7F9FA] text-[18px] font-bold font-poppins">Jami:</span>
                                <span
                                    className="text-[#F7F9FA] text-[18px] font-bold font-poppins">{formatPrice(jami)}</span>
                            </div>

                            <div className="w-full h-[1px] bg-[#1D2529]"/>

                            <div className="flex flex-col gap-[8px]">
                                <span className="text-[#F7F9FA] text-[14px] font-poppins">Kupon</span>
                                <div
                                    className="w-full h-[44px] bg-[#13181C] rounded-[6px] px-[12px] flex items-center border border-[#1F272A]">
                                    <input
                                        value={kupon}
                                        onChange={e => setKupon(e.target.value)}
                                        placeholder="Kupundagi kodni kiriting"
                                        className="w-full bg-transparent text-[#454F54] text-[14px] font-poppins outline-none placeholder-[#454F54]"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/rasmiylashtirish")}
                                className="w-full h-[50px] bg-[#1C92E0] rounded-[8px] flex items-center justify-center gap-[10px] hover:bg-[#177db3] transition-colors border border-[#1F272A]">
                                <Image src="/pul.png" alt="pul" width={24} height={24} className="brightness-0 invert"/>
                                <span
                                    className="text-[#F7F9FA] text-[16px] font-medium font-poppins">Rasmiylashtirish</span>
                            </button>
                        </div>

                        <Anons/>
                    </div>
                )}
            </div>

            <Footer/>
        </div>
    );
}
