import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface ReportCategory {
    id: number;
    title: string;
    order: number;
}

export async function fetchReportCategories(): Promise<ReportCategory[]> {
    try {
        const {data} = await axios.get(`${API_URL}/public/reportCategory`);
        const list: ReportCategory[] = Array.isArray(data) ? data : (data?.data ?? []);
        return list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch {
        return [];
    }
}

export async function submitReport(token: string, categoryId: number, target: string, targetId: number, description: string): Promise<boolean> {
    try {
        await axios.post(`${API_URL}/public/report`, {categoryId, target, targetId, description}, {
            headers: {Authorization: `Bearer ${token}`},
        });
        return true;
    } catch {
        return false;
    }
}
