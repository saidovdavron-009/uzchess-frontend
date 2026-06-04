import {useState} from "react";
import Image from "next/image";

export default function CourseFilterItem() {
    const [isOpenDegree, setIsOpenDegree] = useState(false)
    const [degree, setDegree] = useState('Barchasi')
    const [isOpenCategory, setIsOpenCategory] = useState(false)
    const [category, setCategory] = useState('Barchasi')
    const [isOpenLessonLanguage, setIsOpenLessonLanguage] = useState(false)
    const [lessonLanguage, setLessonLanguage] = useState('Barchasi')
    return <div className="w-[286px] h-[401px] mt-[24px]">
        <div className="w-[286px] h-[82px]">
            <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Darajani tanlang:</p>
            <div
                className="relative select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px]"
                onClick={() => setIsOpenDegree(!isOpenDegree)}>
                <div>{degree}</div>
                <Image src="/select.svg" alt="select icon" width={16} height={16}/>
                {isOpenDegree &&
                    <div className="absolute px-2 py-1 bg-[#15181A] rounded-sm">
                        <div onClick={() => setDegree('Barchasi')}>Barchasi</div>
                        <div onClick={() => setDegree('Yuqori')}>Yuqori</div>
                        <div onClick={() => setDegree('O\'rta')}>O'rta</div>
                        <div onClick={() => setDegree('Past')}>Past</div>
                    </div>}
            </div>
        </div>
        <div className="w-[286px] h-[82px] mt-[24px]">
            <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Kategoriya:</p>
            <div
                className="relative select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px]"
                onClick={() => setIsOpenCategory(!isOpenCategory)}>
                <div>{category}</div>
                <Image src="/select.svg" alt="select icon" width={16} height={16}/>
                {isOpenCategory &&
                    <div className="absolute px-2 py-1 bg-[#15181A] rounded-sm">
                        <div onClick={() => setCategory('Barchasi')}>Barchasi</div>
                        <div onClick={() => setCategory('English')}>English</div>
                        <div onClick={() => setCategory('O\'zbek')}>O'zbek</div>
                        <div onClick={() => setCategory('Russian')}>Russian</div>
                    </div>}
            </div>
        </div>
        <div className="w-[286px] h-[82px] mt-[24px]">
            <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Darslik tili:</p>
            <div
                className="relative select-none bg-[#15181A] border-[#232627] border-[1px] rounded-[8px] w-[286px] h-[54px] flex justify-between items-center p-[16px]"
                onClick={() => setIsOpenLessonLanguage(!isOpenLessonLanguage)}>
                <div>{lessonLanguage}</div>
                <Image src="/select.svg" alt="select icon" width={16} height={16}/>
                {isOpenLessonLanguage &&
                    <div className="absolute px-2 py-1 bg-[#15181A] rounded-sm">
                        <div onClick={() => setLessonLanguage('Barchasi')}>Barchasi</div>
                        <div onClick={() => setLessonLanguage('English')}>English</div>
                        <div onClick={() => setLessonLanguage('O\'zbek')}>O'zbek</div>
                        <div onClick={() => setLessonLanguage('Russian')}>Russian</div>
                    </div>}
            </div>
        </div>
        <div className="w-[286px] h-[82px] mt-[24px]">
            <div>
                <p className="font-medium text-[12px] text-[#F7F9FA99] mb-[16px]">Reyting:</p>
                <div
                    className="flex flex-row-reverse justify-around border-[#232627] border-[1px] items-center [&>input]:hidden bg-[#15181A] w-[286px] h-[56px] [&>label]:text-[45px] [&>label]:rounded-[10px] [&>label]:cursor-pointer [&>label]:text-[#1A1D1F] [&>input:checked~label]:text-yellow-400 [&>label:hover]:text-yellow-400 [&>label:hover~label]:text-yellow-400">
                    <input type="radio" id="s5" name="rating" value="5"/>
                    <label htmlFor="s5">★</label>
                    <input type="radio" id="s4" name="rating" value="4"/>
                    <label htmlFor="s4">★</label>
                    <input type="radio" id="s3" name="rating" value="3"/>
                    <label htmlFor="s3">★</label>
                    <input type="radio" id="s2" name="rating" value="2"/>
                    <label htmlFor="s2">★</label>
                    <input type="radio" id="s1" name="rating" value="1"/>
                    <label htmlFor="s1">★</label>
                </div>
            </div>
        </div>
    </div>
}