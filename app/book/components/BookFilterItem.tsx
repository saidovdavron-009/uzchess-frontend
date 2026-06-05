"use client";
import { useState } from "react";
import Image from "next/image";

interface FilterProps {
    lessonLanguage: string;
    setLessonLanguage: (val: string) => void;
    degree: string;
    setDegree: (val: string) => void;
    category: string;
    setCategory: (val: string) => void;
    rating: string;
    setRating: (val: string) => void;
}

export default function BookFilterItem({
                                             lessonLanguage, setLessonLanguage,
                                             degree, setDegree,
                                             category, setCategory,
                                             rating, setRating
                                         }: FilterProps) {
    const [isOpenLanguage, setIsOpenLanguage] = useState(false);
    const [isOpenDegree, setIsOpenDegree] = useState(false);
    const [isOpenCategory, setIsOpenCategory] = useState(false);

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
                    <div className="text-[14px] text-[#F7F9FA]">{lessonLanguage}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16} className={`transition-transform ${isOpenLanguage ? 'rotate-180' : ''}`}/>
                </div>
                {isOpenLanguage && (
                    <div className="absolute top-[84px] left-0 w-full z-50 py-1 bg-[#15181A] border border-[#232627] rounded-[8px] shadow-2xl">
                        {['Barchasi', 'O\'zbek', 'English', 'Russian'].map((lang) => (
                            <div
                                key={lang}
                                className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]"
                                onClick={() => { setLessonLanguage(lang); setIsOpenLanguage(false); }}
                            >
                                {lang}
                            </div>
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
                    <div className="text-[14px] text-[#F7F9FA]">{degree}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16} className={`transition-transform ${isOpenDegree ? 'rotate-180' : ''}`}/>
                </div>
                {isOpenDegree && (
                    <div className="absolute top-[84px] left-0 w-full z-40 py-1 bg-[#15181A] border border-[#232627] rounded-[8px] shadow-2xl">
                        {['Barchasi', 'Boshlang\'ich', 'Havaskor', 'Professional'].map((deg) => (
                            <div
                                key={deg}
                                className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]"
                                onClick={() => { setDegree(deg); setIsOpenDegree(false); }}
                            >
                                {deg}
                            </div>
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
                    <div className="text-[14px] text-[#F7F9FA]">{category}</div>
                    <Image src="/select.svg" alt="select icon" width={16} height={16} className={`transition-transform ${isOpenCategory ? 'rotate-180' : ''}`}/>
                </div>
                {isOpenCategory && (
                    <div className="absolute top-[84px] left-0 w-full z-30 py-1 bg-[#15181A] border border-[#232627] rounded-[8px] shadow-2xl">
                        {['Barchasi', 'Adabiyot', 'Tarix', 'Matematika'].map((cat) => (
                            <div
                                key={cat}
                                className="px-4 py-2 text-[14px] hover:bg-white/5 cursor-pointer text-[#D0DCE8]"
                                onClick={() => { setCategory(cat); setIsOpenCategory(false); }}
                            >
                                {cat}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-[286px]">
                <p className="font-medium text-[11px] uppercase tracking-wider text-[#F7F9FA99] mb-[10px]">Reyting:</p>
                <div className="flex flex-row-reverse justify-around border-[#232627] border-[1px] rounded-[8px] items-center [&>input]:hidden bg-[#15181A] w-[286px] h-[56px] [&>label]:text-[38px] [&>label]:cursor-pointer text-[#1A1D1F] [&>input:checked~label]:text-[#F59E0B] [&>label:hover]:text-[#F59E0B] [&>label:hover~label]:text-[#F59E0B] transition-all">
                    <input type="radio" id="s5" name="rating" value="5" checked={rating === "5"} onChange={(e) => setRating(e.target.value)}/>
                    <label htmlFor="s5" className="hover:scale-110 active:scale-95 transition-transform">★</label>
                    <input type="radio" id="s4" name="rating" value="4" checked={rating === "4"} onChange={(e) => setRating(e.target.value)}/>
                    <label htmlFor="s4" className="hover:scale-110 active:scale-95 transition-transform">★</label>
                    <input type="radio" id="s3" name="rating" value="3" checked={rating === "3"} onChange={(e) => setRating(e.target.value)}/>
                    <label htmlFor="s3" className="hover:scale-110 active:scale-95 transition-transform">★</label>
                    <input type="radio" id="s2" name="rating" value="2" checked={rating === "2"} onChange={(e) => setRating(e.target.value)}/>
                    <label htmlFor="s2" className="hover:scale-110 active:scale-95 transition-transform">★</label>
                    <input type="radio" id="s1" name="rating" value="1" checked={rating === "1"} onChange={(e) => setRating(e.target.value)}/>
                    <label htmlFor="s1" className="hover:scale-110 active:scale-95 transition-transform">★</label>
                </div>
            </div>

        </div>
    );
}