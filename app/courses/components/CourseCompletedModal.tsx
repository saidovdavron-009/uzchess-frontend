"use client"
import Image from "next/image";

export default function CourseCompletedModal({onClose, onDownloadCertificate}: {
    onClose: () => void;
    onDownloadCertificate: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-[420px] max-w-[90vw] rounded-[16px] bg-[#14171A] border border-[#232627] px-[32px] py-[40px] flex flex-col items-center text-center">
                <div className="relative w-[88px] h-[88px] mb-[20px] flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#3DBE29]/30 blur-xl"/>
                    <div className="relative w-[80px] h-[80px] rounded-full bg-[#3DBE29] flex items-center justify-center">
                        <Image src="/icon-flag-checkered.svg" alt="" width={36} height={36}/>
                    </div>
                </div>

                <h2 className="text-[#f7f9fa] text-[22px] font-bold font-poppins mb-[12px]">Tabriklaymiz!</h2>
                <p className="text-[#9DA1A3] text-[14px] leading-[22px] font-poppins max-w-[340px] mb-[24px]">
                    Siz ushbu kursdagi barcha darslik videolarni muvaffaqiyatli ko&apos;rib bo&apos;ldingiz. Endi esa sizga taqdim etilgan sertifikatingizni yuklab olishingiz mumkin
                </p>

                <button
                    onClick={onDownloadCertificate}
                    className="w-full h-[48px] rounded-[10px] bg-[#1c92e0] hover:bg-[#1a7fc7] transition-colors flex items-center justify-center gap-[10px] text-white text-[15px] font-poppins font-medium"
                >
                    <Image src="/icon-download.svg" alt="" width={18} height={18}/>
                    Sertifikatni yuklab olish
                </button>

                <button
                    onClick={onClose}
                    className="absolute top-[16px] right-[16px] w-[28px] h-[28px] flex items-center justify-center text-[#9DA1A3] hover:text-[#f7f9fa] transition-colors"
                    aria-label="Yopish"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}
