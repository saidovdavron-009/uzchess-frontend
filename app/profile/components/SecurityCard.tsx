"use client"
import {useState} from "react";
import Image from "next/image";
import {CurrentUser, getToken} from "@/app/common/components/Auth/authApi";
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeContactModal from "./ChangeContactModal";

export default function SecurityCard({user, onUserChange}: { user: CurrentUser; onUserChange: (user: CurrentUser) => void }) {
    const isEmailLogin = user.loginType === "email";
    const [passwordOpen, setPasswordOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);
    const token = getToken();

    function handleContactSuccess(login: string) {
        onUserChange({...user, login, loginType: isEmailLogin ? "email" : "number"});
    }

    return (
        <div className="w-[1026px] h-[160px] bg-[#1A1D1F] border border-[#1F272A] rounded-2xl p-6">
            <h2 className="font-poppins text-[28px] font-bold leading-9 text-[#f7f9fa]">Xavfsizlik</h2>
            <div className="mt-4 flex gap-6">
                <button
                    onClick={() => setPasswordOpen(true)}
                    className="w-[477px] h-[60px] bg-[#111315] border border-[#F0F5F31A] rounded-lg flex items-center pl-2 pr-4 cursor-pointer hover:bg-[#161a1d]"
                >
                    <div className="w-11 h-11 rounded-[4px] bg-[#1C92E0] flex items-center justify-center">
                        <Image src="/ProfileImage/key.svg" alt="" width={24} height={24}/>
                    </div>
                    <div className="ml-3 flex flex-col text-left">
                        <span className="font-poppins text-[16px] font-medium text-[#f7f9fa]">Parolni yangilash</span>
                        <span className="font-poppins text-[14px] font-medium text-[#f7f9fa] opacity-40">Esda qoluvchi va murakkab parol qo‘ying</span>
                    </div>
                    <Image src="/ProfileImage/chevron-white.svg" alt="" width={24} height={24} className="ml-auto"/>
                </button>

                {isEmailLogin ? (
                    <button
                        onClick={() => setContactOpen(true)}
                        className="w-[477px] h-[60px] bg-[#111315] border border-[#F0F5F31A] rounded-lg flex items-center pl-2 pr-4 cursor-pointer hover:bg-[#161a1d]"
                    >
                        <div className="w-11 h-11 rounded-[4px] bg-[#1C92E0] flex items-center justify-center">
                            <Image src="/ProfileImage/mail.svg" alt="" width={24} height={24}/>
                        </div>
                        <div className="ml-3 flex flex-col text-left">
                            <span className="font-poppins text-[16px] font-medium text-[#f7f9fa]">Elektron pochtani yangilash</span>
                            <span className="font-poppins text-[14px] font-medium text-[#f7f9fa] opacity-40">Elektron pochtangizni yangilang</span>
                        </div>
                        <Image src="/ProfileImage/chevron-white.svg" alt="" width={24} height={24} className="ml-auto"/>
                    </button>
                ) : (
                    <button
                        onClick={() => setContactOpen(true)}
                        className="w-[477px] h-[60px] bg-[#111315] border border-[#F0F5F31A] rounded-lg flex items-center pl-2 pr-4 cursor-pointer hover:bg-[#161a1d]"
                    >
                        <div className="w-11 h-11 rounded-[4px] bg-[#1C92E0] flex items-center justify-center">
                            <Image src="/ProfileImage/call.svg" alt="" width={24} height={24}/>
                        </div>
                        <div className="ml-3 flex flex-col text-left">
                            <span className="font-poppins text-[16px] font-medium text-[#f7f9fa]">Telefon raqamni yangilash</span>
                            <span className="font-poppins text-[14px] font-medium text-[#f7f9fa] opacity-40">Telefon raqamingizni yangilang</span>
                        </div>
                        <Image src="/ProfileImage/chevron-white.svg" alt="" width={24} height={24} className="ml-auto"/>
                    </button>
                )}
            </div>

            <ChangePasswordModal open={passwordOpen} user={user} onClose={() => setPasswordOpen(false)}/>
            {token && (
                <ChangeContactModal
                    open={contactOpen}
                    mode={isEmailLogin ? "email" : "phone"}
                    user={user}
                    token={token}
                    onClose={() => setContactOpen(false)}
                    onSuccess={handleContactSuccess}
                />
            )}
        </div>
    );
}