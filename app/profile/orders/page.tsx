"use client"
import {useEffect, useState} from "react";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import {fetchCurrentUser, getToken, CurrentUser} from "@/app/common/components/Auth/authApi";
import ProfileUserCard from "@/app/profile/components/ProfileUserCard";
import ProfileNav from "@/app/profile/components/ProfileNav";
import OrderCard from "@/app/profile/components/OrderCard";
import {fetchMyOrders, type OrderWithDetail} from "@/app/profile/api/ordersApi";

export default function OrdersPage() {
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [orders, setOrders] = useState<OrderWithDetail[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken() ?? "";

        fetchCurrentUser(token)
            .then(async (currentUser) => {
                if (currentUser) setUser(currentUser);
                try {
                    const data = await fetchMyOrders(token);
                    setOrders(data);
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

            <div className="flex gap-[8px] h-[44px] items-center pl-[30px] ml-[34px]">
                <Image src="/NewsImage/icon8.svg" alt="" width={20} height={20}/>
                <span className="text-[#6D7274] text-[14px] font-medium">Asosiy</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#6D7274] text-[14px] font-medium">Profil</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#F7F9FA] text-[14px] font-medium">Buyurtmalar</span>
            </div>

            <div className="mt-[20px] ml-[32px] flex gap-[24px] items-start pb-[40px]">

                <div className="flex flex-col gap-[24px] shrink-0">
                    {user && <ProfileUserCard user={user}/>}
                    <ProfileNav active="Buyurtmalar"/>
                </div>

                <div className="flex flex-wrap gap-[24px]">
                    {orders.length === 0 ? (
                        <div className="w-[1026px] flex flex-col items-center justify-center gap-4 py-20">
                            <Image src="/ProfileImage/orders-rocket.svg" alt="" width={64} height={64}/>
                            <p className="text-[#9DA0A1] font-poppins text-[16px]">
                                Hozircha buyurtmalar yo'q
                            </p>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <OrderCard key={order.cartId} order={order}/>
                        ))
                    )}
                </div>
            </div>

            <Footer/>
        </div>
    );
}
