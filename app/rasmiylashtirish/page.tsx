"use client"
import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import axios from "axios";
import {getToken} from "@/app/common/components/Auth/authApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

function formatPrice(price: number): string {
    return Number(price).toLocaleString("ru-RU").replace(/,/g, " ") + ".00 UZS";
}

export default function Page() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [tolovNarxi, setTolovNarxi] = useState(0);
    const [chegirma, setChegirma] = useState(0);
    const [jami, setJami] = useState(0);
    const [showOrderModal, setShowOrderModal] = useState(false);
    const [orderNumber, setOrderNumber] = useState("");
    const [copied, setCopied] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    function handleOrder() {
        setSubmitted(true);
        if (!fullName.trim() || !phone.trim() || !email.trim()) return;
        const num = String(Math.floor(10000000000 + Math.random() * 90000000000));
        setOrderNumber(num);
        setShowOrderModal(true);
    }

    function handleCopy() {
        navigator.clipboard.writeText(orderNumber).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    }

    useEffect(() => {
        const token = getToken() ?? "";
        if (!token) return;
        axios.get(`${API_URL}/public/cart`, {headers: {Authorization: `Bearer ${token}`}})
            .then(async res => {
                const rows = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                let tN = 0, ch = 0;
                await Promise.all(rows.map(async (row: {target: string; targetId: number; quantity: number}) => {
                    try {
                        const url = row.target === "book"
                            ? `${API_URL}/public/book/${row.targetId}`
                            : `${API_URL}/public/souvenir/${row.targetId}`;
                        const {data} = await axios.get(url);
                        const price = Number(data.price ?? 0);
                        const newPrice = Number(data.newPrice ?? data.price ?? 0);
                        const qty = row.quantity;
                        tN += (price > 0 ? price : newPrice) * qty;
                        ch += Math.max(0, price - (newPrice > 0 ? newPrice : price)) * qty;
                    } catch {}
                }));
                setTolovNarxi(tN);
                setChegirma(ch);
                setJami(tN - ch);
            })
            .catch(() => {});
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-[#111315]">
            <HeaderItem/>

            <div className="flex gap-[8px] h-[44px] items-center ml-[64px]">
                <Image src="/NewsImage/icon8.svg" alt="" width={16} height={16}/>
                <span className="text-[#6D7274] text-[14px] font-medium font-poppins">Asosiy</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#6D7274] text-[14px] font-medium font-poppins">Savatcha</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">Rasmiylashtirish</span>
            </div>

            <div className="px-[32px] mt-[12px] pb-[40px] flex gap-[24px] items-start">

                <div className="mt-[2px]">
                    <div className="w-[909px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] overflow-hidden">
                        <div className="pt-[24px] px-[24px]">
                            <h2 className="text-[#F7F9FA] text-[20px] font-bold font-poppins">
                                Shaxsiy ma&apos;lumotlaringizni kiriting
                            </h2>

                            <div className="mt-[16px] flex flex-col gap-[20px]">
                                <div className="flex flex-col gap-[8px] w-[420px]">
                                    <label className="text-[#9DA1A3] text-[15px] font-medium font-poppins">
                                        To&apos;liq ismingiz
                                    </label>
                                    <input
                                        value={fullName}
                                        onChange={e => setFullName(e.target.value)}
                                        placeholder="To'liq ismingizni kiriting"
                                        className={`w-[420px] h-[44px] bg-[#13181C] rounded-[8px] px-[16px] text-[#F7F9FA] text-[16px] font-medium font-poppins placeholder-[#4D555A] outline-none border ${submitted && !fullName.trim() ? "border-[#E53935]" : "border-[#36393B]"}`}
                                    />
                                    {submitted && !fullName.trim() && (
                                        <span className="text-[#E53935] text-[12px] font-medium font-poppins">Hamma maydonlarni to&apos;ldiring</span>
                                    )}
                                </div>

                                <div className="flex gap-[20px]">
                                    <div className="flex flex-col gap-[8px] w-[420px]">
                                        <label className="text-[#9DA1A3] text-[15px] font-medium font-poppins">
                                            Telefon raqamingiz
                                        </label>
                                        <div className={`w-[420px] h-[44px] bg-[#13181C] rounded-[8px] flex items-center overflow-hidden border ${submitted && !phone.trim() ? "border-[#E53935]" : "border-[#36393B]"}`}>
                                            <div className="w-[66px] h-full bg-[#1A1D1F] flex items-center justify-center shrink-0 border-r border-[#36393B]">
                                                <span className="text-[#F7F9FA] text-[16px] font-medium font-poppins">+998</span>
                                            </div>
                                            <input
                                                value={phone}
                                                onChange={e => setPhone(e.target.value)}
                                                placeholder="__ ___ __ __"
                                                className="flex-1 h-full bg-transparent px-[12px] text-[#F7F9FA] text-[16px] font-medium font-poppins placeholder-[#4D555A] outline-none"
                                            />
                                        </div>
                                        {submitted && !phone.trim() && (
                                            <span className="text-[#E53935] text-[12px] font-medium font-poppins">Hamma maydonlarni to&apos;ldiring</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-[8px] w-[420px]">
                                        <label className="text-[#9DA1A3] text-[15px] font-medium font-poppins">
                                            Elektron pochta
                                        </label>
                                        <input
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="Misol: j.pulatov@uic.group"
                                            className={`w-[420px] h-[44px] bg-[#13181C] rounded-[8px] px-[16px] text-[#F7F9FA] text-[16px] font-medium font-poppins placeholder-[#4D555A] outline-none border ${submitted && !email.trim() ? "border-[#E53935]" : "border-[#36393B]"}`}
                                        />
                                        {submitted && !email.trim() && (
                                            <span className="text-[#E53935] text-[12px] font-medium font-poppins">Hamma maydonlarni to&apos;ldiring</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-[64px] ml-[24px] h-[1px] bg-[#1A2226]"/>

                        <div className="px-[24px] pt-[20px] pb-[24px] flex items-center justify-between">
                            <button
                                onClick={() => router.back()}
                                className="w-[201px] h-[44px] bg-[#FFFFFF1A] rounded-[8px] flex items-center justify-center text-[#F7F9FA] text-[16px] font-medium font-poppins hover:opacity-80 transition-opacity">
                                Bekor qilish
                            </button>
                            <button
                                onClick={handleOrder}
                                className="w-[200px] h-[44px] bg-[#1C92E0] rounded-[8px] flex items-center justify-center text-[#F7F9FA] text-[16px] font-medium font-poppins hover:opacity-90 transition-opacity">
                                Buyurtma berish
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-[443px] shrink-0 bg-[#0B1418] border border-[#1F272A] rounded-[16px] p-[20px] flex flex-col gap-[16px]">
                    <div className="flex justify-between items-center">
                        <span className="text-[#FFFFFF] text-[20px] font-medium font-poppins">Jami:</span>
                        <span className="text-[#FFFFFF] text-[20px] font-bold font-poppins">
                            {jami > 0 ? formatPrice(jami) : "-"}
                        </span>
                    </div>

                    <div className="w-full h-[1px] bg-[#1D2529]"/>

                    <div className="flex flex-col gap-[8px]">
                        <div className="flex justify-between items-center">
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">Yetkazib berish:</span>
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">-</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">Yetkazib berish narxi:</span>
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">-</span>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#1D2529]"/>

                    <div className="flex flex-col gap-[8px]">
                        <div className="flex justify-between items-center">
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">To&apos;lov narxi:</span>
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">
                                {tolovNarxi > 0 ? formatPrice(tolovNarxi) : "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">Kommissiya narxi:</span>
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">0 UZS (0%)</span>
                        </div>
                    </div>

                    <div className="w-full h-[1px] bg-[#1D2529]"/>

                    <div className="flex flex-col gap-[8px]">
                        <div className="flex justify-between items-center">
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">Chegirma:</span>
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">
                                {chegirma > 0
                                    ? `${formatPrice(chegirma)} (${Math.round(chegirma / tolovNarxi * 100)}%)`
                                    : "-"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">Kupon:</span>
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">-</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">To&apos;lov usuli:</span>
                            <span className="text-[#FFFFFF] text-[16px] font-normal font-poppins">-</span>
                        </div>
                    </div>

                    <div className="flex items-start gap-[12px] border border-[#1D2529] rounded-[10px] p-[12px]">
                        <div className="w-[32px] h-[32px] bg-[#ffffff] rounded-[6px] flex items-center justify-center shrink-0">
                            <Image src="/info-icon.svg" alt="info" width={24} height={24}/>
                        </div>
                        <p className="text-[#9FA2A4] text-[13px] font-medium font-poppins leading-[1.5]">
                            Yetkazishda borishda yo&apos;l tufayli muammo tug&apos;ilatigan xolatlarda, qo&apos;shimcha xaqq talab qilinishi mumkin.
                        </p>
                    </div>
                </div>
            </div>

            <Footer/>

            {showOrderModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="relative flex items-start">

                        <div className="w-[440px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] flex flex-col items-center pt-[44px] pb-[18px]">

                            <Image src="/galochka.png" alt="success" width={64} height={64} className="shrink-0"/>

                            <h3 className="mt-[20px] w-[297px] text-[#F7F9FA] text-[24px] font-bold font-poppins text-center leading-[1.4]">
                                Buyurtma rasmiylashtirildi
                            </h3>

                            <p className="mt-[8px] w-[400px] text-[#9DA1A3] text-[16px] font-normal font-poppins text-center leading-[1.3]">
                                Tez orada siz bilan aloqaga chiqishadi va keyingi qadamlar haqida ma&apos;lumot beriladi.
                            </p>

                            <div className="mt-[20px] w-[245px] h-[110px] bg-[#091013] border border-[#161C1F] rounded-[12px] flex flex-col items-center justify-center gap-[8px]">
                                <span className="text-[#9DA1A3] text-[12px] font-bold font-poppins uppercase tracking-[3.6px]">
                                    Buyurtma raqami
                                </span>
                                <div className="w-[212px] h-[42px] bg-[#13181C] border border-[#253036] rounded-[8px] flex items-center pl-[12px] gap-[10px]">
                                    <span className="text-[#F7F9FA] text-[24px] font-medium font-poppins flex-1 leading-none">
                                        {orderNumber}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="w-[42px] h-[42px] bg-[#253036] flex items-center justify-center shrink-0 hover:opacity-70 transition-opacity rounded-r-[8px]">
                                        <Image src="/copy-icon.svg" alt="copy" width={24} height={24} className={copied ? "opacity-50" : "opacity-100"}/>
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push("/")}
                                className="mt-[24px] w-[392px] h-[44px] bg-[#1C91E0] rounded-[8px] flex items-center justify-center text-[#F7F9FA] text-[16px] font-medium font-poppins hover:opacity-90 transition-opacity">
                                Asosiyga qaytish
                            </button>
                        </div>

                        <button
                            onClick={() => setShowOrderModal(false)}
                            className="absolute top-0 -right-[52px] w-[40px] h-[40px] bg-[#1A1D1F] rounded-[8px] flex items-center justify-center hover:opacity-70 transition-opacity">
                            <Image src="/modal-x.svg" alt="close" width={32} height={32}/>
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}