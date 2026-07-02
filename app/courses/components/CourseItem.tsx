"use client"
import {useRouter} from "next/navigation";
import Image from "next/image";
import {resolveImageUrl} from "@/app/common/utils/imageUrl";

export default function CourseItem({
    author, category, language, difficulty,
    title, image, price, newPrice, rating, sectionsCount, id,
    liked = false, onToggleLike,
}: {
    id: any,
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
    liked?: boolean,
    onToggleLike?: () => void,
}) {
    const newPrice1 = Number(newPrice)
    const price1 = Number(price)
    const router = useRouter()

    return (
        <div
            onClick={() => router.push(`/courses/${id}`)}
            className="w-[676px] h-[189px] bg-[#1A1D1F] mt-[24px] flex p-[24px] gap-[20px] rounded-[8px] border-[#1F272A] border-[1px] hover:border-[#1C92E0] cursor-pointer relative"
        >

            <div>
                <div className="w-[53px] h-[29px] flex items-center justify-center gap-[3px] rounded-[6px] border-[1px] absolute border-[#F7F9FA14] bg-[#0B141899] m-2">
                    <Image src='/Star%201.svg' alt="liked" width={16} height={16}/>
                    <p>{rating}</p>
                </div>
                <p className="w-[32px] h-[22px] bg-[#1A1D1F] border-[1px] border-[#F7F9FA14] font-medium text-[12px] text-[#C9C4A6] rounded-[6px] text-center absolute mt-[110px] ml-[10px]">{language.code}</p>
                <Image src={image} alt='image' className="w-[185px] h-[141px] rounded-[8px]" width={185} height={141}/>
            </div>

            <div className="flex flex-col justify-between flex-1">
                <div className="w-[427px] h-[44px] pr-[32px]">
                    <h1 className="w-full h-[26px] text-[20px] font-bold line-clamp-1">{title}</h1>
                    <h4 className="w-[150px] h-[18px] text-[14px] text-[#F7F9FA99]">{author.fullName}</h4>
                </div>
                <div>
                    <p className="w-[88px] h-[18px] text-[12px] font-normal line-through decoration-red-500">{price1 === 0 ? '' : `${price1} uzs`}</p>
                    <h1 className="w-[112px] h-[24px] font-bold text-[#82CC27]">{newPrice1 === 0 ? "Bepul kurs" : `${newPrice1} uzs`}</h1>
                </div>
                <div className="flex items-center gap-[12px]">
                    <div className="flex gap-1 items-center">
                        <Image src={resolveImageUrl(difficulty.icon)} alt='Image' width={13} height={17} className="object-cover w-[13px] h-[17.33px]"/>
                        <p className="text-[#F7F9FA99] font-normal text-[14px] whitespace-nowrap">{difficulty.title}</p>
                    </div>
                    <div className="h-[20px] w-[1px] bg-white"/>
                    <div className="flex gap-1 items-center">
                        <Image src="/section.svg" alt="section icon" className="w-[22px] h-[22px]" width={22} height={22}/>
                        <p className='text-[#F7F9FA99] font-normal text-[14px] whitespace-nowrap'>{sectionsCount} ta bo'lim</p>
                    </div>
                    <div className="h-[20px] w-[1px] bg-white"/>
                    <div className="flex gap-1 items-center">
                        <Image src="/category.svg" alt="category icon" className="w-[22px] h-[22px]" width={22} height={22}/>
                        <p className="text-[#F7F9FA99] text-[14px] font-normal whitespace-nowrap">{category.title}</p>
                    </div>
                    {onToggleLike && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onToggleLike(); }}
                            className="ml-auto hover:opacity-70 transition-opacity shrink-0"
                        >
                            <Image src={liked ? "/red-heart.svg" : "/likes.svg"} alt="like" width={20} height={18}/>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
