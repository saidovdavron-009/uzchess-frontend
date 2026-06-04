import Anons from "@/app/common/components/Anons";
import Image from "next/image";

const topBooks = [
    { image: "/BookImage/image1.svg", title: "Shaxmatdagi qobiliyatliringizga qayta baxo bering", author: "J.Silman" },
    { image: "/BookImage/image3.svg", title: "Mening tizimim", author: "A.Nimzowitsch" },
    { image: "/BookImage/image2.svg", title: "Zurixdagi shaxmat musobaqasi", author: "D.Bronstein" },
    { image: "/BookImage/image4.svg", title: "Mening esdaqolarlik o'yinlarim", author: "B.Fischer" },
];

export default function BookItem() {
    return (
        <div className="w-[326px] h-[686px] mt-[20px] flex flex-col gap-6 items-center">
            <Anons />
            <div className="w-[326px] rounded-[6px] bg-[#1A1D1F] p-[16px] ml-[22px]">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-white font-medium">Top kitoblar</h1>
                    <div className="flex items-center gap-1 cursor-pointer">
                        <span className="text-[#9DA1A3] font-poppins text-[14px]">Barchasi</span>
                        <Image src="/BookImage/icon11.svg" alt="barchasi" width={16} height={16} />
                    </div>
                </div>

                {/* Kitoblar ro'yxati */}
                <div className="mt-[20px] flex flex-col">
                    {topBooks.map((book, index) => (
                        <div key={index}>
                            <div className="flex gap-[10px] items-center cursor-pointer hover:opacity-80 transition-opacity">
                                <Image
                                    src={book.image}
                                    alt={book.title}
                                    width={60}
                                    height={80}
                                    className="rounded-[8px] object-cover"
                                />
                                <div>
                                    <h4 className="w-[230px] font-bold tracking-tighter mb-[6px] text-amber-50 text-[14px] leading-tight">
                                        {book.title}
                                    </h4>
                                    <h4 className="text-[#F0F0F0B8] font-normal text-[13px]">
                                        {book.author}
                                    </h4>
                                </div>
                            </div>
                            {index < topBooks.length - 1 && (
                                <hr className="my-[12px] border-[#1F272A]" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}