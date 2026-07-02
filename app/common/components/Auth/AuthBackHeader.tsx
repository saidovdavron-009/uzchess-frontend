import Image from "next/image";

interface AuthBackHeaderProps {
    title: string;
    onBack: () => void;
}

export default function AuthBackHeader({title, onBack}: AuthBackHeaderProps) {
    return (
        <div className="flex items-center gap-3 w-[467px]">
            <button onClick={onBack} className="cursor-pointer shrink-0">
                <Image src="/chevron-right.svg" alt="" width={24} height={24} className="rotate-180" />
            </button>
            <h2 className="font-poppins font-bold text-[20px] text-[#fcfcfc]">{title}</h2>
        </div>
    );
}