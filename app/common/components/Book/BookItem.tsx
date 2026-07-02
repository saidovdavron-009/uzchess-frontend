"use client"
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState} from "react";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

interface Book {
    id: number;
    title: string;
    image: string;
    author: {fullName: string};
}

export default function BookItem() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        axios.get(`${API}/public/book`)
            .then(res => {
                const data: Book[] = res.data.data ?? [];
                setBooks(data.slice(0, 4));
            })
            .catch(() => {});
    }, []);

    return (
        <div className="w-[326px] rounded-[6px] bg-[#1A1D1F] p-[16px]">
            <div className="flex justify-between items-center">
                <h1 className="text-white font-medium">Top kitoblar</h1>
                <Link
                    href="/book"
                    className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity select-none"
                >
                    <span className="text-[#9DA1A3] font-poppins text-[14px]">Barchasi</span>
                    <Image src="/BookImage/icon11.svg" alt="barchasi" width={16} height={16}/>
                </Link>
            </div>

            <div className="mt-[20px] flex flex-col">
                {books.map((book, index) => (
                    <div key={book.id}>
                        <Link href={`/book/${book.id}`} className="flex gap-[10px] items-center cursor-pointer hover:opacity-80 transition-opacity">
                            <Image
                                src={book.image}
                                alt={book.title}
                                width={60}
                                height={80}
                                className="rounded-[8px] object-cover"
                            />
                            <div>
                                <h4 className="w-[230px] font-bold tracking-tighter mb-[6px] text-amber-50 text-[14px] leading-tight line-clamp-2">
                                    {book.title}
                                </h4>
                                <h4 className="text-[#F0F0F0B8] font-normal text-[13px]">
                                    {book.author?.fullName}
                                </h4>
                            </div>
                        </Link>
                        {index < books.length - 1 && (
                            <hr className="my-[12px] border-[#1F272A]"/>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
