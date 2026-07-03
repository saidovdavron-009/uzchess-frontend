"use client";
import BookFilterItem from "@/app/book/components/BookFilterItem";
import {EMPTY_FILTERS, EntityFilters} from "@/app/common/api/filterOptionsApi";

export default function BookFilters({filters, onChange}: {
    filters: EntityFilters;
    onChange: (next: EntityFilters) => void;
}) {
    return (
        <div className="w-[334px] min-h-[530px] ml-[30px] rounded-[8px] bg-[#1A1D1F] border-[1px] border-[#1F272A] flex flex-col p-[20px] items-center text-white select-none">
            <div className="w-[294px] h-[24px] flex justify-between items-center mb-[4px]">
                <h1 className="text-[16px] font-medium text-white">Filter</h1>
                <button
                    onClick={() => onChange(EMPTY_FILTERS)}
                    className="text-[14px] font-normal text-[#1C92E0] hover:text-blue-400 cursor-pointer transition-colors"
                >
                    Tozalash
                </button>
            </div>

            <BookFilterItem filters={filters} onChange={onChange}/>
        </div>
    );
}
