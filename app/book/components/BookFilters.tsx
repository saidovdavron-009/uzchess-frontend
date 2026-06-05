"use client";
import { useState } from "react";
import CourseFilterItem from "@/app/courses/components/CourseFilterItem";
import BookFilterItem from "@/app/book/components/BookFilterItem";

export default function CourseFilters() {
    const [lessonLanguage, setLessonLanguage] = useState('Barchasi');
    const [degree, setDegree] = useState('Barchasi');
    const [category, setCategory] = useState('Barchasi');
    const [rating, setRating] = useState('');

    const handleClearAll = () => {
        setLessonLanguage('Barchasi');
        setDegree('Barchasi');
        setCategory('Barchasi');
        setRating('');
    };

    return (
        <div className="w-[334px] min-h-[530px] ml-[30px] rounded-[8px] bg-[#1A1D1F] border-[1px] border-[#1F272A] flex flex-col p-[20px] items-center text-white select-none">
            <div className="w-[294px] h-[24px] flex justify-between items-center mb-[4px]">
                <h1 className="text-[16px] font-medium text-white">Filter</h1>
                <button
                    onClick={handleClearAll}
                    className="text-[14px] font-normal text-[#1C92E0] hover:text-blue-400 cursor-pointer transition-colors"
                >
                    Tozalash
                </button>
            </div>

            <BookFilterItem
                lessonLanguage={lessonLanguage} setLessonLanguage={setLessonLanguage}
                degree={degree} setDegree={setDegree}
                category={category} setCategory={setCategory}
                rating={rating} setRating={setRating}
            />
        </div>
    );
}