"use client"
import {useState} from "react";
import Image from "next/image";
import {useRouter} from "next/navigation";
import {CurrentUser, clearToken, getToken} from "@/app/common/components/Auth/authApi";
import LogoutModal from "./LogoutModal";
import EditProfileModal from "./EditProfileModal";

function formatBirthDate(value: string | null): string {
    if (!value) return "Kiritilmagan";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}.${month}.${date.getFullYear()}`;
}

export default function UserInfoCard({user, onUserChange}: { user: CurrentUser; onUserChange: (user: CurrentUser) => void }) {
    const router = useRouter();
    const [logoutOpen, setLogoutOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const token = getToken();

    function handleConfirmLogout() {
        clearToken();
        router.push("/main");
    }

    return (
        <div className="w-[1026px] h-[176px] bg-[#1A1D1F] border border-[#1F272A] rounded-2xl p-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h2 className="font-poppins text-[28px] font-bold leading-9 text-[#f7f9fa]">Foydalanovchi ma’lumotlari</h2>
                    <button
                        onClick={() => setEditOpen(true)}
                        className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center cursor-pointer hover:bg-white/20"
                    >
                        <Image src="/edit-pencil.svg" alt="Tahrirlash" width={24} height={24}/>
                    </button>
                </div>
                <button
                    onClick={() => setLogoutOpen(true)}
                    className="h-11 px-[34px] rounded-lg bg-[#DC2D2D] flex items-center gap-[10px] font-poppins text-[16px] font-medium text-[#f7f9fa] cursor-pointer hover:bg-[#c12626]"
                >
                    <Image src="/ProfileImage/log-out.svg" alt="" width={20} height={20}/>
                    Chiqish
                </button>
            </div>

            <div className="mt-4 inline-flex border border-[#2C2F31] rounded-xl overflow-hidden">
                <div className="w-[187px] h-[76px] border-r border-[#2C2F31] px-4 flex flex-col gap-0.5 justify-center">
                    <span className="font-poppins text-[16px] text-[#9DA1A3]">Ism-sharifingiz</span>
                    <span className="font-poppins text-[16px] font-medium text-[#f7f9fa] truncate">{user.fullName}</span>
                </div>
                <div className="w-[187px] h-[76px] px-4 flex flex-col gap-0.5 justify-center">
                    <span className="font-poppins text-[16px] text-[#9DA1A3]">Tug‘ilgan sana</span>
                    <span className="font-poppins text-[16px] font-medium text-[#f7f9fa]">{formatBirthDate(user.birthDate)}</span>
                </div>
            </div>

            <LogoutModal open={logoutOpen} onClose={() => setLogoutOpen(false)} onConfirm={handleConfirmLogout}/>
            {token && (
                <EditProfileModal
                    open={editOpen}
                    user={user}
                    token={token}
                    onClose={() => setEditOpen(false)}
                    onSaved={onUserChange}
                />
            )}
        </div>
    );
}