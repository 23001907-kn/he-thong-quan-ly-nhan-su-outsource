import axios from "axios";
import type { Partner } from "../types/partner";

const API_URL = "http://localhost:5000/api/partners";

export const partnerApi = {
  getAll: async (): Promise<Partner[]> => {
    const res = await axios.get<Partner[]>(API_URL);
    return res.data;
  },
  getOne: async (maSoThue: string): Promise<Partner> => {
    const res = await axios.get<Partner>(`${API_URL}/${maSoThue}`);
    return res.data;
  },
  create: async (data: Partner): Promise<Partner> => {
    const res = await axios.post<Partner>(API_URL, data);
    return res.data;
  },
  update: async (maSoThue: string, data: Partial<Partner>): Promise<Partner> => {
    const res = await axios.put<Partner>(`${API_URL}/${maSoThue}`, data);
    return res.data;
  },
  remove: async (maSoThue: string): Promise<void> => {
    await axios.delete(`${API_URL}/${maSoThue}`);
  },
};