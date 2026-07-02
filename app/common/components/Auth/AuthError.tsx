export default function AuthError({message}: { message: string | null }) {
    if (!message) return null;
    return <p className="w-[419px] font-poppins text-[14px] text-[#dc2d2d]">{message}</p>;
}