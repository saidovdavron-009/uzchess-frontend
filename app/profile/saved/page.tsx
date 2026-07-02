"use client"
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import {fetchCurrentUser, getToken, CurrentUser} from "@/app/common/components/Auth/authApi";
import ProfileUserCard from "@/app/profile/components/ProfileUserCard";
import ProfileNav from "@/app/profile/components/ProfileNav";
import {
    fetchSavedBooks, fetchSavedCourses, fetchSavedSouvenirs,
    unlikeBook, unlikeCourse, unlikeSouvenir,
    SavedBook, SavedCourse, SavedSouvenir, fixUrl, formatPrice
} from "@/app/profile/api/savedApi";

type Tab = "kurslar" | "kitoblar" | "mahsulotlar";

export default function SavedPage() {
    const router = useRouter();
    const [token, setToken] = useState("");
    const [user, setUser] = useState<CurrentUser | null>(null);
    const [activeTab, setActiveTab] = useState<Tab>("kurslar");
    const [books, setBooks] = useState<SavedBook[]>([]);
    const [courses, setCourses] = useState<SavedCourse[]>([]);
    const [souvenirs, setSouvenirs] = useState<SavedSouvenir[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const t = getToken() ?? "";
        setToken(t);
        fetchCurrentUser(t)
            .then(async (currentUser) => {
                if (currentUser) setUser(currentUser);
                const [b, c, s] = await Promise.all([
                    fetchSavedBooks(t),
                    fetchSavedCourses(t),
                    fetchSavedSouvenirs(t),
                ]);
                setBooks(b);
                setCourses(c);
                setSouvenirs(s);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function handleUnlikeCourse(id: number) {
        try { await unlikeCourse(token, id); } catch {}
        setCourses((prev) => prev.filter((c) => c.id !== id));
    }

    async function handleUnlikeBook(id: number) {
        try { await unlikeBook(token, id); } catch {}
        setBooks((prev) => prev.filter((b) => b.id !== id));
    }

    async function handleUnlikeSouvenir(id: number) {
        try { await unlikeSouvenir(token, id); } catch {}
        setSouvenirs((prev) => prev.filter((s) => s.id !== id));
    }

    const tabs: { key: Tab; label: string }[] = [
        {key: "kurslar", label: "Saqlangan kurslar"},
        {key: "mahsulotlar", label: "Saqlangan mahsulotlar"},
        {key: "kitoblar", label: "Saqlangan kitoblar"},
    ];

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
                <Image src="/NewsImage/icon8.svg" alt="" width={16} height={16}/>
                <span className="text-[#6D7274] text-[14px] font-medium">Asosiy</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#6D7274] text-[14px] font-medium">Profil</span>
                <Image src="/NewsImage/icon7.svg" alt="" width={8} height={8}/>
                <span className="text-[#F7F9FA] text-[14px] font-medium">Saqlanganlar</span>
            </div>

            <div className="mt-[20px] ml-[32px] flex gap-[24px] items-start pb-[40px]">

                <div className="flex flex-col gap-[24px] shrink-0">
                    {user && <ProfileUserCard user={user}/>}
                    <ProfileNav active="Saqlanganlar"/>
                </div>

                <div className="flex-1 flex flex-col gap-[24px]">

                    <div className="flex w-fit items-center bg-white/[0.06] rounded-full p-[4px] gap-[4px]">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`rounded-full px-[16px] h-[39px] text-[14px] font-poppins transition-colors whitespace-nowrap ${
                                    activeTab === tab.key
                                        ? "bg-[#1C92E0] text-[#F7F9FA] font-bold"
                                        : "text-[#9DA1A3] font-medium hover:text-[#F7F9FA]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === "kurslar" && (
                        <div className="flex flex-wrap gap-[24px]">
                            {courses.length === 0
                                ? <EmptyState icon="/ProfileImage/courses-stack.svg" text="Saqlangan kurslar yo'q"/>
                                : courses.map((c) => (
                                    <SavedCourseCard
                                        key={c.id}
                                        course={c}
                                        onClick={() => router.push(`/courses/${c.id}`)}
                                        onUnlike={(e) => { e.stopPropagation(); handleUnlikeCourse(c.id); }}
                                    />
                                ))}
                        </div>
                    )}

                    {activeTab === "mahsulotlar" && (
                        <div className="flex flex-wrap gap-[24px]">
                            {souvenirs.length === 0
                                ? <EmptyState icon="/ProfileImage/saved-heart.svg" text="Saqlangan mahsulotlar yo'q"/>
                                : souvenirs.map((s) => (
                                    <SavedProductCard
                                        key={s.id}
                                        souvenir={s}
                                        onUnlike={(e) => { e.stopPropagation(); handleUnlikeSouvenir(s.id); }}
                                    />
                                ))}
                        </div>
                    )}

                    {activeTab === "kitoblar" && (
                        <div className="flex flex-wrap gap-[24px]">
                            {books.length === 0
                                ? <EmptyState icon="/ProfileImage/saved-heart.svg" text="Saqlangan kitoblar yo'q"/>
                                : books.map((b) => (
                                    <SavedBookCard
                                        key={b.id}
                                        book={b}
                                        onClick={() => router.push(`/book/${b.id}`)}
                                        onUnlike={(e) => { e.stopPropagation(); handleUnlikeBook(b.id); }}
                                    />
                                ))}
                        </div>
                    )}

                </div>
            </div>

            <Footer/>
        </div>
    );
}

function EmptyState({icon, text}: { icon: string; text: string }) {
    return (
        <div className="w-full flex flex-col items-center justify-center gap-4 py-20">
            <Image src={icon} alt="" width={64} height={64}/>
            <p className="text-[#9DA0A1] font-poppins text-[16px]">{text}</p>
        </div>
    );
}

function SavedCourseCard({course, onClick, onUnlike}: {
    course: SavedCourse;
    onClick: () => void;
    onUnlike: (e: React.MouseEvent) => void;
}) {
    const imageUrl = fixUrl(course.image);
    const newP = Number(course.newPrice);
    const oldP = Number(course.price);
    const isFree = newP === 0;
    const hasDiscount = !isFree && oldP > newP;

    return (
        <div
            onClick={onClick}
            className="w-[501px] h-[194px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] flex flex-col cursor-pointer hover:border-[#1C92E0] transition-colors overflow-hidden"
        >
            <div className="flex gap-[16px] px-[20px] pt-[20px] flex-1 min-h-0">
                <div className="w-[108px] h-[108px] bg-[#13181C] rounded-[8px] relative shrink-0 overflow-hidden">
                    <Image src={imageUrl} alt={course.title} fill className="object-cover" unoptimized/>
                    {course.rating != null && (
                        <div className="absolute top-[4px] left-[4px] flex items-center gap-[4px] bg-[rgba(11,20,24,0.6)] rounded-[6px] px-[6px] h-[26px]">
                            <Image src="/Star 1.svg" alt="" width={14} height={14}/>
                            <span className="text-[#F7F9FA] text-[12px] font-medium font-poppins">{course.rating}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-[8px] flex-1 min-w-0 overflow-hidden">
                    <h3 className="text-[#F7F9FA] text-[20px] font-bold font-poppins leading-tight line-clamp-1">
                        {course.title}
                    </h3>
                    <div className="flex items-center gap-[4px] bg-white/[0.05] rounded-[6px] px-[6px] py-[4px] w-fit">
                        <Image src="/pul.png" alt="" width={16} height={16}/>
                        <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">
                            {isFree ? "Bepul" : formatPrice(newP)}
                        </span>
                        {hasDiscount && (
                            <span className="text-[#DB2C2C] text-[12px] font-poppins line-through ml-[10px]">
                                {formatPrice(oldP)}
                            </span>
                        )}
                    </div>
                    {course.description && (
                        <p className="text-[#9DA1A3] text-[14px] font-medium font-poppins line-clamp-2">
                            {course.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="h-[1px] bg-[#1F272A] mx-[20px] mt-[10px]"/>

            <div className="flex items-center gap-[16px] px-[20px] pt-[13px] pb-[20px]">
                {course.difficulty && (
                    <>
                        <div className="flex items-center gap-[4px] shrink-0">
                            <Image src={fixUrl(course.difficulty.icon)} alt="" width={20} height={20} unoptimized/>
                            <span className="text-white/60 text-[14px] font-poppins whitespace-nowrap">{course.difficulty.title}</span>
                        </div>
                        <div className="w-[1px] h-[20px] bg-[#3D4549] shrink-0"/>
                    </>
                )}
                {course.author && (
                    <div className="flex items-center gap-[4px] shrink-0">
                        <Image src="/author.svg" alt="" width={20} height={20}/>
                        <span className="text-white/60 text-[14px] font-poppins whitespace-nowrap">{course.author.fullName}</span>
                    </div>
                )}
                {course.lessonsCount != null && (
                    <>
                        <div className="w-[1px] h-[20px] bg-[#3D4549] shrink-0"/>
                        <div className="flex items-center gap-[4px] shrink-0">
                            <Image src="/vidioIcon.svg" alt="" width={20} height={20}/>
                            <span className="text-white/60 text-[14px] font-poppins whitespace-nowrap">{course.lessonsCount} ta dars</span>
                        </div>
                    </>
                )}
                <button onClick={onUnlike} className="ml-auto shrink-0 hover:opacity-70 transition-opacity">
                    <Image src="/red-heart.svg" alt="" width={24} height={24}/>
                </button>
            </div>
        </div>
    );
}

function SavedProductCard({souvenir, onUnlike}: {
    souvenir: SavedSouvenir;
    onUnlike: (e: React.MouseEvent) => void;
}) {
    const firstImage = souvenir.souvenirImage?.[0]?.image;
    const imageUrl = firstImage ? fixUrl(firstImage) : "";

    return (
        <div className="w-[326px] h-[338px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] flex flex-col cursor-pointer hover:border-[#1C92E0] transition-colors overflow-hidden">
            <div className="mx-[16px] mt-[16px]">
                <div className="w-full h-[207px] bg-[#13181C] rounded-[6px] relative overflow-hidden">
                    {imageUrl ? (
                        <Image src={imageUrl} alt={souvenir.title} fill className="object-cover" unoptimized/>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Image src="/ProfileImage/saved-heart.svg" alt="" width={40} height={40}/>
                        </div>
                    )}
                    <button
                        onClick={onUnlike}
                        className="absolute top-[10px] right-[10px] hover:opacity-70 transition-opacity"
                    >
                        <Image src="/red-heart.svg" alt="" width={24} height={24}/>
                    </button>
                </div>
            </div>

            <div className="h-[37px] bg-[#091013] flex items-center px-[16px] mt-[12px]">
                <span className="text-[#82CC27] text-[20px] font-bold font-poppins">{formatPrice(souvenir.price)}</span>
            </div>

            <div className="px-[16px] mt-[12px]">
                <p className="text-[#F7F9FA] text-[16px] font-poppins line-clamp-2">{souvenir.title}</p>
            </div>
        </div>
    );
}

function SavedBookCard({book, onClick, onUnlike}: {
    book: SavedBook;
    onClick: () => void;
    onUnlike: (e: React.MouseEvent) => void;
}) {
    const imageUrl = fixUrl(book.image);
    const newP = Number(book.newPrice);
    const oldP = Number(book.price);
    const isFree = newP === 0;
    const hasDiscount = !isFree && oldP > newP;

    return (
        <div
            onClick={onClick}
            className="w-[501px] h-[201px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] flex flex-col cursor-pointer hover:border-[#1C92E0] transition-colors overflow-hidden"
        >
            <div className="flex gap-[16px] px-[20px] pt-[20px] flex-1 min-h-0">
                <div className="w-[108px] h-[108px] bg-[#13181C] rounded-[4px] relative shrink-0 overflow-hidden">
                    <Image src={imageUrl} alt={book.title} fill className="object-cover" unoptimized/>
                    {book.rating != null && book.rating > 0 && (
                        <div className="absolute bottom-[4px] left-[4px] flex items-center gap-[4px] bg-[rgba(11,20,24,0.6)] rounded-[6px] px-[6px] h-[26px]">
                            <Image src="/Star 1.svg" alt="" width={16} height={16}/>
                            <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">{book.rating}</span>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-[8px] flex-1 min-w-0 overflow-hidden">
                    <h3 className="text-[#F7F9FA] text-[20px] font-bold font-poppins leading-tight line-clamp-1">
                        {book.title}
                    </h3>
                    <div className="flex items-center gap-[4px] bg-white/[0.05] rounded-[6px] px-[6px] py-[4px] w-fit">
                        <Image src="/pul.png" alt="" width={16} height={16}/>
                        <span className="text-[#F7F9FA] text-[14px] font-medium font-poppins">
                            {isFree ? "Bepul" : formatPrice(newP)}
                        </span>
                        {hasDiscount && (
                            <span className="text-[#DB2C2C] text-[12px] font-poppins line-through ml-[10px]">
                                {formatPrice(oldP)}
                            </span>
                        )}
                    </div>
                    {book.description && (
                        <p className="text-white/60 text-[14px] font-poppins line-clamp-2">{book.description}</p>
                    )}
                </div>
            </div>

            <div className="h-[1px] bg-[#1F272A] mx-[20px] mt-[9px]"/>
            <div className="flex items-center gap-[12px] px-[20px] pt-[12px] pb-[20px]">
                {book.difficulty && (
                    <>
                        <div className="flex items-center gap-[2px] shrink-0">
                            <Image src={fixUrl(book.difficulty.icon)} alt="" width={20} height={20} unoptimized/>
                            <span className="text-white/60 text-[14px] font-poppins whitespace-nowrap">{book.difficulty.title}</span>
                        </div>
                        <div className="w-[1px] h-[20px] bg-[#3D4549] shrink-0"/>
                    </>
                )}
                {book.pages != null && (
                    <>
                        <div className="flex items-center gap-[4px] shrink-0">
                            <Image src="/sahifaIcon.svg" alt="" width={20} height={20}/>
                            <span className="text-white/60 text-[14px] font-poppins whitespace-nowrap">{book.pages} sahifa</span>
                        </div>
                        <div className="w-[1px] h-[20px] bg-[#3D4549] shrink-0"/>
                    </>
                )}
                {book.author && (
                    <div className="flex items-center gap-[4px] shrink-0">
                        <Image src="/author.svg" alt="" width={20} height={20}/>
                        <span className="text-white/60 text-[14px] font-poppins whitespace-nowrap">{book.author.fullName}</span>
                    </div>
                )}
                <button onClick={onUnlike} className="ml-auto shrink-0 hover:opacity-70 transition-opacity">
                    <Image src="/red-heart.svg" alt="" width={24} height={24}/>
                </button>
            </div>
        </div>
    );
}
