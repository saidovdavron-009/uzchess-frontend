import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import Image from "next/image";
import RankingFilters from "@/app/reyting/components/RankingFilters";
import RankingTable from "@/app/reyting/components/RankingTable";

export default function Page() {
    return <div>
        <HeaderItem/>
        <div className="flex gap-2 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
            <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
            <h4 className="w-[42px] h-[18px] text-[#6D7274] font-medium mb-1">Asosiy</h4>
            <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
            <h4 className="w-[42px] h-[18px] text-white font-medium mb-1">Reyting</h4>
        </div>
        <div className="m-[32px] flex gap-6 items-start">
            <RankingFilters/>
            <RankingTable/>
        </div>
        <Footer/>
    </div>
}