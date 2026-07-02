import {AuthMethod} from "./types";

interface AuthTabsProps {
    title: string;
    method: AuthMethod;
    onChange: (method: AuthMethod) => void;
}

export default function AuthTabs({title, method, onChange}: AuthTabsProps) {
    return (
        <div className="flex flex-col gap-5 w-[467px]">
            <h2 className="font-poppins font-bold text-[20px] text-[#fcfcfc]">{title}</h2>
            <div className="flex p-1 gap-1 rounded-lg bg-[#13181c] w-[419px] h-[43px]">
                <button
                    onClick={() => onChange("phone")}
                    className={`flex-1 rounded font-poppins font-medium text-[15px] cursor-pointer transition-colors ${
                        method === "phone" ? "bg-[#323639] text-[#f7f9fa]" : "text-[#9da1a3]"
                    }`}
                >
                    Telefon raqam orqali
                </button>
                <button
                    onClick={() => onChange("email")}
                    className={`flex-1 rounded font-poppins font-medium text-[15px] cursor-pointer transition-colors ${
                        method === "email" ? "bg-[#323639] text-[#f7f9fa]" : "text-[#9da1a3]"
                    }`}
                >
                    E-mail orqali
                </button>
            </div>
        </div>
    );
}