import Link from "next/link";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col bg-[#111315]">
            <HeaderItem/>

            <div className="flex gap-[8px] h-[44px] items-center ml-[64px]">
                <Image src="/NewsImage/icon8.svg" alt="" width={16} height={16}/>
                <span className="text-[#6D7274] text-[14px] font-medium font-poppins">Asosiy</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">404 Sahifa topilmadi</span>
            </div>

            <div className="flex-1 flex items-center justify-center gap-[60px] px-[64px] pb-[60px]">
                <div className="flex flex-col gap-[24px] w-[442px]">
                    <span
                        className="text-[140px] text-[#F7F9FA] font-bold font-poppins leading-none">
                        404
                    </span>

                    <div className="flex flex-col gap-[12px]">
                        <h1 className="text-[#FFFFFF] text-[32px] font-bold font-poppins">Sahifa topilmadi</h1>
                        <p className="text-[#ABABAF] text-[20px] font-medium font-poppins">
                            Uups... Siz qidirayotgan sahifani topa olmadik :(
                        </p>
                    </div>

                    <Link
                        href="/"
                        className="w-[294px] h-[50px] bg-[#1C91E0] rounded-[8px] flex items-center justify-center gap-[10px] hover:bg-[#177db3] transition-colors">
                        <Image src="/home-icon.svg" alt="home" width={20} height={20}/>
                        <span className="text-[#F7F9FA] text-[20px] font-medium font-poppins">Asosiyga qaytish</span>
                    </Link>
                </div>

                <Image
                    src="/shaxmat.png"
                    alt="chess board"
                    width={700}
                    height={429}
                    className="shrink-0 rounded-[6px]"
                    unoptimized
                />
            </div>
        </div>
    );
}
