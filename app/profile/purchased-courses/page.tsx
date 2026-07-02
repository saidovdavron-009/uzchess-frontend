"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import {fetchCurrentUser, getToken, CurrentUser} from "@/app/common/components/Auth/authApi";
import ProfileUserCard from "@/app/profile/components/ProfileUserCard";
import ProfileNav from "@/app/profile/components/ProfileNav";
import PurchasedCourseCard from "@/app/profile/components/PurchasedCourseCard";
import {fetchMyPurchasedCourses, type PurchasedCourseWithDetail} from "@/app/profile/api/purchasedCoursesApi";

export default function PurchasedCoursesPage() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [purchases, setPurchases] = useState<PurchasedCourseWithDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken() ?? "";

        fetchCurrentUser(token)
            .then(async (currentUser) => {
                if (currentUser) setUser(currentUser);
                const userId = currentUser?.id ?? 0;
                try {
                    const data = await fetchMyPurchasedCourses(userId, token);
                    setPurchases(data);
                } catch (e) {
                    console.error(e);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
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
        <div className="min-h-screen">
            <HeaderItem/>

            <div className="flex gap-2 w-[1374px] h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="icon" width={20} height={20} className="w-5 h-5"/>
                <h4 className="text-[#6D7274] font-medium mt-1">Asosiy</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
                <h4 className="text-[#6D7274] font-medium mt-1">Profil</h4>
                <Image src="/NewsImage/icon7.svg" alt="icon" width={8} height={8} className="w-2 h-2 mt-2 mb-[2px]"/>
                <h4 className="text-white font-medium mt-1">Sotib olingan kurslar</h4>
            </div>

            <div className="mt-[20px] ml-[32px] flex gap-[24px] items-start pb-[40px]">

                <div className="flex flex-col gap-[24px] shrink-0">
                    {user && <ProfileUserCard user={user}/>}
                    <ProfileNav active="Sotib olingan kurslar"/>
                </div>

                <div className="flex flex-wrap gap-[24px]">
                    {purchases.length === 0 ? (
                        <div className="w-[1026px] flex flex-col items-center justify-center gap-4 py-20">
                            <Image src="/ProfileImage/courses-stack.svg" alt="" width={64} height={64}/>
                            <p className="text-[#9DA0A1] font-poppins text-[16px]">
                                Hozircha sotib olingan kurslar yo&apos;q
                            </p>
                        </div>
                    ) : (
                        purchases.map(({purchaseId, course}) => (
                            <PurchasedCourseCard key={purchaseId} course={course}/>
                        ))
                    )}
                </div>
            </div>

            <Footer/>
        </div>
    );
}