import BookFilterItem from "@/app/book/components/BookFilterItem";

export default function BookFilters(){
    return <div className="w-[334px] h-[500px] ml-[30px] rounded-[8px] bg-[#1A1D1F] border-[1px] border-[#1F272A] flex flex-col p-[20px] justify-center items-center">
        <div className="w-[294px] h-[24px] flex justify-between">
            <h1 className="w-[44px] h-[23px] font-medium">Filter</h1>
            <button className="w-[71px] h-[24px] font-normal text-[#1C92E0] hover:text-blue-400 cursor-pointer">Tozalash</button>
        </div>
        <BookFilterItem/>
    </div>
}