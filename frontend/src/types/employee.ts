export interface Employee {
  id: string;              // Mã nhân sự, vd "NS001"
  cccd: string;            // Số CCCD
  hoTen: string;
  viTri: string;
  capDo: "Junior" | "Mid" | "Senior";
  donViCungCap: string;    // = tenDoiTac trong Order (Order.tenDoiTac)
  maDDH: string;           // Mã DDH liên kết, vd "DDH.01" (Order.id)
  trangThai: "Đang làm việc" | "Đang chờ phân bổ" | "Ngừng hợp tác";
}