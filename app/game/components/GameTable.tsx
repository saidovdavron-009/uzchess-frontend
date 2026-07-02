"use client"
import {useState} from "react";
import Image from "next/image";

type GameType = "Bullet" | "Blitz" | "Rapid";

interface GameRow {
    rank: number;
    player1: string;
    flag1: FlagCode;
    rating1: string;
    score1: number;
    winner1: boolean;
    player2: string;
    flag2: FlagCode;
    rating2: string;
    score2: number;
    winner2: boolean;
    gameType: GameType;
    moves: number;
    date: string;
}

const FLAGS = {
    uz: "/flags/uz.svg",
    us: "/flags/us.svg",
    no: "/flags/no.svg",
    ge: "/flags/ge.svg",
    hu: "/flags/hu.svg",
    gq: "/flags/gq.svg",
    ie: "/flags/ie.svg",
    cl: "/flags/cl.svg",
} as const;

type FlagCode = keyof typeof FLAGS;

const gameTypeStyle: Record<GameType, { icon: string; color: string; textCls: string }> = {
    Bullet: {icon: "/Frame.svg",      color: "#82CC27", textCls: "text-[#82CC27]"},
    Blitz:  {icon: "/blitz-icon.svg", color: "#E0B531", textCls: "text-[#E0B531]"},
    Rapid:  {icon: "/rapid-icon.svg", color: "#DC2D2D", textCls: "text-[#DC2D2D]"},
};

const ROWS: GameRow[] = [
    {rank: 1, player1: "Jasurbek Pulatov", flag1: "uz", rating1: "(2 896)", score1: 2, winner1: true, player2: "nikaru hakamura", flag2: "us", rating2: "(2 291)", score2: 0, winner2: false, gameType: "Rapid", moves: 56, date: "23 Yanvar, 2022"},
    {rank: 2, player1: "Abdusattorov Nodirbek", flag1: "uz", rating1: "(3 581)", score1: 2, winner1: true, player2: "Magnus Karlsen", flag2: "no", rating2: "(3 405)", score2: 0, winner2: false, gameType: "Blitz", moves: 15, date: "22 Yanvar, 2022"},
    {rank: 3, player1: "Aronian Levon", flag1: "ge", rating1: "(3 581)", score1: 1, winner1: false, player2: "Sindarov Javokhir", flag2: "uz", rating2: "(3 405)", score2: 2, winner2: true, gameType: "Bullet", moves: 25, date: "21 Yanvar, 2022"},
    {rank: 4, player1: "Yakubboev Nodirbek", flag1: "uz", rating1: "(4 256)", score1: 1, winner1: true, player2: "Rapport Richard", flag2: "hu", rating2: "(1 250)", score2: 1, winner2: true, gameType: "Bullet", moves: 15, date: "20 Yanvar, 2022"},
    {rank: 5, player1: "Jasurbek Pulatov", flag1: "uz", rating1: "(2 896)", score1: 2, winner1: false, player2: "nikaru hakamura", flag2: "us", rating2: "(2 291)", score2: 0, winner2: true, gameType: "Rapid", moves: 56, date: "19 Yanvar, 2022"},
    {rank: 6, player1: "Vanderreyx Shrilanka", flag1: "gq", rating1: "(4 256)", score1: 1, winner1: true, player2: "Hakuna Matata", flag2: "cl", rating2: "(1 250)", score2: 1, winner2: true, gameType: "Blitz", moves: 15, date: "18 Yanvar, 2022"},
    {rank: 7, player1: "Manor Subkrekor", flag1: "gq", rating1: "(919)", score1: 1, winner1: false, player2: "Matatabi Farizaku", flag2: "ie", rating2: "(1358)", score2: 1, winner2: true, gameType: "Blitz", moves: 42, date: "17 Yanvar, 2022"},
    {rank: 8, player1: "Abdusattorov Nodirbek", flag1: "uz", rating1: "(3 581)", score1: 2, winner1: true, player2: "Magnus Karlsen", flag2: "no", rating2: "(3 405)", score2: 0, winner2: false, gameType: "Blitz", moves: 15, date: "22 Yanvar, 2022"},
    {rank: 9, player1: "Manor Subkrekor", flag1: "gq", rating1: "(919)", score1: 1, winner1: false, player2: "Matatabi Farizaku", flag2: "ie", rating2: "(1358)", score2: 1, winner2: true, gameType: "Blitz", moves: 42, date: "17 Yanvar, 2022"},
    {rank: 10, player1: "Manor Subkrekor", flag1: "gq", rating1: "(919)", score1: 1, winner1: false, player2: "Matatabi Farizaku", flag2: "ie", rating2: "(1358)", score2: 1, winner2: true, gameType: "Blitz", moves: 42, date: "17 Yanvar, 2022"},
];

