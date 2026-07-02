"use client"
import {useState, useEffect} from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";

type ApiGameType = "classic" | "rapid" | "blitz";
type Winner = "first" | "second" | "draw";

interface MatchListItem {
    id: number;
    firstPlayerResult: number;
    secondPlayerResult: number;
    type: ApiGameType;
    moves: string;
    date: string;
    winner: Winner;
}

interface MatchDetail extends MatchListItem {
    firstPlayer: number;
    secondPlayer: number;
}

interface Player {
    id: number;
    fullName: string;
    classic: number;
}

interface GameRow {
    id: number;
    player1: string;
    rating1: number;
    score1: number;
    trophy1: "gold" | "gray";
    player2: string;
    rating2: number;
    score2: number;
    trophy2: "gold" | "gray";
    gameType: ApiGameType;
    date: string;
    moves: number;
}

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const UZ_MONTHS = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];

function formatDate(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.getDate()} ${UZ_MONTHS[d.getMonth()]}`;
}

const gameTypeStyle: Record<ApiGameType, {label: string; icon: string; color: string; textCls: string}> = {
    classic: {label: "Klassik", icon: "/Frame.svg",      color: "#82CC27", textCls: "text-[#82CC27]"},
    rapid:   {label: "Rapid",   icon: "/rapid-icon.svg", color: "#DC2D2D", textCls: "text-[#DC2D2D]"},
    blitz:   {label: "Blitz",   icon: "/blitz-icon.svg", color: "#E0B531", textCls: "text-[#E0B531]"},
};

function GameRowItem({row, striped}: {row: GameRow; striped: boolean}) {
    const type = gameTypeStyle[row.gameType];
    return (
        <div className={`relative h-[72px] ${striped ? "bg-[#15181A]" : ""}`}>
            <Image src={row.trophy1 === "gold" ? "/trophy-gold.svg" : "/trophy-gray.svg"} alt=""
                   width={16} height={16} className="absolute top-[17px] left-[20px]"/>
            <span className="absolute top-[15px] left-[40px] text-[14px] text-[#FCFCFC] leading-[21px]">{row.player1}</span>
            <Image src={row.trophy2 === "gold" ? "/trophy-gold.svg" : "/trophy-gray.svg"} alt=""
                   width={16} height={16} className="absolute top-[39px] left-[20px]"/>
            <span className="absolute top-[37px] left-[40px] text-[14px] text-[#FCFCFC] leading-[21px]">{row.player2}</span>

            <span className="absolute top-[16px] left-[229px] text-[14px] text-[#6F767E] leading-[18px]">({row.rating1})</span>
            <span className="absolute top-[38px] left-[229px] text-[14px] text-[#6F767E] leading-[18px]">({row.rating2})</span>

            <span className="absolute top-[16px] left-[328px] text-[14px] text-[#FCFCFC] leading-[18px]">{row.score1}</span>
            <span className="absolute top-[38px] left-[328px] text-[14px] text-[#FCFCFC] leading-[18px]">{row.score2}</span>

            <div className="absolute top-[26px] left-[394px] flex items-center gap-1">
                <Image src={type.icon} alt="" width={20} height={20}/>
                <span className={`text-[14px] font-medium leading-[18px] ${type.textCls}`}>{type.label}</span>
            </div>

            <span className="absolute top-[27px] left-[514px] text-[14px] text-[#FCFCFC] leading-[18px]">{row.moves}</span>
            <span className="absolute top-[27px] right-[20px] text-[14px] text-[#FCFCFC] leading-[18px] text-right">{row.date}</span>
        </div>
    );
}

export default function CompletedGames() {
    const [rows, setRows] = useState<GameRow[]>([]);

    useEffect(() => {
        async function load() {
            const [playersRes, matchesRes] = await Promise.all([
                axios.get(`${API}/public/player`),
                axios.get(`${API}/public/matches`),
            ]);

            const playerMap = new Map<number, Player>(
                (playersRes.data.data as Player[]).map((p: Player) => [p.id, p])
            );

            const matchList: MatchListItem[] = matchesRes.data.data ?? [];

            const details: MatchDetail[] = await Promise.all(
                matchList.map((m) =>
                    axios.get(`${API}/public/matches/${m.id}`).then((r) => r.data)
                )
            );

            const gameRows: GameRow[] = details.map((detail, i) => {
                const base = matchList[i];
                const p1 = playerMap.get(detail.firstPlayer);
                const p2 = playerMap.get(detail.secondPlayer);
                const winner: Winner = base.winner;
                return {
                    id: base.id,
                    player1: p1?.fullName ?? "O'yinchi 1",
                    rating1: p1?.classic ?? 0,
                    score1: base.firstPlayerResult,
                    trophy1: winner === "first" || winner === "draw" ? "gold" : "gray",
                    player2: p2?.fullName ?? "O'yinchi 2",
                    rating2: p2?.classic ?? 0,
                    score2: base.secondPlayerResult,
                    trophy2: winner === "second" || winner === "draw" ? "gold" : "gray",
                    gameType: base.type,
                    date: formatDate(base.date),
                    moves: Number(base.moves),
                };
            });

            setRows(gameRows);
        }

        load().catch(() => {});
    }, []);

    return (
        <div className="w-[676px] bg-[#1A1D1F] rounded-[8px] border-[#1F272A] border-[1px] overflow-hidden">
            <div className="h-[62px] px-5 flex items-center justify-between">
                <h3 className="text-[20px] font-medium text-[#FCFCFC] leading-[26px]">Yakunlangan o&apos;yinlar</h3>
                <Link
                    href="/game"
                    className="flex items-center gap-1 text-[#9DA1A3] text-[16px] leading-[24px] cursor-pointer hover:text-[#1C92E0]">
                    Barchasi
                    <Image src="/chevron-right.svg" alt="" width={24} height={24}/>
                </Link>
            </div>

            <div className="h-9 bg-[#272B30] border-t border-b border-[#151C1F] relative">
                <span className="absolute top-3 left-[40px] text-[12px] font-medium text-[#9D9FA1] leading-[12px]">O&apos;yinchilar</span>
                <span className="absolute top-3 left-[311px] text-[12px] font-medium text-[#9D9FA1] leading-[12px]">natija</span>
                <span className="absolute top-3 left-[391px] text-[12px] font-medium text-[#9D9FA1] leading-[12px]">o&apos;yin Turi</span>
                <span className="absolute top-3 left-[482px] text-[12px] font-medium text-[#9D9FA1] leading-[12px]">Yurishlar</span>
                <span className="absolute top-3 right-5 text-[12px] font-medium text-[#9D9FA1] leading-[12px]">sana</span>
            </div>

            <div>
                {rows.map((row, i) => (
                    <div key={row.id}>
                        <GameRowItem row={row} striped={i % 2 === 1}/>
                        {i < rows.length - 1 && <div className="h-px bg-[#272B30] mx-5"/>}
                    </div>
                ))}
            </div>
        </div>
    );
}