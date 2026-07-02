"use client"
import {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

interface Player {
    id: number;
    fullName: string;
    classic: number;
    rapid: number;
    blitz: number;
    countryId: number;
    image: string;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

function RatingRow({rank, player}: {rank: number; player: Player}) {
    return (
        <div className="h-[62px] pt-[10px] flex flex-col">
            <div className="flex items-center justify-between px-4">
                <div className="flex items-center gap-2">
                    {rank === 1 ? (
                        <Image src="/rank-crown.svg" alt="" width={16} height={16}/>
                    ) : (
                        <span className="text-[16px] text-[#F7F9FA] leading-[24px]">{rank}.</span>
                    )}
                    <span className="text-[16px] text-[#F7F9FA] leading-[24px]">{player.fullName}</span>
                </div>
                <span className="text-[16px] text-[#F7F9FA] leading-[24px]">{player.classic}</span>
            </div>
            <div className="flex items-center justify-between pl-[40px] pr-4">
                <span className="text-[12px] text-[#F7F9FA]/40 leading-[16px]">-</span>
                <span className="text-[12px] text-[#F7F9FA]/40 leading-[16px]">-</span>
            </div>
        </div>
    );
}

export default function RatingList() {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        axios.get(`${API}/public/player`)
            .then(res => {
                const data: Player[] = res.data.data ?? [];
                data.sort((a, b) => b.classic - a.classic);
                setPlayers(data.slice(0, 5));
            })
            .catch(() => {});
    }, []);

    return (
        <div className="w-[326px] h-[390px] bg-[#1A1D1F] rounded-[12px] border-[#1F272A] border-[1px] overflow-hidden p-[10px]">
            <div className="h-[54px] px-4 flex items-center justify-between">
                <h3 className="text-[20px] font-medium text-[#F7F9FA] leading-[26px]">Reyting</h3>
                <Link
                    href="/reyting"
                    className="flex items-center gap-1 text-[#9DA1A3] text-[16px] leading-[24px] cursor-pointer hover:text-[#1C92E0]">
                    Barchasi
                    <Image src="/chevron-right.svg" alt="" width={20} height={20}/>
                </Link>
            </div>
            <div className="h-px bg-[#1A2226]"/>
            {players.map((player, i) => (
                <div key={player.id}>
                    <RatingRow rank={i + 1} player={player}/>
                    {i < players.length - 1 && <div className="h-px bg-[#1A2226] mx-4"/>}
                </div>
            ))}
        </div>
    );
}