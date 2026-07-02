"use client"
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface Course {
    id: number;
    title: string;
    image: string;
    rating: string;
    views?: number;
}

export default function TopCourses() {
    const [courses, setCourses] = useState<Course[]>([]);

    useEffect(() => {
        axios.get(`${API}/public/courses`)
            .then(res => {
                const data: Course[] = res.data.data ?? [];
                setCourses(data.slice(0, 4));
            })
            .catch(() => {});
    }, []);

    return (
        <div className="w-[326px] rounded-[8px] bg-[#1a1d1f] overflow-hidden">
            <div className="flex justify-between items-center px-[16px] pt-[16px] pb-[16px]">
                <h1 className="text-[#fcfcfc] text-[18px] font-medium leading-[23px]">Top kurslar</h1>
                <Link
                    href="/courses"
                    className="flex items-center gap-[4px] hover:opacity-80 transition-opacity select-none"
                >
                    <span className="text-[#6c6e70] font-poppins text-[16px]">Barchasi</span>
                    <Image src="/chevron-right.svg" alt="" width={20} height={20}/>
                </Link>
            </div>

            <div className="flex flex-col">
                {courses.map((course, index) => (
                    <div key={course.id}>
                        <Link
                            href={`/courses/${course.id}`}
                            className="flex items-center gap-[10px] px-[16px] py-[12px] hover:bg-[#13181c] transition-colors cursor-pointer"
                        >
                            <div className="w-[80px] h-[80px] shrink-0 rounded-[12px] overflow-hidden bg-white">
                                <Image
                                    src={course.image}
                                    alt={course.title}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <h4 className="text-[#fcfcfc] text-[14px] font-bold leading-tight line-clamp-2 mb-[6px]">
                                    {course.title}
                                </h4>
                                <div className="flex flex-col gap-[4px]">
                                    <div className="flex items-center gap-[4px]">
                                        <Image src="/Star%201.svg" alt="" width={16} height={16}/>
                                        <span className="text-[#fcfcfc] text-[14px] font-medium">{course.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-[8px]">
                                        <Image src="/eye-outline.svg" alt="" width={16} height={16}/>
                                        <span className="text-[13px] font-normal text-[rgba(240,240,240,0.72)]">
                                            {course.views ?? 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                        {index < courses.length - 1 && (
                            <div className="h-[1px] mx-[16px] bg-[#272b30]"/>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
