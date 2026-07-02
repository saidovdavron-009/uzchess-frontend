"use client"
import {useEffect, useRef, useState} from "react";
import Image from "next/image";
import {CurrentUser, getErrorMessage, updateProfile} from "@/app/common/components/Auth/authApi";

interface EditProfileModalProps {
    open: boolean;
    user: CurrentUser;
    token: string;
    onClose: () => void;
    onSaved: (user: CurrentUser) => void;
}

function toDateInputValue(value: string | null): string {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    return date.toISOString().slice(0, 10);
}

export default function EditProfileModal({open, user, token, onClose, onSaved}: EditProfileModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fullName, setFullName] = useState(user.fullName);
    const [birthDate, setBirthDate] = useState(toDateInputValue(user.birthDate));
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user.profileImageUrl);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open) return;
        setFullName(user.fullName);
        setBirthDate(toDateInputValue(user.birthDate));
        setAvatarFile(null);
        setAvatarPreview(user.profileImageUrl);
        setError(null);
    }, [open, user]);

    if (!open) return null;

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file));
    }

    function handleRemovePhoto() {
        setAvatarFile(null);
        setAvatarPreview(null);
    }

    async function handleSave() {
        setError(null);
        setLoading(true);
        try {
            const updated = await updateProfile(user.id, token, {
                fullName: fullName.trim(),
                birthDate: birthDate || undefined,
                profileImage: avatarFile ?? undefined,
            });
            onSaved({...updated, profileImageUrl: avatarPreview === null ? null : updated.profileImageUrl});
            onClose();
        } catch (e) {
            setError(getErrorMessage(e));
        } finally {
            setLoading(false);
        }
    }

    const initial = fullName.trim().charAt(0).toUpperCase();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div className="relative w-[676px] bg-[#1A1D1F] border border-[#1F272A] rounded-xl" onClick={(e) => e.stopPropagation()}>
                <div className="h-20 border-b border-white/10 flex items-center px-6">
                    <h3 className="font-poppins text-[24px] font-bold leading-[34px] text-[#f7f9fa]">Ma’lumotlarni tahrirlash</h3>
                </div>
                <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white/10">
                    <Image src="/close-x.svg" alt="Yopish" width={18} height={18}/>
                </button>

                <div className="flex flex-col items-center pt-6">
                    <div className="relative w-[88px] h-[88px] rounded-full border border-white overflow-hidden bg-[#1c92e0]">
                        {avatarPreview ? (
                            <Image src={avatarPreview} alt={fullName} fill className="object-cover"/>
                        ) : (
                            <span className="absolute inset-0 flex items-center justify-center font-poppins font-bold text-[28px] text-white">{initial}</span>
                        )}
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute bottom-0 left-0 w-full h-8 bg-[#172329]/80 flex items-center justify-center cursor-pointer"
                        >
                            <Image src="/edit-pencil.svg" alt="" width={20} height={20}/>
                        </button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange}/>
                    <button onClick={handleRemovePhoto} className="mt-3 font-poppins text-[14px] text-[#9da1a3] cursor-pointer hover:text-[#f7f9fa]">
                        O‘chirish
                    </button>
                </div>

                <div className="flex gap-6 px-6 mt-6">
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">Ism-sharifingiz</span>
                        <input
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="h-11 rounded-lg bg-[#13181c] border border-[#36393b] px-4 font-poppins font-medium text-[16px] text-[#f7f9fa] outline-none focus:border-[#1c92e0]"
                        />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="font-poppins font-medium text-[15px] text-[#9da1a3]">Tug‘ilgan sana</span>
                        <input
                            type="date"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                            className="h-11 rounded-lg bg-[#13181c] border border-[#36393b] px-4 font-poppins font-medium text-[16px] text-[#f7f9fa] outline-none focus:border-[#1c92e0] [color-scheme:dark]"
                        />
                    </div>
                </div>

                {error && <p className="px-6 mt-3 font-poppins text-[14px] text-[#dc2d2d]">{error}</p>}

                <div className="flex justify-end px-6 py-8">
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-[180px] h-11 rounded-lg bg-[#1C92E0] font-poppins font-medium text-[16px] text-[#f7f9fa] cursor-pointer hover:bg-[#177db3] disabled:opacity-60"
                    >
                        Saqlash
                    </button>
                </div>
            </div>
        </div>
    );
}