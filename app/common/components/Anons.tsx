import Image from "next/image";

export default function Anons() {
    return <div className="ml-5 flex flex-col items-start relative w-full p-4  bg-[#0B4789] overflow-hidden rounded-[8px]">
        <Image className="absolute top-0 left-0 w-full h-full" src="/bg.svg" alt="" width={400} height={200}/>
        <Image src="/Vector.svg" alt="" className="absolute top-0 right-0" width={100} height={100}/>
        <Image src="/Group.svg" alt="" className="h-[24px]" width={120} height={24}/>
        <h1 className="font-poppins font-[700] text-[20px] w-[294px] mt-2">Aynan <span className="text-[#ffff00]">siz</span> uchun qanday imtiyozlar borligini bilib oling</h1>
        <button className="flex items-center justify-center gap-2 w-[149px] bg-[#1C92E0] text-[16px] text-white py-2 px-5 font-poppins font-[500] h-[40px] cursor-pointer hover:bg-[#1676b5] transition-colors mt-2 rounded-[8px]">Batafsil<Image src="/Vector%20(Stroke).svg" alt="Image" width={16} height={16}/></button>
    </div>
}