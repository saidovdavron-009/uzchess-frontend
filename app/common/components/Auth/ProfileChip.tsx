import Image from "next/image";
import {CurrentUser} from "./authApi";

export default function ProfileChip({user}: { user: CurrentUser }) {
    const initial = user.fullName.trim().charAt(0).toUpperCase();

    return (
        <div className="flex items-center gap-3">
            <span className="font-poppins text-[16px] text-[#f7f9fa] whitespace-nowrap">{user.fullName}</span>
            <div className="relative w-8 h-8 shrink-0 rounded-full border-2 border-white overflow-hidden bg-[#1c92e0]">
                {user.profileImageUrl ? (
                    <Image src={user.profileImageUrl} alt={user.fullName} fill className="object-cover" />
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-poppins font-bold text-[14px] text-white">
                        {initial}
                    </span>
                )}
            </div>
        </div>
    );
}