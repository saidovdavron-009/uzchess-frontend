"use client"
import axios from 'axios'
import {useEffect, useState} from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
import CourseItem from "@/app/courses/components/CourseItem";
import Image from "next/image";
import {getToken} from "@/app/common/components/Auth/authApi";
import {fetchLikedCourseIds, toggleCourseLike} from "@/app/common/api/likeApi";

const STEP = 4;

export default function CourseItemContainer({search}: { search: string }) {
    const [course, setCourse] = useState<{
        id: number,
        author: any,
        category: any,
        language: any,
        difficulty: any,
        title: string,
        image: string,
        price: number,
        newPrice: number,
        rating: number,
        sectionsCount: number,
    }[]>([])
    const [shown, setShown] = useState(STEP);
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        async function getAllCourse() {
            const response = await axios.get(`${API_URL}/public/courses?search=${search}`)
            setCourse(response.data.data)
        }
        getAllCourse()
    }, [search])

    useEffect(() => {
        const token = getToken() ?? "";
        if (token) {
            fetchLikedCourseIds(token).then(setLikedIds);
        }
    }, []);

    function handleToggleLike(courseId: number) {
        const token = getToken() ?? "";
        if (!token) return;
        toggleCourseLike(token, courseId).catch(() => {});
        setLikedIds(prev => {
            const next = new Set(prev);
            if (next.has(courseId)) next.delete(courseId);
            else next.add(courseId);
            return next;
        });
    }

    const loadMore = () => setShown((prev) => prev + STEP);

    return <div className="w-full">
        {course.length > 0 ? (
            course.slice(0, shown).map((item) => <CourseItem
                key={item.id}
                id={item.id}
                author={item.author}
                category={item.category}
                language={item.language}
                difficulty={item.difficulty}
                title={item.title}
                image={item.image}
                price={item.price}
                newPrice={item.newPrice}
                rating={item.rating}
                sectionsCount={item.sectionsCount}
                liked={likedIds.has(item.id)}
                onToggleLike={() => handleToggleLike(item.id)}
            />)
        ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-[#202020] border border-[#1F272A] rounded-[12px]">
                <Image src="/notfoundcourse.svg" alt="" className="w-[200px] h-[180px] mb-4" width={200} height={180}/>
                <p className="text-[#F7F9FA] font-poppins text-[16px] font-medium">Hech qanday ma'lumot topilmadi</p>
            </div>
        )}
        {shown < course.length && (
            <button
                onClick={loadMore}
                className="ml-[280px] w-[131px] h-[40px] mt-[20px] bg-[#1A1D1F] rounded-[8px] text-white"
            >
                Ko'proq
            </button>
        )}
    </div>
}
