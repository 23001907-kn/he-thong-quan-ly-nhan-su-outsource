export interface Order {
  id: string;            // Mã DDH, vd "DDH.01/NSC.01/VMO-AQT"
  tenDoiTac: string;        // Tên đối tác
  maNganSach: string;       // Mã Ngân sách liên kết, vd "NSC.01-2026-CNTT"
  giaTri: number;          // Giá trị DDH (VNĐ)
  tinhTrang: "Hiệu lực" | "Bản nháp" | "Hết hiệu lực";
  nguoiTao: string;
  thoiDiemTao: string;       // "12/05/2024 10:30"
}