"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import HeaderItem from "@/app/common/components/Header/Header";
import Section from "@/app/common/components/Section";
import BookItem from "@/app/common/components/Book/BookItem";
import Footer from "@/app/common/components/Footer/Footer";
import Image from "next/image";

export default function Page() {
    const [liked, setLiked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentBook, setCurrentBook] = useState<any>(null);

    useEffect(() => {
        async function getSingleBook() {
            try {
                setLoading(true);

                const pathParts = window.location.pathname.split("/");
                const currentId = pathParts[pathParts.length - 1];

                const response = await axios.get(`http://localhost:3000/public/book`);
                const allBooks = response.data.data;

                if (Array.isArray(allBooks) && allBooks.length > 0) {
                    const foundBook = allBooks.find((b: any) => String(b.id) === String(currentId));
                    setCurrentBook(foundBook || allBooks[0]);
                } else if (allBooks && typeof allBooks === 'object') {
                    setCurrentBook(allBooks);
                }
            } catch (error) {
                console.error("Ma'lumot olishda xatolik:", error);
            } finally {
                setLoading(true)
                setLoading(false);
            }
        }

        getSingleBook();
    }, []);

    if (loading) {
        return <div className="text-white text-center font-poppins pt-10">Yuklanmoqda...</div>;
    }

    if (!currentBook) {
        return <div className="text-red-400 text-center font-poppins pt-10">Kitob ma'lumotlari topilmadi.</div>;
    }

    return <div className="flex flex-col">
        <HeaderItem/>
        <Section/>
        <div className="flex gap-[40px]">
            <div
                className="w-[1070px] h-[535px] flex flex-col gap-[20px] mt-[20px] ml-[38px] bg-[#1A1D1F] border-[#1F272A] border-[1px] rounded-[12px] p-[32px]">
                <div className="flex gap-[20px]">
                    <Image src={currentBook?.image || "/BookImage/image1.svg"} alt="book Image"
                           className="w-[192px] h-[272px] rounded-[5px] object-cover" width={192} height={272}/>
                    <div className="w-full flex flex-col gap-[20px]">
                        <h1 className="w-[715px] h-[72px] font-poppins font-bold text-[28px] pr-[200px]">{currentBook?.title}</h1>
                        <div className="w-[292px] h-[30px] flex items-center">
                            <Image src="/cash-outline%201.svg" alt="pul svg" className="w-[28px] h-[28px]" width={28} height={28}/>
                            <h2 className="w-[144px] h-[30px] font-poppins font-bold text-[20px] ml-[12px]">
                                {currentBook?.newPrice?.toLocaleString() || currentBook?.price?.toLocaleString()} uzs
                            </h2>
                            <h4 className="h-[21px] font-normal text-[14px] line-through decoration-[#DC2D2DCC] mt-[5px] ml-[-10px] text-[#F7F9FAA3]">
                                {currentBook?.price?.toLocaleString()} uzs
                            </h4>
                        </div>
                        <div className="w-[748px] h-[62px] flex">
                            <div
                                className="w-[187px] h-[62px] border-[#2C2F31] border-[1px] flex items-center pl-[12px]">
                                <div className="w-[88px] h-[38px]">
                                    <div className="flex items-center gap-[5px]">
                                        <Image src="/Union.svg" alt="daraja icon" className="w-[14px] h-[14px]" width={14} height={14}/>
                                        <p className="w-[47px] h-[18px] font-poppins font-normal text-[14px] text-[#9DA1A3] mb-[5px]">Daraja</p>
                                    </div>
                                    <h3 className="w-[88px] h-[18px] font-poppins font-medium text-[14px] mt-[-4px]">
                                        {typeof currentBook?.difficulty === 'object' ? currentBook?.difficulty?.title : (currentBook?.difficulty || "Boshlang'ich")}
                                    </h3>
                                </div>
                            </div>
                            <div
                                className="w-[187px] h-[62px] border-[#2C2F31] border-[1px] flex items-center pl-[12px]">
                                <div className="w-[106px] h-[38px]">
                                    <div className="flex items-center gap-[5px]">
                                        <Image src="/author.svg" alt="muallif icon" className="w-[14px] h-[14px]" width={14} height={14}/>
                                        <p className="w-[47px] h-[18px] font-poppins font-normal text-[14px] text-[#9DA1A3] mb-[5px]">Muallif</p>
                                    </div>
                                    <h3 className="w-[106px] h-[18px] font-poppins font-medium text-[14px] mt-[-4px]">
                                        {typeof currentBook?.author === 'object' ? (currentBook?.author?.fullName || currentBook?.author?.title) : (currentBook?.author || "Noma'lum")}
                                    </h3>
                                </div>
                            </div>
                            <div
                                className="w-[187px] h-[62px] border-[#2C2F31] border-[1px] flex items-center pl-[12px]">
                                <div className="w-[97px] h-[38px]">
                                    <div className="flex items-center gap-[5px]">
                                        <Image src="/sahifaIcon.svg" alt="sahifa icon" className="w-[14px] h-[14px]" width={14} height={14}/>
                                        <p className="w-[77px] h-[18px] font-poppins font-normal text-[14px] text-[#9DA1A3] mb-[5px]">Sahifa soni</p>
                                    </div>
                                    <h3 className="w-[88px] h-[18px] font-poppins font-medium text-[14px] mt-[-4px]">{currentBook?.pages || 0}</h3>
                                </div>
                            </div>
                            <div
                                className="w-[187px] h-[62px] border-[#2C2F31] border-[1px] flex items-center pl-[12px]">
                                <div className="w-[150px] h-[38px]">
                                    <div className="flex items-center gap-[5px]">
                                        <Image src="/kalendar.svg" alt="kalendar icon" className="w-[14px] h-[14px]" width={14} height={14}/>
                                        <p className="w-[130px] h-[18px] font-poppins font-normal text-[14px] text-[#9DA1A3] mb-[5px]">Chop etilgan sana</p>
                                    </div>
                                    <h3 className="w-[88px] h-[18px] font-poppins font-medium text-[14px] mt-[-4px]">{currentBook?.pubDate || "Noma'lum"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="w-[370px] h-[50px] flex justify-between">
                            <button
                                className="bg-[#1C92E0] w-[238px] h-[50px] rounded-[8px] p-[10px] flex gap-[10px] items-center justify-center font-medium text-[16px] hover:bg-[#FFFFFF1A] transition-transform duration-300 hover:scale-102">
                                <Image src="/HeaderImage/icon3.svg" alt="savatcha" width={20} height={20}/>
                                Savatchaga
                            </button>

                            <button
                                onClick={() => setLiked(!liked)}
                                className="w-[50px] h-[50px] rounded-[12px] bg-[#2a2a2a] flex items-center justify-center border-[#F7F9FA4D] border-[1px] hover:bg-[#3a3a3a]">
                                {liked
                                    ? <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="#e25555">
                                        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                                    </svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                                        <path d="M19.5 12.572l-7.5 7.428l-7.5-7.428a5 5 0 1 1 7.5-6.566a5 5 0 1 1 7.5 6.572"/>
                                    </svg>
                                }
                            </button>

                            <button
                                className="w-[50px] h-[50px] rounded-[12px] border-[#F7F9FA4D] border-[1px] bg-[#2a2a2a] flex items-center justify-center hover:bg-[#3a3a3a] transition-transform duration-300 active:scale-95">
                                <Image src="/share.svg" alt="share icon" width={20} height={20}/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-[986px] h-[197px] flex flex-col gap-[12px] pr-[24px]">
                    <h1 className="w-[986px] h-[31px] font-poppins font-bold text-[24px]">Kitob haqida</h1>
                    <p className="w-[962px] h-[154px] font-medium text-[16px] font-poppins text-[#C2C4C5] overflow-y-auto">
                        {currentBook?.description || currentBook?.text || "Tavsif mavjud emas."}
                    </p>
                </div>
            </div>
            <BookItem/>
        </div>
        <Footer/>
    </div>
}