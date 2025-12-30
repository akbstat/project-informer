import { BASE_PATH } from "@/constant";

export async function apiFetch(path: string, param = {}) {
    const url = `${BASE_PATH}${path}`;
    return fetch(url, param);
}