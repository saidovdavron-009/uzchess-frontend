"use client"
import {usePathname, useRouter} from "next/navigation";
import Image from "next/image";
import {useCallback, useEffect, useRef, useState} from "react";
import axios from "axios";
import AuthModal from "@/app/common/components/Auth/AuthModal";
import NotAuthModal from "@/app/common/components/Auth/NotAuthModal";
import ProfileChip from "@/app/common/components/Auth/ProfileChip";
import {AuthStep} from "@/app/common/components/Auth/types";
import {CurrentUser, fetchCurrentUser, getToken} from "@/app/common/components/Auth/authApi";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const menuItems = [
    {label: "Asosiy", path: "/main"},
    {label: "Yangiliklar", path: "/news"},
    {label: "Kurslar", path: "/courses"},
    {label: "Kutubxona", path: "/book"},
    {label: "Bog'lanish", path: "/contact"},
];

interface SearchResult {
    id: number;
    title: string;
    type: "course" | "book" | "news";
    href: string;
}

function highlight(text: string, query: string) {
    if (!query) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    return (
        <>
            <span>{text.slice(0, idx)}</span>
            <span className="bg-[#ffa629] rounded-[4px] px-[3px] text-white">{text.slice(idx, idx + query.length)}</span>
            <span>{text.slice(idx + query.length)}</span>
        </>
    );
}

function NavItem({label, path, isActive}: {label: string; path: string; isActive: boolean}) {
    const router = useRouter();
    return (
        <li onClick={() => router.push(path)} className="relative cursor-pointer flex flex-col items-center gap-[8px] py-[4px]">
            <span className={`font-poppins text-[14px] font-medium transition-colors ${isActive ? "text-[#F7F9FA]" : "text-[#9DA0A1] hover:text-[#F7F9FA]"}`}>
                {label}
            </span>
            <div className={`w-full h-[2px] rounded-[1px] ${isActive ? "bg-[#1C92E0]" : "bg-transparent"}`}/>
        </li>
    );
}

