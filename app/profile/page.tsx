"use client"
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import {CurrentUser, fetchCurrentUser, getToken} from "@/app/common/components/Auth/authApi";
import ProfileUserCard from "@/app/profile/components/ProfileUserCard";
import ProfileNav from "@/app/profile/components/ProfileNav";
import UserInfoCard from "@/app/profile/components/UserInfoCard";
import SecurityCard from "@/app/profile/components/SecurityCard";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();
        if (!token) {
            router.replace("/main");
            return;
        }
        fetchCurrentUser(token).then((result) => {
            if (!result) {
                router.replace("/main");
                return;
            }
            setUser(result);
            setLoading(false);
        });
    }, [router]);

    if (loading || !user) {
        return (
            <div className="flex flex-col min-h-screen">
                <HeaderItem/>
                <div className="flex-1 flex items-center justify-center">
                    <p className="text-white font-poppins text-[18px]">Yuklanmoqda...</p>
                </div>
                <Footer/>
            </div>
        );
    }

    return (
        <div>
            <HeaderItem/>
            <div className="flex gap-2 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
                <h4 className="text-[#6D7274] font-medium mt-1">Asosiy</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
                <h4 className="text-[#6D7274] font-medium mt-1">Profil</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
                <h4 className="text-white font-medium mt-1">Umumiy sozlamalar</h4>
            </div>

            <div className="mt-5 ml-[32px] flex gap-6 items-start">
                <div className="flex flex-col gap-6">
                    <ProfileUserCard user={user}/>
                    <ProfileNav active="settings"/>
                </div>
                <div className="flex flex-col gap-6">
                    <UserInfoCard user={user} onUserChange={setUser}/>
                    <SecurityCard user={user} onUserChange={setUser}/>
                </div>
            </div>

            <Footer/>
        </div>
    );
}