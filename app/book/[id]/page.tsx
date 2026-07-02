"use client"
import {useEffect, useState} from "react";
import axios from "axios";
import {useRouter} from "next/navigation";
import HeaderItem from "@/app/common/components/Header/Header";
import BookItem from "@/app/common/components/Book/BookItem";
import Footer from "@/app/common/components/Footer/Footer";
import Image from "next/image";
import Anons from "@/app/common/components/Anons";
import {getToken} from "@/app/common/components/Auth/authApi";
import {toggleBookLike, fetchLikedBookIds} from "@/app/common/api/likeApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function Page() {
    const router = useRouter();
    const [liked, setLiked] = useState(false);
    const [inCart, setInCart] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentBook, setCurrentBook] = useState<any>(null);

    useEffect(() => {
        async function getSingleBook() {
            try {
                setLoading(true);

                const pathParts = window.location.pathname.split("/");
                const currentId = pathParts[pathParts.length - 1];

                const response = await axios.get(`${API_URL}/public/book`);
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

    useEffect(() => {
        const token = getToken() ?? "";
        if (!token) return;
        const pathParts = window.location.pathname.split("/");
        const currentId = Number(pathParts[pathParts.length - 1]);
        if (!currentId) return;
        fetchLikedBookIds(token).then(ids => setLiked(ids.has(currentId)));
        axios.get(`${API_URL}/public/cart`, {headers: {Authorization: `Bearer ${token}`}})
            .then(res => {
                const rows = Array.isArray(res.data) ? res.data : (res.data?.data ?? []);
                const found = rows.some((r: any) => r.target === "book" && Number(r.targetId) === currentId);
                setInCart(found);
            })
            .catch(() => {});
    }, []);

    async function handleAddToCart() {
        if (inCart) return;
        const token = getToken() ?? "";
        if (!token || !currentBook) return;
        try {
            await axios.post(`${API_URL}/public/cart`, {
                target: "book",
                targetId: currentBook.id,
                quantity: 1,
            }, {headers: {Authorization: `Bearer ${token}`}});
            setInCart(true);
        } catch {}
    }

    async function handleToggleLike() {
        const token = getToken() ?? "";
        if (!token) return;
        const pathParts = window.location.pathname.split("/");
        const currentId = Number(pathParts[pathParts.length - 1]);
        try { await toggleBookLike(token, currentId); } catch {}
        setLiked(prev => !prev);
    }

    if (loading) {
        return <div className="text-white text-center font-poppins pt-10">Yuklanmoqda...</div>;
    }

    if (!currentBook) {
        return <div className="text-red-400 text-center font-poppins pt-10">Kitob ma'lumotlari topilmadi.</div>;
    }

    return <div className="flex flex-col">
        <HeaderItem/>
        <div className="flex gap-3 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
            <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
            <h4 className="w-[42px] h-[18px] text-[#6D7274] font-medium mb-1">Asosiy</h4>
            <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
            <h4 className="w-[42px] h-[18px] text-white font-medium mb-1">Kutubxona</h4>
            <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8}
                   className="w-2 h-2 mt-2 ml-[30px] mb-[2px]"/>
            <h4 className=" h-[18px] text-white font-medium mb-1">{currentBook.title}</h4>
        </div>
        <div className="flex gap-[40px]">
            <div
                className="w-[1070px] h-auto flex flex-col gap-[20px] mt-[20px] ml-[38px] bg-[#1A1D1F] border-[#1F272A] border-[1px] rounded-[12px] p-[32px]">
                <div className="flex gap-[20px]">
                    <Image src={currentBook?.image || "/BookImage/image1.svg"} alt="book Image"
                           className="w-[192px] h-[272px] rounded-[5px] object-cover" width={192} height={272}/>
                    <div className="w-full flex flex-col gap-[20px]">
                        <h1 className="w-[715px] h-[72px] font-poppins font-bold text-[28px] pr-[200px]">{currentBook?.title}</h1>
                        <div className="w-[292px] h-[30px] flex items-center">
                            <Image src="/pul.png" alt="pul svg" className="w-[28px] h-[28px]" width={28}
                                   height={28}/>
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
                                        <Image src="/Union.svg" alt="daraja icon" className="w-[14px] h-[14px]"
                                               width={14} height={14}/>
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
                                        <Image src="/author.svg" alt="muallif icon" className="w-[14px] h-[14px]"
                                               width={14} height={14}/>
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
                                        <Image src="/sahifaIcon.svg" alt="sahifa icon" className="w-[14px] h-[14px]"
                                               width={14} height={14}/>
                                        <p className="w-[77px] h-[18px] font-poppins font-normal text-[14px] text-[#9DA1A3] mb-[5px]">Sahifa
                                            soni</p>
                                    </div>
                                    <h3 className="w-[88px] h-[18px] font-poppins font-medium text-[14px] mt-[-4px]">{currentBook?.pages || 0}</h3>
                                </div>
                            </div>
                            <div
                                className="w-[187px] h-[62px] border-[#2C2F31] border-[1px] flex items-center pl-[12px]">
                                <div className="w-[150px] h-[38px]">
                                    <div className="flex items-center gap-[5px]">
                                        <Image src="/kalendar.svg" alt="kalendar icon" className="w-[14px] h-[14px]"
                                               width={14} height={14}/>
                                        <p className="w-[130px] h-[18px] font-poppins font-normal text-[14px] text-[#9DA1A3] mb-[5px]">Chop
                                            etilgan sana</p>
                                    </div>
                                    <h3 className="w-[88px] h-[18px] font-poppins font-medium text-[14px] mt-[-4px]">{currentBook?.pubDate || "Noma'lum"}</h3>
                                </div>
                            </div>
                        </div>
                        <div className="w-[370px] h-[50px] flex justify-between">
                            <button
                                onClick={handleAddToCart}
                                className={`w-[238px] h-[50px] rounded-[8px] p-[10px] flex gap-[10px] items-center justify-center font-medium text-[16px] text-white transition-all duration-300 ${
                                    inCart
                                        ? "bg-[#FFFFFF1A] cursor-default"
                                        : "bg-[#1C92E0] hover:bg-[#177db3] hover:scale-102"
                                }`}>
                                <Image src={inCart ? "/cart-check.svg" : "/HeaderImage/icon3.svg"} alt="savatcha" width={20} height={20}/>
                                {inCart ? "Savatchada" : "Savatchaga"}
                            </button>

                            <button
                                onClick={handleToggleLike}
                                className="w-[50px] h-[50px] rounded-[12px] bg-[#2a2a2a] flex items-center justify-center border-[#F7F9FA4D] border-[1px] hover:bg-[#3a3a3a]">
                                <Image src={liked ? "/red-heart.svg" : "/likes.svg"} alt="like" width={22} height={20}/>
                            </button>

                            <button
                                className="w-[50px] h-[50px] rounded-[12px] border-[#F7F9FA4D] border-[1px] bg-[#2a2a2a] flex items-center justify-center hover:bg-[#3a3a3a] transition-transform duration-300 active:scale-95">
                                <Image src="/share.svg" alt="share icon" width={20} height={20}/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="w-[986px] flex flex-col gap-[12px] pr-[24px]">
                    <h1 className="w-[986px] h-[31px] font-poppins font-bold text-[24px]">Kitob haqida</h1>
                    <p className="w-[962px] font-medium text-[16px] font-poppins text-[#C2C4C5] overflow-y-auto">
                        {currentBook?.description || currentBook?.text || "Tavsif mavjud emas."}
                    </p>
                </div>
            </div>
            <div className="w-[326px] mt-[20px] flex flex-col gap-6 items-center">
                <Anons/>
                <BookItem/>
            </div>
        </div>
        <Footer/>
    </div>
}