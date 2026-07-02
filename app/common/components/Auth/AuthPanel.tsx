import Image from "next/image";

export default function AuthPanel() {
    return (
        <div className="relative w-[443px] h-[597px] shrink-0 rounded-r-xl overflow-hidden">
            <Image src="/auth-panel.png" alt="" fill className="object-cover" />
        </div>
    );
}