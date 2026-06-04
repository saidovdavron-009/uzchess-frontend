import Image from "next/image";

interface NewsItemProps {
    title: string;
    date: string;
    image: string;
    content: string;
}

export default function NewsItem({title, date, image, content, id}: NewsItemProps) {
    return (
        <div
            className="w-[326px] h-[251px] p-3 bg-[#1A1D1F] rounded-[8px] text-white"
        >
            <div>
                <Image src={image} alt="image1" className="w-[302px] h-[113px] rounded-t-[4px] object-cover" width={302}
                       height={113}/>
                <p className="w-[200px] h-[21px] font-inter font-[400px] text-[#F7F9FA66] tracking-tighter text-[14px] mt-[7px]">{date}</p>
            </div>
            <div className="w-[302px] h-[80px] flex flex-col justify-between mt-[6px]">
                <h4 className="text-[14px] font-sans w-[302px] h-[36px] font-medium line-clamp-2 leading-[18px] hover:text-[#1C92E0]">{title}</h4>
                <h4 className="text-[14px] font-sans w-[302px] h-[36px] font-medium line-clamp-2 leading-[18px] hover:text-[#1C92E0]">{content}</h4>
            </div>
        </div>
    )
}