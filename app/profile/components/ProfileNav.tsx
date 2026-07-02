import Image from "next/image";
import Link from "next/link";

const tabs = [
    {label: "Sotib olingan kurslar", icon: "/ProfileImage/courses-stack.svg", href: "/profile/purchased-courses"},
    {label: "Buyurtmalar", icon: "/ProfileImage/orders-rocket.svg", href: "/profile/orders"},
    {label: "Saqlanganlar", icon: "/ProfileImage/saved-heart.svg", href: "/profile/saved"},
];

export default function ProfileNav({active}: { active?: string }) {
    return (
        <div className="w-[326px] bg-[#1A1D1F] border border-[#1F272A] rounded-[16px] p-[20px] flex flex-col gap-[12px]">
            {tabs.map((tab) => {
                const isActive = active === tab.label;
                return (
                    <Link
                        key={tab.label}
                        href={tab.href}
                        className={`w-full h-[60px] rounded-[12px] bg-[#13181C] flex items-center pl-[18px] pr-[18px] gap-[12px] transition-colors border ${
                            isActive
                                ? " border-[#1C92E0]"
                                : "border-transparent hover:border-[#1C92E0]/40"
                        }`}
                    >
                        <Image src={tab.icon} alt="" width={24} height={24}/>
                        <span className={`font-poppins text-[16px] font-medium ${
                            isActive ? "text-[#F7F9FA]" : "text-[#9DA0A1]"
                        }`}>
                            {tab.label}
                        </span>
                    </Link>
                );
            })}
            <Link
                href="/profile"
                className={`w-full h-[60px] rounded-[12px] bg-[#13181C] flex items-center pl-[18px] pr-[18px] gap-[12px] transition-colors border ${
                    active === "settings"
                        ? "border-[#1C92E0]"
                        : "border-transparent hover:border-[#1C92E0]/40"
                }`}
            >
                <Image src="/ProfileImage/settings-person.svg" alt="" width={24} height={24}/>
                <span className={`font-poppins text-[16px] font-medium ${
                    active === "settings" ? "text-[#F7F9FA]" : "text-[#9DA0A1]"
                }`}>
                    Umumiy sozlamalar
                </span>
            </Link>
        </div>
    );
}
