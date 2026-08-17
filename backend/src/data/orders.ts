export interface Order {
  id: string;            // Mã DDH, vd "DDH.01/NSC.01/VMO-AQT"
  tenDoiTac: string;        // Tên đối tác
  maNganSach: string;       // Mã Ngân sách liên kết, vd "NSC.01-2026-CNTT"
  giaTri: number;          // Giá trị DDH (VNĐ)
  tinhTrang: "Hiệu lực" | "Bản nháp" | "Hết hiệu lực";
  nguoiTao: string;
  thoiDiemTao: string;       // "12/05/2024 10:30"
}

export const orders: Order[] = [
  { id: "DDH.01", tenDoiTac: "Công ty TNHH Giải pháp Phần mềm ABC Việt Nam", maNganSach: "NSC.01-2026-CNTT", giaTri: 1250000000, tinhTrang: "Hiệu lực", nguoiTao: "Nguyễn Văn An", thoiDiemTao: "12/05/2024 10:30" },
  { id: "DDH.02", tenDoiTac: "Tập đoàn Tư vấn Nhân sự Global Elite", maNganSach: "NSC.01-2026-CNTT", giaTri: 850000000, tinhTrang: "Bản nháp", nguoiTao: "Trần Thị Bình", thoiDiemTao: "16/05/2024 14:20" },
  { id: "DDH.03", tenDoiTac: "Công ty CP Truyền thông Đa phương tiện Sao Mai", maNganSach: "NSC.01-2026-CNTT", giaTri: 2100000000, tinhTrang: "Hiệu lực", nguoiTao: "Lê Hoàng Long", thoiDiemTao: "19/05/2024 09:15" },
  { id: "DDH.04", tenDoiTac: "Liên minh Công nghệ số DTG Group", maNganSach: "NSC.01-2026-CNTT", giaTri: 450000000, tinhTrang: "Hết hiệu lực", nguoiTao: "Phạm Minh Đức", thoiDiemTao: "21/05/2024 16:45" },
  { id: "DDH.05", tenDoiTac: "Công ty Logistics Thần Tốc", maNganSach: "NSC.01-2026-CNTT", giaTri: 120000000, tinhTrang: "Bản nháp", nguoiTao: "Nguyễn Văn An", thoiDiemTao: "23/05/2024 11:00" },
  { id: "DDH.06", tenDoiTac: "Công ty CP Dịch vụ Nhân lực Việt Thành", maNganSach: "NSC.02-2026-CNTT", giaTri: 980000000, tinhTrang: "Hiệu lực", nguoiTao: "Trần Thị Bình", thoiDiemTao: "25/05/2024 08:40" },
  { id: "DDH.07", tenDoiTac: "Công ty TNHH Kỹ thuật số Phương Nam", maNganSach: "NSC.02-2026-CNTT", giaTri: 1600000000, tinhTrang: "Hiệu lực", nguoiTao: "Lê Hoàng Long", thoiDiemTao: "27/05/2024 13:10" },
  { id: "DDH.08", tenDoiTac: "Tập đoàn Giải pháp Số VietSoft", maNganSach: "NSC.02-2026-CNTT", giaTri: 3200000000, tinhTrang: "Bản nháp", nguoiTao: "Phạm Minh Đức", thoiDiemTao: "29/05/2024 15:55" },
  { id: "DDH.09", tenDoiTac: "Công ty CP Nhân sự HR Solutions", maNganSach: "NSC.02-2026-CNTT", giaTri: 560000000, tinhTrang: "Hết hiệu lực", nguoiTao: "Nguyễn Văn An", thoiDiemTao: "31/05/2024 10:05" },
  { id: "DDH.10", tenDoiTac: "Công ty TNHH Outsourcing Toàn Cầu", maNganSach: "NSC.03-2026-CNTT", giaTri: 1750000000, tinhTrang: "Hiệu lực", nguoiTao: "Trần Thị Bình", thoiDiemTao: "02/06/2024 09:30" },
  { id: "DDH.11", tenDoiTac: "Công ty CP Đầu tư Công nghệ Bắc Việt", maNganSach: "NSC.03-2026-CNTT", giaTri: 420000000, tinhTrang: "Bản nháp", nguoiTao: "Lê Hoàng Long", thoiDiemTao: "04/06/2024 14:45" },
  { id: "DDH.12", tenDoiTac: "Công ty TNHH Giải pháp Điện toán Đám mây SkyNet", maNganSach: "NSC.03-2026-CNTT", giaTri: 2800000000, tinhTrang: "Hiệu lực", nguoiTao: "Phạm Minh Đức", thoiDiemTao: "06/06/2024 11:20" },
  { id: "DDH.13", tenDoiTac: "Công ty CP Tư vấn Quản trị Nhân lực Á Châu", maNganSach: "NSC.04-2026-DLPT", giaTri: 670000000, tinhTrang: "Hiệu lực", nguoiTao: "Nguyễn Văn An", thoiDiemTao: "08/06/2024 16:00" },
  { id: "DDH.14", tenDoiTac: "Công ty TNHH Phát triển Phần mềm Hưng Thịnh", maNganSach: "NSC.04-2026-DLPT", giaTri: 1100000000, tinhTrang: "Hết hiệu lực", nguoiTao: "Trần Thị Bình", thoiDiemTao: "10/06/2024 08:50" },
  { id: "DDH.15", tenDoiTac: "Công ty CP Công nghệ Sáng Tạo Việt", maNganSach: "NSC.05-2026-CNTT", giaTri: 390000000, tinhTrang: "Bản nháp", nguoiTao: "Lê Hoàng Long", thoiDiemTao: "12/06/2024 13:35" },
  { id: "DDH.16", tenDoiTac: "Công ty TNHH Dịch vụ IT Toàn Phát", maNganSach: "NSC.05-2026-CNTT", giaTri: 1450000000, tinhTrang: "Hiệu lực", nguoiTao: "Phạm Minh Đức", thoiDiemTao: "14/06/2024 10:15" },
  { id: "DDH.17", tenDoiTac: "Công ty CP Nhân lực Chất lượng cao HiTalent", maNganSach: "NSC.06-2026-NV", giaTri: 890000000, tinhTrang: "Hiệu lực", nguoiTao: "Nguyễn Văn An", thoiDiemTao: "16/06/2024 09:00" },
  { id: "DDH.18", tenDoiTac: "Công ty TNHH Giải pháp Doanh nghiệp Số EnterSoft", maNganSach: "NSC.06-2026-NV", giaTri: 2050000000, tinhTrang: "Bản nháp", nguoiTao: "Trần Thị Bình", thoiDiemTao: "18/06/2024 15:25" },
  { id: "DDH.19", tenDoiTac: "Công ty CP Thiết kế và Xây dựng Kỹ thuật số", maNganSach: "NSC.07-2026-DLPT", giaTri: 310000000, tinhTrang: "Hết hiệu lực", nguoiTao: "Lê Hoàng Long", thoiDiemTao: "20/06/2024 11:40" },
  { id: "DDH.20", tenDoiTac: "Công ty TNHH Vận hành Hệ thống CNTT Nam Á", maNganSach: "NSC.07-2026-DLPT", giaTri: 1980000000, tinhTrang: "Hiệu lực", nguoiTao: "Phạm Minh Đức", thoiDiemTao: "22/06/2024 14:10" },
];