"use client"
import {useState} from "react";
import Image from "next/image";

const COUNTRIES = ["Barchasi", "O'zbekiston", "Rossiya", "AQSH", "Hindiston", "Norvegiya"];
const CATEGORIES = ["Barchasi", "10", "20", "19", "21"];

function FilterDropdown({label, value, options, onSelect}: {
    label: string;
    value: string;
    options: string[];
    onSelect: (val: string) => void;
}) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col gap-4">
            <span
                className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#F7F9FA] uppercase">{label}</span>
            <div className="relative select-none">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-[286px] h-[54px] flex items-center justify-between px-4 rounded-[8px] bg-[#15181A] border border-[#232627] cursor-pointer">
                    <span className="font-poppins font-medium text-[16px] text-[#F7F9FA]">{value}</span>
                    <Image src="/chevron-right.svg" alt="" width={24} height={24}
                           className={`transition-transform duration-200 ${isOpen ? "-rotate-90" : "rotate-90"}`}/>
                </button>
                {isOpen && (
                    <div
                        className="absolute top-[58px] left-0 w-full z-30 p-2 bg-[#15181A] border border-[#232627] rounded-[8px] shadow-lg">
                        {options.map((option) => (
                            <div
                                key={option}
                                onClick={() => {
                                    onSelect(option);
                                    setIsOpen(false);
                                }}
                                className="px-2 py-2 rounded-[6px] font-poppins text-[16px] text-[#F7F9FA] cursor-pointer hover:bg-white/5">
                                {option}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function GameFilters() {
    const [country, setCountry] = useState("Barchasi");
    const [category, setCategory] = useState("Barchasi");

    return (
        <div className="w-[326px] flex flex-col gap-6 ml-[20px]">
            <div
                className="w-[326px] h-[100px] flex items-center gap-3 pl-[54px] rounded-[8px] bg-[#1A1D1F] border border-[#232627]">
                <div className="w-[44px] h-[44px] flex items-center justify-center shrink-0">
                    <Image src="/Group%20427318482.svg" alt="" width={26} height={32}/>
                </div>
                <h1 className="font-poppins font-bold text-[32px] leading-[41.6px] text-[#F7F9FA]">O&apos;yinlar</h1>
            </div>

            <div className="w-[326px] h-auto px-5 pt-5 pb-5 rounded-[8px] bg-[#1A1D1F] border border-[#1F272A]">
                <div className="flex items-center justify-between">
                    <h2 className="font-poppins font-medium text-[18px] leading-[23.4px] text-[#FCFCFC]">Filter</h2>
                    <button
                        onClick={() => {
                            setCountry("Barchasi");
                            setCategory("Barchasi");
                        }}
                        className="font-poppins font-normal text-[16px] leading-[24px] text-[#1C92E0] cursor-pointer">
                        Tozalash
                    </button>
                </div>

                <div className="mt-6 flex flex-col gap-6">
                    <FilterDropdown label="Mamlakatni tanlang:" value={country} options={COUNTRIES}
                                    onSelect={setCountry}/>
                    <FilterDropdown label="Yosh:" value={category} options={CATEGORIES} onSelect={setCategory}/>
                </div>
            </div>
        </div>
    );
}
