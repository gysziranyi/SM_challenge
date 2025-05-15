import { ApiResponse } from "./types/api";

const BASE_URL = "https://randomuser.me/api";

export const fetchUsers = async (resultsCount: number, allData?: boolean): Promise<ApiResponse> => {

  const arr = [
    `${BASE_URL}?`,
    `results=${resultsCount}`,
    `&inc=gender,name,location`,
  ];

  const res = await fetch(arr.join(""));

  if (!res.ok) {
    throw new Error(`API hiba: ${res.status}`);
  }

  return res.json();
};
