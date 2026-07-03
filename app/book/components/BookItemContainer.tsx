"use client"
import axios from 'axios'
import {useEffect, useState} from "react";
import BookItem from "@/app/book/components/BookItem";
import Image from "next/image";
import {getToken} from "@/app/common/components/Auth/authApi";
import {fetchLikedBookIds, toggleBookLike} from "@/app/common/api/likeApi";
import {EMPTY_FILTERS, EntityFilters, toFilterParams} from "@/app/common/api/filterOptionsApi";

const STEP = 6;
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BookItemContainer({search, filters = EMPTY_FILTERS}: { search: string; filters?: EntityFilters }) {
    const [book, setBook] = useState<{
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
    }[]>([])
    const [shown, setShown] = useState(STEP);
    const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
    const [cartIds, setCartIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        async function getAllBooks() {
            const response = await axios.get(`${API_URL}/public/book`, {
                params: {search, ...toFilterParams(filters)},
            })
            setBook(response.data.data)
            setShown(STEP)
        }
        getAllBooks()
    }, [search, filters])

    useEffect(() => {
        const token = getToken() ?? "";
        if (!token) return;
        fetchLikedBookIds(token).then(setLikedIds);
        axios.get(`${API_URL}/public/cart`, {headers: {Authorization: `Bearer ${token}`}})
            .then(res => {
                const rows = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                const ids = new Set<number>(rows.filter((r: any) => r.target === "book").map((r: any) => Number(r.targetId)));
                setCartIds(ids);
            })
            .catch(() => {});
    }, []);

    function handleAddToCart(bookId: number) {
        setCartIds(prev => { const next = new Set(prev); next.add(bookId); return next; });
    }

    function handleToggleLike(bookId: number) {
        const token = getToken() ?? "";
        if (!token) return;
        toggleBookLike(token, bookId).catch(() => {});
        setLikedIds(prev => {
            const next = new Set(prev);
            if (next.has(bookId)) next.delete(bookId);
            else next.add(bookId);
            return next;
        });
    }

    const loadMore = () => setShown((prev) => prev + STEP);

    return <div className="w-full">
        {book.length > 0 ? (
            book.slice(0, shown).map((item) => <BookItem
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
                liked={likedIds.has(item.id)}
                onToggleLike={() => handleToggleLike(item.id)}
                inCart={cartIds.has(item.id)}
                onAddToCart={() => handleAddToCart(item.id)}
            />)
        ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-[#202020] rounded-[12px]">
                <Image src="/notfoundcourse.svg" alt="" className="w-[200px] h-[180px] mb-4" width={200} height={180}/>
                <p className="text-[#F7F9FA] font-poppins text-[16px] font-medium">Hech qanday ma'lumot topilmadi</p>
            </div>
        )}
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
