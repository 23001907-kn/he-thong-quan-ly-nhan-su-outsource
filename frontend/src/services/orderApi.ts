import axios from "axios";
import type { Order } from "../types/order";

const API_URL = "http://localhost:5000/api/orders";

export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    const res = await axios.get<Order[]>(API_URL);
    return res.data;
  },
  getOne: async (id: string): Promise<Order> => {
    const res = await axios.get<Order>(`${API_URL}/${id}`);
    return res.data;
  },
  create: async (data: Order): Promise<Order> => {
    const res = await axios.post<Order>(API_URL, data);
    return res.data;
  },
  update: async (id: string, data: Partial<Order>): Promise<Order> => {
    const res = await axios.put<Order>(`${API_URL}/${id}`, data);
    return res.data;
  },
  remove: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },
};