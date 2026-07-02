"use client"
import {useState} from "react";
import {useRouter} from "next/navigation";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import Image from "next/image";
import YoshlarAgencyPoster from "@/app/common/components/yoshlar-agency-poster";
import dynamic from "next/dynamic";

const ContactMap = dynamic(() => import("@/app/common/components/ContactMap"), {ssr: false});

const infoCards = [
    {label: "Ish vaqti",          value: "Dushanba-Juma 9:00-18:00", icon: "/contact-calendar.svg"},
    {label: "E-mail",             value: "info@chessnation.uz",       icon: "/contact-email.svg"},
    {label: "Telefon",            value: "+998 (71) 203 55 11",       icon: "/contact-phone.svg"},
    {label: "Yaqin metro",        value: "Mingo’rik",                 icon: "/contact-metro.svg"},
];

export default function ContactPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const router = useRouter();

    function handleSubmit() {
        setSubmitted(true);
        if (!name.trim() || !phone.trim() || !message.trim() || !agreed) return;
        setShowSuccess(true);
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#202020]">
            <HeaderItem/>
            <div className="flex gap-2 h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="" width={20} height={20}/>
                <span className="text-[#6D7274] text-[14px] font-medium font-poppins">Asosiy</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">Bog&apos;lanish</span>
            </div>

            <div className="px-[32px] mt-[16px] pb-[40px] flex gap-[24px] items-start justify-between">
                <div className="flex flex-col gap-[24px]">
                    <div
                        className="w-[1024px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] p-[24px] flex flex-col gap-[20px]">
                        <h2 className="text-[#F7F9FA] text-[28px] font-bold font-poppins">Bog&apos;lanish</h2>

                        <div className="flex gap-[20px]">
                            <div
                                className="flex-1 border border-[#1A2226] rounded-[12px] p-[20px] flex flex-col gap-[20px]">
                                <div className="flex gap-[20px]">
                                    <div className="flex flex-col gap-[8px] w-[296px]">
                                        <label className="text-[#F7F9FA] text-[14px] font-medium font-poppins">
                                            Siz bilan bog&apos;lanish
                                        </label>
                                        <input
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Ism familiyangizni kiriting"
                                            className={`w-[296px] h-[44px] bg-[#13181C] rounded-[12px] px-[16px] text-[#F7F9FA] text-[14px] font-poppins placeholder-[#4D555A] outline-none border ${submitted && !name.trim() ? "border-[#E53935]" : "border-[#454F54]"}`}
                                        />
                                        {submitted && !name.trim() && (
                                            <span className="text-[#E53935] text-[12px] font-medium font-poppins">Hamma maydonlarni to&apos;ldiring</span>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-[8px] w-[296px]">
                                        <label className="text-[#F7F9FA] text-[14px] font-medium font-poppins">
                                            Telefon raqamingiz
                                        </label>
                                        <div
                                            className={`w-[296px] h-[44px] bg-[#13181C] rounded-[12px] flex items-center overflow-hidden border ${submitted && !phone.trim() ? "border-[#E53935]" : "border-[#454F54]"}`}>
                                            <div
                                                className="w-[64px] h-full bg-[#1A1D1F] flex items-center justify-center shrink-0 border-r border-[#454F54]">
                                                <span
                                                    className="text-[#F7F9FA] text-[14px] font-medium font-poppins">+998</span>
                                            </div>
                                            <input
                                                value={phone}
                                                onChange={e => setPhone(e.target.value.replace(/\D/g, ""))}
                                                inputMode="numeric"
                                                placeholder="__ ___ __ __"
                                                className="flex-1 h-full bg-transparent px-[12px] text-[#F7F9FA] text-[14px] font-medium font-poppins placeholder-[#4D555A] outline-none"
                                            />
                                        </div>
                                        {submitted && !phone.trim() && (
                                            <span className="text-[#E53935] text-[12px] font-medium font-poppins">Hamma maydonlarni to&apos;ldiring</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-[8px]">
                                    <label
                                        className="text-[#F7F9FA] text-[14px] font-medium font-poppins">Shikoyat</label>
                                    <textarea
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        placeholder="Matnni yozing..."
                                        className={`w-full h-[128px] bg-[#13181C] rounded-[12px] px-[16px] py-[12px] text-[#F7F9FA] text-[14px] font-poppins placeholder-[#4D555A] outline-none resize-none border ${submitted && !message.trim() ? "border-[#E53935]" : "border-[#454F54]"}`}
                                    />
                                    {submitted && !message.trim() && (
                                        <span className="text-[#E53935] text-[12px] font-medium font-poppins">Hamma maydonlarni to&apos;ldiring</span>
                                    )}
                                </div>

                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-[8px] cursor-pointer">
                                        <div
                                            onClick={() => setAgreed(p => !p)}
                                            className={`w-[24px] h-[24px] rounded-[4px] border-2 border-[#ffffff] flex items-center justify-center shrink-0 cursor-pointer ${agreed ? "bg-[#1C91E0]" : "bg-[#2E393F]"}`}>
                                            {agreed && (
                                                <Image src="/icon-check-white.svg" alt="" width={14} height={10}/>
                                            )}
                                        </div>
                                        <span className="text-[#F7F9FA] text-[16px] font-normal font-poppins">
                                        Foydalanish{" "}
                                            <span
                                                className="text-[#1C91E0] cursor-pointer hover:underline">shartlari</span>
                                            {" "}va{" "}
                                            <span
                                                className="text-[#1C91E0] cursor-pointer hover:underline">qoidalarini</span>
                                            {" "}qabul qilaman
                                    </span>
                                    </label>

                                    <div className="flex flex-col items-end gap-[4px]">
                                        {submitted && !agreed && (
                                            <span className="text-[#E53935] text-[12px] font-medium font-poppins">Shartlarni qabul qiling</span>
                                        )}
                                        <button
                                            onClick={handleSubmit}
                                            className="w-[180px] h-[44px] bg-[#1C91E0] rounded-[8px] flex items-center justify-center text-[#F7F9FA] text-[16px] font-medium font-poppins hover:bg-[#177db3] transition-colors shrink-0">
                                            Yuborish
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="w-[304px] shrink-0 flex flex-col gap-[21px]">
                                {infoCards.map((card, i) => (
                                    <div key={i}
                                         className="w-[304px] h-[72px] border border-[#1A2226] rounded-[12px] px-[16px] flex items-center">
                                        <div className="flex items-center gap-[12px] w-full">
                                            <Image src={card.icon} alt={card.label} width={28} height={28} className="shrink-0"/>
                                            <div className="flex flex-col gap-[4px]">
                                                <span
                                                    className="text-[#9DA1A3] text-[14px] font-medium font-poppins">{card.label}</span>
                                                <span
                                                    className="text-[#F7F9FA] text-[16px] font-medium font-poppins">{card.value}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <ContactMap/>
                </div>

                <div className="shrink-0">
                    <YoshlarAgencyPoster/>
                </div>
            </div>

            <Footer/>

            {showSuccess && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]">
                    <div className="relative w-[440px]">
                        <button
                            onClick={() => setShowSuccess(false)}
                            className="absolute right-[-44px] top-[2px] w-[32px] h-[32px] flex items-center justify-center rounded-[8px] hover:opacity-70 transition-opacity bg-[#1A1D1F]">
                            <Image src="/close-x.svg" alt="" width={18} height={18}/>
                        </button>
                        <div
                            className="w-[440px] h-[283px] bg-[#1A1D1F] rounded-[12px] flex flex-col items-center px-[24px] pt-[24px] pb-[24px]">
                            <Image src="/galochka.png" alt="success" width={54} height={54}/>
                            <h3 className="text-[#F7F9FA] text-[24px] font-bold font-poppins text-center mt-[16px]">
                                Muvaffaqiyatli yuborildi
                            </h3>
                            <p className="text-[#9DA1A3] text-[14px] font-normal font-poppins text-center mt-[8px]">
                                Shikoyatingiz muvaffaqiyatli yuborildi
                            </p>
                            <button
                                onClick={() => router.push("/courses")}
                                className="w-full h-[44px] bg-[#1C91E0] rounded-[8px] flex items-center justify-center text-[#F7F9FA] text-[16px] font-medium font-poppins hover:bg-[#177db3] transition-colors mt-auto">
                                Kursni ko'rish
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
