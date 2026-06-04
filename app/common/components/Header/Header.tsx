"use client"
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

const menuItems = [
    { label: "Asosiy", path: "/" },
    { label: "Yangiliklar", path: "/news" },
    { label: "Kurslar", path: "/courses" },
    { label: "Kutubxona", path: "/book" },
    { label: "Bog'lanish", path: "/contact" },
];

function NavItem({ label, path, index, activeIndex }: {
    label: string;
    path: string;
    index: number;
    activeIndex: number;
}) {
    const router = useRouter();
    const isActive = activeIndex === index;

    return (
        <li
            onClick={() => { (index); router.push(path); }}
            className="relative cursor-pointer py-2 group"
        >
            <span className={`font-poppins text-sm transition-all duration-300 ${
                isActive ? "text-white" : "text-gray-400 hover:text-white"
            }`}>
                {label}
            </span>
            {isActive && <div className="left-0 w-full h-[2px] bg-[#00A3FF]"></div>}
        </li>
    );
}

export default function HeaderItem() {
    const pathname = usePathname();
    const activeIndex = menuItems.findIndex(item => item.path === pathname);

    return (
        <header className="w-[1460px] h-[76px] border-[#232627] border-[1px] bg-[#1A1D1F] rounded-2xl flex items-center justify-between ml-[34px] mt-[20px]">
            <div className="flex items-center my-[26px] ml-[24px]">
                <Image src='/icon1.svg' alt="shaxmat icon" className="w-[103.61px] h-[28px] mb-[4px]" width={104} height={28}/>
                <div className="h-[24px] w-px bg-gray-500"></div>
                <div className="flex w-[112px] h-[24px] gap-14">
                    <span className="text-white text-sm font-medium size-4 font-poppins mb-1 ml-4">O'zbekcha</span>
                    <Image src="/HeaderImage/icon2.svg" alt="select icon" width={16} height={16}/>
                </div>
            </div>

            <ul className="flex items-center gap-10">
                {menuItems.map((item, index) => (
                    <NavItem
                        key={index}
                        label={item.label}
                        path={item.path}
                        index={index}
                        activeIndex={activeIndex}
                    />
                ))}
            </ul>

            <div className="w-[293px] h-[40px] flex items-center gap-6">
                <div className="w-[120px] h-[24px] flex gap-6">
                    <Image src="/HeaderImage/icon5.svg" alt="icon" className="w-[24px] h-[24px] cursor-pointer" width={24} height={24}/>
                    <Image src="/HeaderImage/icon3.svg" alt="icon" className="w-[24px] h-[24px] cursor-pointer" width={24} height={24}/>
                    <Image src="/HeaderImage/icon4.svg" alt="icon" className="w-[24px] h-[24px] cursor-pointer" width={24} height={24}/>
                </div>
                <div className="h-[24px] w-px bg-gray-500"></div>
                <button className="text-white flex justify-center items-center bg-[#1C92E0] w-33 h-10 gap-[10px] rounded-[8px] mr-5 cursor-pointer hover:bg-gray-600">
                    Kirish
                    <Image src="/HeaderImage/icon6.svg" alt="icon" className="w-5 h-5" width={20} height={20}/>
                </button>
            </div>
        </header>
    );
}