"use client"
import { useState } from "react";

interface Lesson {
    id: number;
    title: string;
    duration: string;
    thumbnail: string;
}

interface Section {
    id: number;
    title: string;
    lessons: Lesson[];
}

const sections: Section[] = [
    {
        id: 1,
        title: "1. Asosiy donalar",
        lessons: [
            { id: 1, title: "1.1 Kirish", duration: "07:12", thumbnail: "/thumbnails/1.png" },
            { id: 2, title: "1.2 Mot qilish", duration: "08:15", thumbnail: "/thumbnails/2.png" },
            { id: 3, title: "1.2 Piyoda bilan tanishuv", duration: "05:45", thumbnail: "/thumbnails/3.png" },
        ]
    },
    {
        id: 2,
        title: "2. Eng ko'p foydalaniladigan donalar",
        lessons: [
            { id: 4, title: "2.1 Fil bilan o'ynash", duration: "06:30", thumbnail: "/thumbnails/4.png" },
            { id: 5, title: "2.2 Ferz strategiyasi", duration: "09:10", thumbnail: "/thumbnails/5.png" },
            { id: 6, title: "2.3 At harakati", duration: "07:45", thumbnail: "/thumbnails/6.png" },
        ]
    },
    {
        id: 3,
        title: "3. Mot qilish oson bo'lgan donalar",
        lessons: [
            { id: 7, title: "3.1 Tez mot usullari", duration: "05:20", thumbnail: "/thumbnails/7.png" },
            { id: 8, title: "3.2 Markaz nazorati", duration: "08:00", thumbnail: "/thumbnails/8.png" },
            { id: 9, title: "3.3 Shoh himoyasi", duration: "06:55", thumbnail: "/thumbnails/9.png" },
        ]
    }
];

export default function CourseAccordion() {
    const [openSections, setOpenSections] = useState<number[]>([1]);

    function toggle(id: number) {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    }

    return (
        <div className="w-full rounded-[12px] border-[0.5px] border-[#2C2F31] overflow-hidden bg-[#1A1D1F]">
            {sections.map((section) => {
                const isOpen = openSections.includes(section.id);
                return (
                    <div key={section.id}>
                        <div
                            onClick={() => toggle(section.id)}
                            className="flex justify-between items-center px-6 py-[18px] bg-[#1A1D1F] cursor-pointer border-b-[0.5px] border-[#2C2F31] select-none"
                        >
                            <span className="text-[#f0f4f8] text-[24px] font-bold">{section.title}</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="#aaa" strokeWidth="2"
                                style={{ transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                            >
                                <path d="M6 9l6 6 6-6"/>
                            </svg>
                        </div>

                        {isOpen && (
                            <div className="bg-[#F7F9FA08] px-6 py-5 border-b-[0.5px] border-[#2C2F31]">
                                <div className="grid grid-cols-3 gap-4">
                                    {section.lessons.map((lesson) => (
                                        <div
                                            key={lesson.id}
                                            className="rounded-[8px] overflow-hidden cursor-pointer"
                                        >
                                            <div className="relative h-[180px] flex items-center justify-center">
                                                <img
                                                    src="/BookImage/image4.svg"
                                                    alt={lesson.title}
                                                    className="w-full h-full object-cover rounded-[8px] border"
                                                />
                                                <div className="absolute bottom-[10px] left-[10px]  text-white text-[12px] px-2 py-1 rounded-[4px] flex items-center gap-1">
                                                    <svg width="15" height="17.25" viewBox="0 0 10 10" fill="#9DA1A3">
                                                        <polygon points="2,1 9,5 2,9"/>
                                                    </svg>
                                                    <p className="text-[14px] font-normal text-[#F7F9FA99]">{lesson.duration}</p>
                                                </div>
                                            </div>
                                            <h3 className="mt-[20px] text-[20px] font-medium text-[#d0dce8]">
                                                {lesson.title}
                                            </h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}