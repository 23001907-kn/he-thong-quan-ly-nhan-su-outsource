export interface Partner {
  maSoThue: string;
  tenCongTy: string;
  tenVietTat: string;
  diaChi: string;
  soDienThoai: string;
  trangThai: "Đang hợp tác" | "Ngưng hợp tác" | "Chưa hợp tác";
  nguoiTao: string;
  thoiDiemTao: string;
  nguoiCapNhat: string;
  thoiDiemCapNhat: string;
}