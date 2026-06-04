import Image from "next/image";

export default function Footer(){
    return <footer className="mt-[54px] w-full h-[208px] flex flex-col gap-4 items-center justify-center bg-[#1A1D1F]">
        <Image src="/icon1.svg" alt="icon chess" className="w-[112.62px] h-[28px]" width={113} height={28}/>
        <div className="w-[632px] h-[21px] flex gap-6">
            <p className="w-[97px] h-[21px] text-[14px] font-normal tracking-tight hover:text-[#1C92E0] cursor-pointer">Biz haqimizda</p>
            <p className="w-[151px] h-[21px] text-[14px] font-normal tracking-tight hover:text-[#1C92E0]">Cookie fayllar siyosati</p>
            <p className="w-[151px] h-[21px] text-[14px] font-normal tracking-tight hover:text-[#1C92E0] cursor-pointer">Foydalanuvchi qoidalari</p>
            <p className="w-[151px] h-[21px] text-[14px] font-normal tracking-tight hover:text-[#1C92E0] cursor-pointer">Cookie fayllar siyosati</p>
        </div>
        <div className="w-[148px] h-[20px] flex gap-3">
            <Image src="/FooterImage/instagram.svg" alt="instagram icon" className="hover:bg-[#1C92E0] rounded-[8px] cursor-pointer" width={20} height={20}/>
            <Image src="/FooterImage/telegram.svg" alt="telegram icon" className="hover:bg-[#1C92E0] rounded-[8px] cursor-pointer" width={20} height={20}/>
            <Image src="/FooterImage/youtube.svg" alt="youtube icon" className="hover:bg-[#1C92E0] rounded-[8px] cursor-pointer" width={20} height={20}/>
            <Image src="/FooterImage/twitter.svg" alt="twitter icon" className="hover:bg-[#1C92E0] rounded-[8px] cursor-pointer" width={20} height={20}/>
            <Image src="/FooterImage/facebook%2001.svg" alt="facebook icon" className="hover:bg-[#1C92E0] rounded-[8px] cursor-pointer" width={20} height={20}/>
        </div>
        <div className="flex justify-between w-full h-[50px]z rounded-t-2px border-t-[#F7F9FA1A] border-t-1 mb-[-37px] pt-[14px] px-[32px] pb-[11px]">
            <p className="w-[238px] h-[24px] font-normal text-[16px] tracking-tight">© UzChess. All rights reserved.</p>
            <Image src="/FooterImage/Group%201.svg" alt="icon" className="w-[33px] h-[18px] mt-1" width={33} height={18}/>
            <p className="w-[172px] h-[24px] font-normal text-[16px] tracking-tight">Foydalanish qoidalari</p>
        </div>
    </footer>
}