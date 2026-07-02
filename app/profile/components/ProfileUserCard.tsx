import Image from "next/image";
import {CurrentUser} from "@/app/common/components/Auth/authApi";

export default function ProfileUserCard({user}: { user: CurrentUser }) {
    const initial = user.fullName.trim().charAt(0).toUpperCase();

    return (
        <div className="w-[326px] h-[144px] bg-[#1A1D1F] border border-[#1F272A] rounded-2xl flex items-center gap-4 px-7">
            <div className="relative w-[88px] h-[88px] shrink-0 rounded-full border border-white overflow-hidden bg-[#1c92e0]">
                {user.profileImageUrl ? (
                    <Image src={user.profileImageUrl} alt={user.fullName} fill className="object-cover"/>
                ) : (
                    <span className="absolute inset-0 flex items-center justify-center font-poppins font-bold text-[32px] text-white">
                        {initial}
                    </span>
                )}
            </div>
            <h2 className="font-poppins text-[28px] font-bold leading-9 text-[#f7f9fa]">{user.fullName}</h2>
        </div>
    );
}