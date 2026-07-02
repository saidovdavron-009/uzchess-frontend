"use client"
import HeaderItem from "@/app/common/components/Header/Header";
import Footer from "@/app/common/components/Footer/Footer";
import GameOfDay from "@/app/main/components/GameOfDay";
import QuickLinkCard from "@/app/main/components/QuickLinkCard";
import RatingList from "@/app/main/components/RatingList";
import CompletedGames from "@/app/main/components/CompletedGames";
import ChessChampionshipBanner from "@/app/main/components/ChessChampionshipBanner";
import LatestNews from "@/app/main/components/LatestNews";
import Anons from "@/app/common/components/Anons";
import TopCourses from "@/app/common/components/Course/TopCourses";
import BookItem from "@/app/common/components/Book/BookItem";
import DonationsBanner from "@/app/common/components/donationsBanner";

export default function Page() {
    return <>
        <HeaderItem/>
        <div className="m-[32px] flex gap-6 items-start">
            <div className="flex flex-col gap-6">
                <GameOfDay
                    image="/game-of-day.png"
                    time="5:30"
                    gameType="Bullet"
                    whitePlayer="Abdusattorov Nodirbek"
                    blackPlayer="Magnus Carlsen"
                />
                <RatingList/>
            </div>
            <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                    <QuickLinkCard
                        label="Kurslar"
                        iconGlowSrc="/cap-icon-glow.svg"
                        watermarkSrc="/cap-watermark.svg"
                        watermarkWidth={272}
                        watermarkHeight={164}
                        watermarkPosCls="top-[-26px] left-[204px]"
                    />
                    <QuickLinkCard
                        label="Kutubxona"
                        iconGlowSrc="/books-icon-glow.svg"
                        watermarkSrc="/books-watermark.svg"
                        watermarkWidth={171}
                        watermarkHeight={152}
                        watermarkPosCls="top-[2px] left-[212px]"
                    />
                </div>
                <CompletedGames/>
                <ChessChampionshipBanner/>
                <LatestNews/>
            </div>
            <div className="w-[326px] h-[1286px] flex flex-col gap-5 items-center pl-20">
                <DonationsBanner/>
                <Anons/>
                <TopCourses/>
                <BookItem/>
            </div>
        </div>
        <Footer/>
    </>
}