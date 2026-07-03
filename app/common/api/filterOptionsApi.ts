import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface FilterOption {
    id: number;
    title: string;
}

export interface EntityFilters {
    difficultyId: number | null;
    categoryId: number | null;
    languageId: number | null;
    rating: number | null;
}

export const EMPTY_FILTERS: EntityFilters = {
    difficultyId: null,
    categoryId: null,
    languageId: null,
    rating: null,
};

async function fetchList(path: string): Promise<FilterOption[]> {
    try {
        const {data} = await axios.get(`${API_URL}${path}?size=200`);
        return Array.isArray(data) ? data : (data?.data ?? []);
    } catch {
        return [];
    }
}

export const fetchDifficulties = () => fetchList("/public/difficulty");
export const fetchCourseCategories = () => fetchList("/public/courseCategory");
export const fetchBookCategories = () => fetchList("/public/bookCategory");
export const fetchLanguages = () => fetchList("/public/language");

export function toFilterParams(filters: EntityFilters) {
    const params: Record<string, number> = {};
    if (filters.difficultyId) params.difficultyId = filters.difficultyId;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    if (filters.languageId) params.languageId = filters.languageId;
    if (filters.rating) params.rating = filters.rating;
    return params;
}
