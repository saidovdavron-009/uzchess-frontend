import axios from 'axios'
import {useEffect, useState} from "react";
import CourseItem from "@/app/courses/components/CourseItem";

const STEP = 4;

export default function CourseItemContainer({search}: { search: string }) {
    const [course, setCourse] = useState<{
        id: number,
        author: string,
        category: string,
        language: string,
        difficulty: string,
        title: string,
        image: string,
        price: number,
        newPrice: number,
        rating: number,
        sectionsCount: number,
    }[]>([])
    const [shown, setShown] = useState(STEP);

    useEffect(() => {
        async function getAllCourse() {
            const response = await axios.get(`http://localhost:3000/public/courses?search=${search}`)
            setCourse(response.data.data)
        }

        getAllCourse()
    }, [search])

    const loadMore = () => {
        setShown((prev) => prev + STEP);
    };

    return <div className="w-full">
        {course.slice(0, shown).map((item,index) => <CourseItem
            key={index}
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
        />)}
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