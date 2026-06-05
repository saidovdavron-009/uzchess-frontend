"use client"
import {useRouter} from "next/navigation";
import Image from "next/image";

export default function BookItem({
                                     author,
                                     category,
                                     language,
                                     difficulty,
                                     title,
                                     image,
                                     price,
                                     newPrice,
                                     rating,
                                     id
                                 }: {
    author: any,
    category: any,
    language: any,
    difficulty: any,
    title: string,
    image: string,
    price: number,
    newPrice: number,
    rating: number,
    id: any
}) {

    let newPrice1 = Number(newPrice)
    let price1 = Number(price)
    const router = useRouter()

    return <div
        onClick={() => router.push(`/book/${id}`)}
        className="w-[676px] h-[217px] bg-[#1A1D1F] mt-[24px] flex p-[20px] gap-[20px] rounded-[8px] border-[#1F272A] border-[1px] hover:border-[#1C92E0] cursor-pointer">
        <>
            <div
                className="w-[53px] h-[29px] flex items-center justify-center gap-[3px] rounded-[6px] border-[1px] absolute border-[#F7F9FA14] bg-[#0B141899] m-2">
                <Image src='/Star%201.svg' alt="liked" width={16} height={16}/>
                <p>{rating}</p>
            </div>
            <p className="w-[32px] h-[22px] bg-[#1A1D1F] border-[1px] border-[#F7F9FA14] font-medium text-[12px] text-[#C9C4A6] rounded-[6px] text-center absolute mt-[150px] ml-[10px]">{language.code}</p>
            <Image src={image} alt='image' className="w-[132px] h-[180px] object-cover rounded-[4px]" width={132} height={180}/>
        </>
        <div className="flex flex-col">
            <div className="flex flex-col gap-2 w-[441px] h-[107px]">
                <div className="w-[427px] h-[44px]">
                    <h1 className="w-[427px] h-[26px] text-[20px] font-bold">{title}</h1>
                </div>
                <div className="w-[111px] h-[40px]">
                    <p className="w-[88px] h-[18px] text-[11px] font-normal line-through ml-[2px] decoration-red-500">{price1 === 0 ? '' : `${price1} uzs`}</p>
                    <h1 className="w-[112px] h-[24px] font-bold text-[#82CC27] text-[15px]">{newPrice1 === 0 ? "Bepul kurs" : `${newPrice} uzs`}</h1>
                </div>
                <div className="w-[369px] h-[24px] flex gap-4">
                    <div className="flex gap-1">
                        <Image src={`http://localhost:3000/${difficulty.icon}`} alt='Image'
                               className="object-cover w-[13px] h-[17.33px]" width={13} height={17}/>
                        <p className="text-[#F7F9FA99] w-[90px] h-[18px] font-normal text-[14px] mr-[-15px]">{difficulty.title}</p>
                    </div>
                    <div className="h-[20px] w-[1px] bg-[white]"></div>
                    <div className="flex gap-1">
                        <Image src="/category.svg" alt="category icon" className="w-[22px] h-[22px]" width={22} height={22}/>
                        <p className="text-[#F7F9FA99] h-[18px] text-[14px] font-normal">{category.title}</p>
                    </div>
                    <div className="h-[20px] w-[1px] bg-[white]"></div>
                    <div className="flex gap-1">
                        <Image src="/author.svg" alt="author icon" className="w-[22px] h-[18px]" width={22} height={18}/>
                        <p className='text-[#F7F9FA99] font-normal text-[14px] w-[100px]'>{author.fullName}</p>
                    </div>
                </div>
            </div>
            <div className="flex justify-between h-[40px] mt-[7px]">
                <button
                    className="bg-[#FFFFFF1A] w-[198px] h-[40px] rounded-[8px] mt-[24px] p-[10px] flex gap-[10px] items-center justify-center font-medium text-[16px] hover:bg-[#1C92E0] transition-transform duration-300 hover:scale-102">
                    <Image src="/HeaderImage/icon3.svg" alt="savatcha" className="" width={20} height={20}/>Savatchaga
                </button>
                <Image src="/likes.svg" alt="likes" className="w-[19.4px] h-[18px] mt-[30px] ml-[280px]" width={19} height={18}/>
            </div>
        </div>
    </div>
}