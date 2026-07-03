"use client";
import {Fragment, useEffect, useState} from "react";
import Image from "next/image";
import {EntityFilters, fetchBookCategories, fetchDifficulties, fetchLanguages, FilterOption} from "@/app/common/api/filterOptionsApi";

interface FilterProps {
    filters: EntityFilters;
    onChange: (next: EntityFilters) => void;
}

export default function BookFilterItem({filters, onChange}: FilterProps) {
    const [languages, setLanguages] = useState<FilterOption[]>([]);
    const [difficulties, setDifficulties] = useState<FilterOption[]>([]);
    const [categories, setCategories] = useState<FilterOption[]>([]);
    const [isOpenLanguage, setIsOpenLanguage] = useState(false);
    const [isOpenDegree, setIsOpenDegree] = useState(false);
    const [isOpenCategory, setIsOpenCategory] = useState(false);

    useEffect(() => {
        fetchLanguages().then(setLanguages);
        fetchDifficulties().then(setDifficulties);
        fetchBookCategories().then(setCategories);
    }, []);

    const languageTitle = languages.find(l => l.id === filters.languageId)?.title ?? "Barchasi";
    const degreeTitle = difficulties.find(d => d.id === filters.difficultyId)?.title ?? "Barchasi";
    const categoryTitle = categories.find(c => c.id === filters.categoryId)?.title ?? "Barchasi";

    return (
        <div className="w-[286px] flex flex-col gap-[20px] mt-[20px]">

            <div className="w-[286px] relative">
                <p className="font-medium text-[11px] uppercase tracking-wider text-[#F7F9FA99] mb-[10px]">Tilni tanlang:</p>
                <div
                    className="select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px] cursor-pointer hover:border-[#333739] transition-colors"
                    onClick={() => {
                        setIsOpenLanguage(!isOpenLanguage);
                        setIsOpenDegree(false);
                        setIsOpenCategory(false);
                    }}
                >
                    <div className="text-[14px] text-[#F7F9FA]">{languageTitle}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16} className={`transition-transform ${isOpenLanguage ? 'rotate-180' : ''}`}/>
                </div>
                {isOpenLanguage && (
                    <div className="absolute top-[84px] left-0 w-full z-50 py-1 bg-[#15181A] border border-[#232627] rounded-[8px] shadow-2xl">
                        <div className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]" onClick={() => { onChange({...filters, languageId: null}); setIsOpenLanguage(false); }}>Barchasi</div>
                        {languages.map(l => (
                            <div key={l.id} className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]" onClick={() => { onChange({...filters, languageId: l.id}); setIsOpenLanguage(false); }}>{l.title}</div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-[286px] relative">
                <p className="font-medium text-[11px] uppercase tracking-wider text-[#F7F9FA99] mb-[10px]">Darajani tanlang:</p>
                <div
                    className="select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px] cursor-pointer hover:border-[#333739] transition-colors"
                    onClick={() => {
                        setIsOpenDegree(!isOpenDegree);
                        setIsOpenLanguage(false);
                        setIsOpenCategory(false);
                    }}
                >
                    <div className="text-[14px] text-[#F7F9FA]">{degreeTitle}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16} className={`transition-transform ${isOpenDegree ? 'rotate-180' : ''}`}/>
                </div>
                {isOpenDegree && (
                    <div className="absolute top-[84px] left-0 w-full z-40 py-1 bg-[#15181A] border border-[#232627] rounded-[8px] shadow-2xl">
                        <div className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]" onClick={() => { onChange({...filters, difficultyId: null}); setIsOpenDegree(false); }}>Barchasi</div>
                        {difficulties.map(d => (
                            <div key={d.id} className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]" onClick={() => { onChange({...filters, difficultyId: d.id}); setIsOpenDegree(false); }}>{d.title}</div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-[286px] relative">
                <p className="font-medium text-[11px] uppercase tracking-wider text-[#F7F9FA99] mb-[10px]">Kategoriya:</p>
                <div
                    className="select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px] cursor-pointer hover:border-[#333739] transition-colors"
                    onClick={() => {
                        setIsOpenCategory(!isOpenCategory);
                        setIsOpenLanguage(false);
                        setIsOpenDegree(false);
                    }}
                >
                    <div className="text-[14px] text-[#F7F9FA]">{categoryTitle}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16} className={`transition-transform ${isOpenCategory ? 'rotate-180' : ''}`}/>
                </div>
                {isOpenCategory && (
                    <div className="absolute top-[84px] left-0 w-full z-30 py-1 bg-[#15181A] border border-[#232627] rounded-[8px] shadow-2xl">
                        <div className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]" onClick={() => { onChange({...filters, categoryId: null}); setIsOpenCategory(false); }}>Barchasi</div>
                        {categories.map(c => (
                            <div key={c.id} className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]" onClick={() => { onChange({...filters, categoryId: c.id}); setIsOpenCategory(false); }}>{c.title}</div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-[286px]">
                <p className="font-medium text-[11px] uppercase tracking-wider text-[#F7F9FA99] mb-[10px]">Reyting:</p>
                <div className="flex flex-row-reverse justify-around border-[#232627] border-[1px] rounded-[8px] items-center [&>input]:hidden bg-[#15181A] w-[286px] h-[56px] [&>label]:text-[38px] [&>label]:cursor-pointer text-[#1A1D1F] [&>input:checked~label]:text-[#F59E0B] [&>label:hover]:text-[#F59E0B] [&>label:hover~label]:text-[#F59E0B] transition-all">
                    {[5, 4, 3, 2, 1].map(n => (
                        <Fragment key={n}>
                            <input type="radio" id={`bs${n}`} name="bookRating" value={n} checked={filters.rating === n} onChange={() => onChange({...filters, rating: n})}/>
                            <label htmlFor={`bs${n}`} className="hover:scale-110 active:scale-95 transition-transform">★</label>
                        </Fragment>
                    ))}
                </div>
            </div>

        </div>
    );
}