function SortIcon() {
    return (
        <Image src="/icon-sort.svg" alt="" width={12} height={12} className="shrink-0"/>
    );
}

function PlayerLine({name, flag, winner}: { name: string; flag: FlagCode; winner: boolean }) {
    return (
        <div className="h-[24px] flex items-center gap-2">
            <Image src={winner ? "/trophy-gold.svg" : "/trophy-gray.svg"} alt="" width={20} height={20}/>
            <span className="font-poppins text-[16px] text-[#F7F9FA] truncate">{name}</span>
            <Image src={FLAGS[flag]} alt={flag} width={16} height={16} className="rounded-[2px] shrink-0"/>
        </div>
    );
}

const PAGE_NUMBERS = [1, 2, 34, 35];

export default function GameTable() {
    const [page, setPage] = useState(1);

    return (
        <div className="flex-1 rounded-[12px] bg-[#1A1D1F] border border-[#1F272A] overflow-hidden">
            <div className="h-[44px] px-4 flex items-center gap-4 border-b border-[#272B30]">
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[40px] shrink-0">№</span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[280px] shrink-0">O&apos;yinchilar va natija</span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[110px] shrink-0">Reyting</span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[90px] shrink-0">Natija</span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[140px] flex items-center gap-1 shrink-0">
                    O&apos;yin turi <SortIcon/>
                </span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase w-[130px] flex items-center gap-1 shrink-0">
                    Yurishlar <SortIcon/>
                </span>
                <span className="font-poppins font-medium text-[12px] tracking-[0.72px] text-[#9D9FA1] uppercase flex-1 flex items-center justify-end gap-1">
                    O&apos;yin sanasi <SortIcon/>
                </span>
            </div>

            {ROWS.map((row, i) => {
                const type = gameTypeStyle[row.gameType];
                return (
                    <div key={i}>
                        <div className="h-[84px] px-4 flex items-center gap-4">
                            <span className="font-poppins text-[16px] text-[#F7F9FA] w-[40px] shrink-0">{row.rank}.</span>
                            <div className="w-[280px] flex flex-col gap-2 shrink-0 min-w-0">
                                <PlayerLine name={row.player1} flag={row.flag1} winner={row.winner1}/>
                                <PlayerLine name={row.player2} flag={row.flag2} winner={row.winner2}/>
                            </div>
                            <div className="w-[110px] flex flex-col gap-2 shrink-0">
                                <span className="h-[24px] flex items-center font-poppins text-[16px] text-[#F7F9FA]">{row.rating1}</span>
                                <span className="h-[24px] flex items-center font-poppins text-[16px] text-[#F7F9FA]">{row.rating2}</span>
                            </div>
                            <div className="w-[90px] flex flex-col gap-2 shrink-0">
                                <span className="h-[24px] flex items-center font-poppins text-[16px] text-[#F7F9FA]">{row.score1}</span>
                                <span className="h-[24px] flex items-center font-poppins text-[16px] text-[#F7F9FA]">{row.score2}</span>
                            </div>
                            <div className="w-[140px] flex items-center gap-1 shrink-0">
                                <Image src={type.icon} alt="" width={20} height={20}/>
                                <span className={`font-poppins font-medium text-[16px] ${type.textCls}`}>{row.gameType}</span>
                            </div>
                            <span className="w-[130px] font-poppins text-[16px] text-[#F7F9FA] shrink-0">{row.moves}</span>
                            <span className="flex-1 font-poppins text-[16px] text-[#F7F9FA] text-right">{row.date}</span>
                        </div>
                        {i < ROWS.length - 1 && <div className="h-px bg-[#272B30] mx-4"/>}
                    </div>
                );
            })}

            <div className="h-[64px] px-4 flex items-center justify-between border-t border-[#272B30]">
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