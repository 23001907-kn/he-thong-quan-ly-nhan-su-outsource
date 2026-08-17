import axios from "axios";
import type { Employee } from "../types/employee";

const API_BASE = "http://localhost:5000/api"; // đổi lại theo PORT backend của bạn

// Lấy danh sách toàn bộ nhân sự
export const getEmployees = async (): Promise<Employee[]> => {
  const res = await axios.get<Employee[]>(`${API_BASE}/employees`);
  return res.data;
};

// Lấy chi tiết 1 nhân sự theo CCCD
export const getEmployeeByCccd = async (cccd: string): Promise<Employee> => {
  const res = await axios.get<Employee>(`${API_BASE}/employees/${cccd}`);
  return res.data;
};

// Lấy danh sách nhân sự theo mã DDH (dùng cho tab "Theo DDH")
export const getEmployeesByDDH = async (maDDH: string): Promise<Employee[]> => {
  const res = await axios.get<Employee[]>(`${API_BASE}/employees/by-ddh/${maDDH}`);
  return res.data;
};

// Thêm mới nhân sự
export const createEmployee = async (data: Employee): Promise<Employee> => {
  const res = await axios.post<Employee>(`${API_BASE}/employees`, data);
  return res.data;
};

// Cập nhật nhân sự theo CCCD
export const updateEmployee = async (
  cccd: string,
  data: Partial<Employee>
): Promise<Employee> => {
  const res = await axios.put<Employee>(`${API_BASE}/employees/${cccd}`, data);
  return res.data;
};

// Xóa nhân sự theo CCCD
export const deleteEmployee = async (cccd: string): Promise<{ success: boolean }> => {
  const res = await axios.delete<{ success: boolean }>(`${API_BASE}/employees/${cccd}`);
  return res.data;
};