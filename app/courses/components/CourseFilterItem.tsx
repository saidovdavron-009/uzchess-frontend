"use client";
import {Fragment, useEffect, useState} from "react";
import Image from "next/image";
import {EntityFilters, fetchCourseCategories, fetchDifficulties, fetchLanguages, FilterOption} from "@/app/common/api/filterOptionsApi";

interface FilterProps {
    filters: EntityFilters;
    onChange: (next: EntityFilters) => void;
}

export default function CourseFilterItem({filters, onChange}: FilterProps) {
    const [difficulties, setDifficulties] = useState<FilterOption[]>([]);
    const [categories, setCategories] = useState<FilterOption[]>([]);
    const [languages, setLanguages] = useState<FilterOption[]>([]);
    const [isOpenDegree, setIsOpenDegree] = useState(false);
    const [isOpenCategory, setIsOpenCategory] = useState(false);
    const [isOpenLessonLanguage, setIsOpenLessonLanguage] = useState(false);

    useEffect(() => {
        fetchDifficulties().then(setDifficulties);
        fetchCourseCategories().then(setCategories);
        fetchLanguages().then(setLanguages);
    }, []);

    const degreeTitle = difficulties.find(d => d.id === filters.difficultyId)?.title ?? "Barchasi";
    const categoryTitle = categories.find(c => c.id === filters.categoryId)?.title ?? "Barchasi";
    const languageTitle = languages.find(l => l.id === filters.languageId)?.title ?? "Barchasi";

    return (
        <div className="w-[286px] h-[401px] mt-[24px] z-20">
            <div className="w-[286px] h-[82px]">
                <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Darajani tanlang:</p>
                <div
                    className="relative select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px] cursor-pointer"
                    onClick={() => setIsOpenDegree(!isOpenDegree)}>
                    <div>{degreeTitle}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16}/>
                    {isOpenDegree &&
                        <div className="absolute top-[58px] left-0 w-full z-30 px-2 py-1 bg-[#15181A] border border-[#232627] rounded-md shadow-lg">
                            <div className="p-2 hover:bg-white/5" onClick={() => onChange({...filters, difficultyId: null})}>Barchasi</div>
                            {difficulties.map(d => (
                                <div key={d.id} className="p-2 hover:bg-white/5" onClick={() => onChange({...filters, difficultyId: d.id})}>{d.title}</div>
                            ))}
                        </div>}
                </div>
            </div>

            <div className="w-[286px] h-[82px] mt-[24px]">
                <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Kategoriya:</p>
                <div
                    className="relative select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px] cursor-pointer"
                    onClick={() => setIsOpenCategory(!isOpenCategory)}>
                    <div>{categoryTitle}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16}/>
                    {isOpenCategory &&
                        <div className="absolute top-[58px] left-0 w-full z-30 px-2 py-1 bg-[#15181A] border border-[#232627] rounded-md shadow-lg">
                            <div className="p-2 hover:bg-white/5" onClick={() => onChange({...filters, categoryId: null})}>Barchasi</div>
                            {categories.map(c => (
                                <div key={c.id} className="p-2 hover:bg-white/5" onClick={() => onChange({...filters, categoryId: c.id})}>{c.title}</div>
                            ))}
                        </div>}
                </div>
            </div>

            <div className="w-[286px] h-[82px] mt-[24px]">
                <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Darslik tili:</p>
                <div
                    className="relative select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px] cursor-pointer"
                    onClick={() => setIsOpenLessonLanguage(!isOpenLessonLanguage)}>
                    <div>{languageTitle}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16}/>
                    {isOpenLessonLanguage &&
                        <div className="absolute top-[58px] left-0 w-full z-30 px-2 py-1 bg-[#15181A] border border-[#232627] rounded-md shadow-lg">
                            <div className="p-2 hover:bg-white/5" onClick={() => onChange({...filters, languageId: null})}>Barchasi</div>
                            {languages.map(l => (
                                <div key={l.id} className="p-2 hover:bg-white/5" onClick={() => onChange({...filters, languageId: l.id})}>{l.title}</div>
                            ))}
                        </div>}
                </div>
            </div>

            <div className="w-[286px] h-[82px] mt-[24px]">
                <div>
                    <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Reyting:</p>
                    <div className="flex flex-row-reverse justify-around border-[#232627] border-[1px] items-center [&>input]:hidden bg-[#15181A] w-[286px] h-[56px] [&>label]:text-[45px] [&>label]:rounded-[10px] [&>label]:cursor-pointer [&>label]:text-[#1A1D1F] [&>input:checked~label]:text-yellow-400 [&>label:hover]:text-yellow-400 [&>label:hover~label]:text-yellow-400">
                        {[5, 4, 3, 2, 1].map(n => (
                            <Fragment key={n}>
                                <input type="radio" id={`s${n}`} name="rating" value={n} checked={filters.rating === n} onChange={() => onChange({...filters, rating: n})}/>
                                <label htmlFor={`s${n}`}>★</label>
                            </Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
