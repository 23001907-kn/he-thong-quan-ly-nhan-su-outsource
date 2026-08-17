import axios from "axios";
import type { Budget } from "../types/budget";

const API_URL = "http://localhost:5000/api/budgets";

export const budgetApi = {
  getAll: async (): Promise<Budget[]> => {
    const res = await axios.get<Budget[]>(API_URL);
    return res.data;
  },
  getOne: async (maNganSach: string): Promise<Budget> => {
    const res = await axios.get<Budget>(`${API_URL}/${maNganSach}`);
    return res.data;
  },
  create: async (data: Budget): Promise<Budget> => {
    const res = await axios.post<Budget>(API_URL, data);
    return res.data;
  },
  update: async (maNganSach: string, data: Partial<Budget>): Promise<Budget> => {
    const res = await axios.put<Budget>(`${API_URL}/${maNganSach}`, data);
    return res.data;
  },
  remove: async (maNganSach: string): Promise<void> => {
    await axios.delete(`${API_URL}/${maNganSach}`);
  },
};