export default function HeaderItem() {
    const pathname = usePathname();
    const router = useRouter();
    const [notAuthOpen, setNotAuthOpen] = useState(false);
    const [authOpen, setAuthOpen] = useState(false);
    const [authInitialStep, setAuthInitialStep] = useState<AuthStep>("signin");
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [searchDone, setSearchDone] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const loadUser = useCallback(() => {
        const token = getToken();
        const result = token ? fetchCurrentUser(token) : Promise.resolve(null);
        result.then(setUser);
    }, []);

    useEffect(() => { loadUser(); }, [loadUser]);

    useEffect(() => {
        const q = searchQuery.trim();
        if (!q) { setSearchResults([]); setSearchDone(false); return; }
        const timer = setTimeout(async () => {
            try {
                const [cRes, bRes, nRes] = await Promise.all([
                    axios.get(`${API}/public/courses`),
                    axios.get(`${API}/public/book`),
                    axios.get(`${API}/public/news`),
                ]);
                const ql = q.toLowerCase();
                const courses: SearchResult[] = (cRes.data.data ?? [])
                    .filter((c: {title: string}) => c.title.toLowerCase().includes(ql))
                    .map((c: {id: number; title: string}) => ({id: c.id, title: c.title, type: "course" as const, href: `/courses/${c.id}`}));
                const books: SearchResult[] = (bRes.data.data ?? [])
                    .filter((b: {title: string}) => b.title.toLowerCase().includes(ql))
                    .map((b: {id: number; title: string}) => ({id: b.id, title: b.title, type: "book" as const, href: `/book/${b.id}`}));
                const news: SearchResult[] = (nRes.data.data ?? [])
                    .filter((n: {title: string}) => n.title.toLowerCase().includes(ql))
                    .map((n: {id: number; title: string}) => ({id: n.id, title: n.title, type: "news" as const, href: `/news/${n.id}`}));
                setSearchResults([...courses, ...books, ...news]);
                setSearchDone(true);
            } catch { setSearchDone(true); }
        }, 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    function closeSearch() { setSearchOpen(false); setSearchQuery(""); setSearchResults([]); setSearchDone(false); }

    return (
        <header className="w-[1460px] h-[76px] border border-[#272B30] bg-[#1A1D1F] rounded-[16px] flex items-center justify-between px-[24px] ml-[32px] mt-[20px] shrink-0 relative z-[41]">

            <div className="flex items-center gap-[20px]">
                <Image src="/icon1.svg" alt="UzChess" width={104} height={28} className="mb-[10px]"/>
                <div className="w-[1px] h-[24px] bg-[#3D4549]"/>
                <div className="flex items-center gap-[8px]">
                    <span className="text-white text-[15px] font-medium font-poppins">O&apos;zbekcha</span>
                    <Image src="/HeaderImage/icon2.svg" alt="" width={16} height={16} className="rotate-180"/>
                </div>
            </div>

            {searchOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40"
                    onClick={closeSearch}
                />
            )}

            {searchOpen ? (
                <div ref={searchRef} className="relative z-[42]">
                    <div className="w-[676px] h-[52px] bg-[#15181A] border border-[#1C91E0] rounded-[10px] flex items-center px-[16px] gap-[12px]">
                        <Image src="/HeaderImage/icon5.svg" alt="" width={24} height={24} className="shrink-0"/>
                        <input
                            autoFocus
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onKeyDown={e => { if (e.key === "Escape") closeSearch(); }}
                            placeholder="Qidirish..."
                            className="flex-1 bg-transparent outline-none text-[#F7F9FA] text-[16px] font-medium font-poppins placeholder-[#4D555A] caret-[#1C91E0]"
                        />
                        <button
                            onClick={() => { setSearchQuery(""); setSearchResults([]); setSearchDone(false); }}
                            className="w-[83px] h-[36px] bg-white/10 rounded-[8px] text-[#F7F9FA] text-[16px] font-medium font-poppins shrink-0 hover:bg-white/20 transition-colors"
                        >
                            Tozalash
                        </button>
                    </div>

                    {searchDone && (
                        <div className="absolute top-[68px] left-0 w-[676px] bg-[#1a1d1f] border border-[#1f272a] rounded-[8px] z-50">
                            {searchResults.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-[30px] gap-[24px]">
                                    <Image src="/search-empty.png" alt="" width={305} height={203} className="object-contain"/>
                                    <span className="text-[#F7F9FA] text-[28px] font-bold font-poppins text-center">
                                        Hech qanday ma&apos;lumot topilmadi
                                    </span>
                                </div>
                            ) : (
                                <div className="pl-[24px] pt-[24px] pb-[24px] pr-0 flex flex-col gap-[10px]">
                                <div className="flex flex-col gap-[12px]">
                                    {searchResults.map((item, i) => (
                                        <div key={`${item.type}-${item.id}`}>
                                            <div
                                                onClick={() => { router.push(item.href); closeSearch(); }}
                                                className="w-[628px] h-[32px] flex items-center gap-[8px] cursor-pointer"
                                            >
                                                <div className="w-[32px] h-[32px] shrink-0 flex items-center justify-center">
                                                    {item.type === "course" && (
                                                        <Image src="/search-course-icon.png" alt="" width={32} height={32} className="object-contain"/>
                                                    )}
                                                    {item.type === "book" && (
                                                        <Image src="/search-book-icon.png" alt="" width={32} height={32} className="object-contain"/>
                                                    )}
                                                    {item.type === "news" && (
                                                        <Image src="/NewsImage/icon8.svg" alt="" width={24} height={24} className="object-contain"/>
                                                    )}
                                                </div>
                                                <span className="text-[#F7F9FA] text-[20px] font-bold font-poppins leading-none">
                                                    {highlight(item.title, searchQuery.trim())}
                                                </span>
                                            </div>
                                            {i < searchResults.length - 1 && (
                                                <div className="w-[652px] h-[1px] bg-[#2c2f31]"/>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            )}
                        </div>
                    )}
                </div>
            ) : (
                <ul className="flex items-center gap-[40px]">
                    {menuItems.map((item) => (
                        <NavItem key={item.path} label={item.label} path={item.path} isActive={pathname === item.path}/>
                    ))}
                </ul>
            )}

            <div className="flex items-center gap-[20px]">
                <div className="flex items-center gap-[24px]">
                    {searchOpen ? (
                        <button onClick={closeSearch} className="w-[24px] h-[24px] flex items-center justify-center hover:opacity-70 transition-opacity">
                            <Image src="/close-x.svg" alt="close" width={18} height={18}/>
                        </button>
                    ) : (
                        <Image src="/HeaderImage/icon5.svg" alt="" width={24} height={24} className="cursor-pointer" onClick={() => setSearchOpen(true)}/>
                    )}
                    <Image src="/HeaderImage/icon3.svg" alt="" width={24} height={24} className="cursor-pointer" onClick={() => router.push("/cart")}/>
                    <Image src="/HeaderImage/icon4.svg" alt="" width={24} height={24} className="cursor-pointer"/>
                </div>

                <div className="w-[1px] h-[24px] bg-[#3D4549]"/>

                {user ? (
                    <div onClick={() => router.push("/profile")} className="flex items-center cursor-pointer">
                        <ProfileChip user={user}/>
                    </div>
                ) : (
                    <button
                        onClick={() => setNotAuthOpen(true)}
                        className="flex items-center justify-center gap-[10px] bg-[#1C92E0] text-white text-[14px] font-poppins font-medium w-[120px] h-[40px] rounded-[8px] cursor-pointer hover:bg-[#1a7fc7] transition-colors"
                    >
                        Kirish
                        <Image src="/HeaderImage/icon6.svg" alt="" width={20} height={20}/>
                    </button>
                )}
            </div>

            <NotAuthModal
                open={notAuthOpen}
                onClose={() => setNotAuthOpen(false)}
                onSignIn={() => { setNotAuthOpen(false); setAuthInitialStep("signin"); setAuthOpen(true); }}
                onSignUp={() => { setNotAuthOpen(false); setAuthInitialStep("signup"); setAuthOpen(true); }}
            />
            <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} onSuccess={loadUser} initialStep={authInitialStep}/>
        </header>
    );
}
