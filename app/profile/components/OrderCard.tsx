"use client"
import Image from "next/image";
import {useRouter} from "next/navigation";
import {OrderWithDetail, getOrderStatus} from "@/app/profile/api/ordersApi";

export default function OrderCard({order}: { order: OrderWithDetail }) {
    const router = useRouter();
    const {cartId, target, quantity, item} = order;
    const status = getOrderStatus(cartId);
    const orderNum = String(cartId).padStart(8, "0");

    const statusIcon = cartId % 3 === 0
        ? "/OrderImage/icon-delivered.svg"
        : cartId % 3 === 1
            ? "/hourglass.svg"
            : "/bekorqilish.svg";

    return (
        <div onClick={() => router.push(`/book/${item.id}`)} className="w-[501px] h-[192px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] overflow-hidden flex cursor-pointer hover:border-[#1C92E0] transition-colors">

            <div className="shrink-0 pl-[20px] py-[20px]">
                <div className="w-[152px] h-[152px] relative overflow-hidden rounded-[8px]">
                    <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    <div className="absolute bottom-0 left-0 w-full h-[40px] bg-gradient-to-t from-[#111415]/90 to-transparent"/>
                </div>
            </div>

            <div className="flex-1 flex flex-col pb-[22px]">

                <div className="flex-1 flex flex-col justify-center px-[16px] gap-[6px]">
                    <span className="text-[#F7F9FA] text-[20px] font-bold font-poppins leading-none">
                        № {orderNum}
                    </span>
                    <div
                        className={`flex items-center gap-[4px] self-start px-[8px] py-[4px] rounded-[4px] ${status.bgCls}`}
                    >
                        <Image src={statusIcon} alt="" width={20} height={20} unoptimized/>
                        <span
                            className={`text-[12px] font-medium font-poppins leading-none whitespace-nowrap ${status.colorCls}`}
                        >
                            {status.label}
                        </span>
                    </div>
                </div>

                <div className="h-[64px] bg-[#091013] flex flex-col justify-center px-[16px] gap-[8px]">
                    <div className="flex items-center gap-[8px]">
                        <Image src="/OrderImage/icon-money.svg" alt="" width={20} height={20} unoptimized/>
                        <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">
                            {item.price}
                        </span>
                    </div>
                    <div className="flex items-center gap-[8px]">
                        <Image src="/OrderImage/icon-bag.svg" alt="" width={20} height={20} unoptimized/>
                        <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins line-clamp-1">
                            {target === "book" ? "Kitob" : "Souvenir"}{quantity > 1 ? ` × ${quantity}` : ""}
                        </span>
                    </div>
                </div>

            </div>
        </div>
    );
}
