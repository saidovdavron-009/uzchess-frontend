"use client"
import axios from 'axios'
import {useEffect, useState} from "react";
import BookItem from "@/app/book/components/BookItem";

const STEP = 6;

export default function BookItemContainer({search}: { search: string }) {
    const [book, setBook] = useState<{
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
    }[]>([])
    const [shown, setShown] = useState(STEP);

    useEffect(() => {
        async function getAllCourse() {
            const response = await axios.get(`http://localhost:3000/public/book?search=${search}`)
            setBook(response.data.data)
        }

        getAllCourse()
    }, [search])

    const loadMore = () => {
        setShown((prev) => prev + STEP);
    };

    return <div className="w-full">
        {book.slice(0, shown).map((item) => <BookItem
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
        />)}
        {shown < book.length && (
            <button
                onClick={loadMore}
                className="ml-[280px] w-[131px] h-[40px] mt-[20px] bg-[#1A1D1F] rounded-[8px] text-white"
            >
                Ko'proq
            </button>
        )}

    </div>
}