"use client"
import Image from "next/image";
import {useRouter} from "next/navigation";
import {CourseListItem} from "@/app/profile/api/purchasedCoursesApi";
import {resolveImageUrl} from "@/app/common/utils/imageUrl";

export default function PurchasedCourseCard({
    course,
}: {
    course: CourseListItem;
}) {
    const router = useRouter();

    return (
        <div
            onClick={() => router.push(`/courses/${course.id}`)}
            className="w-[501px] h-[167px] bg-[#1A1D1F] border border-[#1F272A] rounded-[12px] cursor-pointer hover:border-[#1C92E0] transition-colors flex flex-col justify-between p-[20px]"
        >
            <div className="flex gap-[16px]">
                <div className="w-[78px] h-[74px] rounded-[8px] overflow-hidden shrink-0 bg-[#13181C]">
                    <Image
                        src={course.image}
                        alt={course.title}
                        width={78}
                        height={74}
                        className="w-full h-full object-cover border-2 border-[#F7F9FA14]"
                        unoptimized
                    />
                </div>
                <div className="flex flex-col gap-[8px] flex-1 min-w-0">
                    <p className="text-[#F7F9FA] font-bold text-[20px] leading-[26px] line-clamp-1">
                        {course.title}
                    </p>
                    <p className="text-[#9DA0A1] text-[14px] leading-[20px] line-clamp-2">
                        {course.category?.title}
                    </p>
                </div>
            </div>

            <div className="w-full h-[1px] bg-[#1F272A]"/>

            <div className="flex items-center gap-[16px]">
                {course.difficulty && (
                    <>
                        <div className="flex items-center gap-[4px]">
                            <Image
                                src={resolveImageUrl(course.difficulty.icon)}
                                alt={course.difficulty.title}
                                width={24}
                                height={24}
                                className="w-[24px] h-[24px] object-contain"
                                unoptimized
                            />
                            <span className="text-[#9DA0A1] text-[14px] leading-[18px] whitespace-nowrap">
                                {course.difficulty.title}
                            </span>
                        </div>
                        <div className="w-[1px] h-[20px] bg-[#3D4549]"/>
                    </>
                )}
                {course.author && (
                    <>
                        <div className="flex items-center gap-[4px]">
                            <Image src="/author.svg" alt="" width={20} height={20}/>
                            <span className="text-[#9DA0A1] text-[14px] leading-[18px] whitespace-nowrap">
                                {course.author.fullName}
                            </span>
                        </div>
                        <div className="w-[1px] h-[20px] bg-[#3D4549]"/>
                    </>
                )}
                <div className="flex items-center gap-[4px]">
                    <Image src="/section.svg" alt="" width={24} height={24}/>
                    <span className="text-[#9DA0A1] text-[14px] leading-[18px] whitespace-nowrap">
                        {course.lessonsCount} ta dars
                    </span>
                </div>
            </div>
        </div>
    );
}