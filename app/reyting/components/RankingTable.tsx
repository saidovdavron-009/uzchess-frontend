"use client"
import {useState} from "react";
import Image from "next/image";

interface PlayerEntry {
    rank: number;
    name: string;
    klassika: number;
    klassikaDelta: number | null;
    rapid: number;
    blitz: number;
}

const PLAYERS: PlayerEntry[] = [
    {rank: 1, name: "magnus carlsen", klassika: 2859, klassikaDelta: 102, rapid: 2861, blitz: 2830},
    {rank: 2, name: "Ding Liren", klassika: 2811, klassikaDelta: null, rapid: 2829, blitz: 2788},
    {rank: 3, name: "Ian Nepomniachtchi", klassika: 2793, klassikaDelta: 1, rapid: 2766, blitz: 2781},
    {rank: 4, name: "Alireza Firouzja", klassika: 2811, klassikaDelta: null, rapid: 2829, blitz: 2788},
    {rank: 5, name: "Ian Nepomniachtchi", klassika: 2793, klassikaDelta: 1, rapid: 2766, blitz: 2781},
    {rank: 6, name: "Alireza Firouzja", klassika: 2811, klassikaDelta: null, rapid: 2829, blitz: 2788},
    {rank: 7, name: "Ian Nepomniachtchi", klassika: 2793, klassikaDelta: 1, rapid: 2766, blitz: 2781},
    {rank: 8, name: "Alireza Firouzja", klassika: 2811, klassikaDelta: null, rapid: 2829, blitz: 2788},
    {rank: 9, name: "Ian Nepomniachtchi", klassika: 2793, klassikaDelta: 1, rapid: 2766, blitz: 2781},
    {rank: 10, name: "Alireza Firouzja", klassika: 2811, klassikaDelta: null, rapid: 2829, blitz: 2788},
];

function Flag() {
    return (
        <Image src="/icon-flag-uz.svg" alt="UZ" width={16} height={16} className="rounded-[2px] shrink-0"/>
    );
}

function SortIcon() {
    return (
        <Image src="/icon-sort.svg" alt="" width={12} height={12} className="shrink-0"/>
    );
}

function RatingCell({score, delta}: { score: number; delta?: number | null }) {
    return (
        <div className="w-[110px] flex items-center justify-end gap-2 shrink-0">
            <span className="font-poppins text-[16px] text-[#F7F9FA]">{score}</span>
            {delta != null && (
                <span className="font-poppins text-[12px] text-[#82CC27]">+{delta}</span>
            )}
        </div>
    );
}

const PAGE_NUMBERS = [1, 2, 34, 35];

export default function RankingTable() {
    const [page, setPage] = useState(1);

    return (
        <div className="flex-1 rounded-[12px] bg-[#1A1D1F] border border-[#1F272A] overflow-hidden">
            <div className="h-[44px] px-6 flex items-center gap-4 border-b border-[#272B30]">
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[40px] shrink-0">№</span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase flex-1">Ism familiya</span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[110px] flex items-center justify-end gap-1 shrink-0">
                    Klassika <SortIcon/>
                </span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[110px] flex items-center justify-end gap-1 shrink-0">
                    Rapid <SortIcon/>
                </span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[110px] flex items-center justify-end gap-1 shrink-0">
                    Blitz <SortIcon/>
                </span>
            </div>

            {PLAYERS.map((p, i) => (
                <div key={p.rank}>
                    <div className="h-[54px] px-6 flex items-center gap-4">
                        <span className="font-poppins text-[16px] text-[#F7F9FA] w-[40px] shrink-0">{p.rank}.</span>
                        <div className="flex-1 flex items-center gap-2 min-w-0">
                            <div className="w-[24px] h-[24px] rounded-full bg-[#272B30] shrink-0"/>
                            <span className="font-poppins text-[16px] text-[#F7F9FA] truncate">{p.name}</span>
                            <Flag/>
                        </div>
                        <RatingCell score={p.klassika} delta={p.klassikaDelta}/>
                        <RatingCell score={p.rapid}/>
                        <RatingCell score={p.blitz}/>
                    </div>
                    {i < PLAYERS.length - 1 && <div className="h-px bg-[#272B30] mx-6"/>}
                </div>
            ))}

            <div className="h-[64px] px-6 flex items-center justify-between border-t border-[#272B30]">
                <div className="flex items-center gap-2">
                    <span className="font-poppins text-[14px] text-[#9D9FA1]">Ko‘rsatish</span>
                    <button
                        className="w-[46px] h-[28px] flex items-center justify-center gap-1 rounded-[6px] bg-[#15181A] border border-[#232627] font-poppins text-[14px] text-[#F7F9FA] cursor-pointer">
                        10
                        <Image src="/chevron-right.svg" alt="" width={12} height={12} className="rotate-90"/>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#9D9FA1] hover:bg-white/5 disabled:opacity-30 cursor-pointer">
                        <Image src="/chevron-right.svg" alt="" width={16} height={16} className="rotate-180"/>
                    </button>
                    {PAGE_NUMBERS.map((n, i) => (
                        <span key={n} className="flex items-center gap-2">
                            {i === 2 && <span className="font-poppins text-[14px] text-[#9D9FA1]">...</span>}
                            <button
                                onClick={() => setPage(n)}
                                className={`w-[28px] h-[28px] flex items-center justify-center rounded-[6px] font-poppins text-[14px] cursor-pointer ${
                                    page === n ? "bg-[#1C92E0] text-white" : "text-[#9D9FA1] hover:bg-white/5"
                                }`}>
                                {n}
                            </button>
                        </span>
                    ))}
                    <button
                        onClick={() => setPage((p) => Math.min(35, p + 1))}
                        disabled={page === 35}
                        className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#9D9FA1] hover:bg-white/5 disabled:opacity-30 cursor-pointer">
                        <Image src="/chevron-right.svg" alt="" width={16} height={16}/>
                    </button>
                </div>
            </div>
        </div>
    );
}
