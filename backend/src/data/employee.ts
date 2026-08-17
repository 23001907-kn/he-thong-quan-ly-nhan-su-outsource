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

export const employees: Employee[] = [
  { id: "NS001", cccd: "089975534192", hoTen: "Vũ Đức Sơn", viTri: "DevOps Engineer", capDo: "Junior", donViCungCap: "Công ty TNHH Outsourcing Toàn Cầu", maDDH: "DDH.10", trangThai: "Ngừng hợp tác" },
  { id: "NS002", cccd: "037975030564", hoTen: "Đào Thanh Hải", viTri: "Project Manager", capDo: "Mid", donViCungCap: "Công ty CP Nhân sự HR Solutions", maDDH: "DDH.09", trangThai: "Đang chờ phân bổ" },
  { id: "NS003", cccd: "001974238849", hoTen: "Đào Công Nam", viTri: "Tester", capDo: "Senior", donViCungCap: "Công ty CP Truyền thông Đa phương tiện Sao Mai", maDDH: "DDH.03", trangThai: "Đang làm việc" },
  { id: "NS004", cccd: "022960122691", hoTen: "Chu Xuân Tuấn", viTri: "Business Analyst", capDo: "Senior", donViCungCap: "Công ty TNHH Phát triển Phần mềm Hưng Thịnh", maDDH: "DDH.14", trangThai: "Đang chờ phân bổ" },
  { id: "NS005", cccd: "001011845146", hoTen: "Nguyễn Quốc Tuấn", viTri: "Mobile Developer", capDo: "Mid", donViCungCap: "Công ty CP Nhân lực Chất lượng cao HiTalent", maDDH: "DDH.17", trangThai: "Đang làm việc" },
  { id: "NS006", cccd: "060028932528", hoTen: "Trịnh Thị Xuân", viTri: "UI/UX Designer", capDo: "Mid", donViCungCap: "Liên minh Công nghệ số DTG Group", maDDH: "DDH.04", trangThai: "Đang làm việc" },
  { id: "NS007", cccd: "089024303911", hoTen: "Lê Thu Giang", viTri: "Project Manager", capDo: "Mid", donViCungCap: "Công ty CP Truyền thông Đa phương tiện Sao Mai", maDDH: "DDH.03", trangThai: "Đang làm việc" },
  { id: "NS008", cccd: "048009638346", hoTen: "Đỗ Mỹ Trang", viTri: "Data Analyst", capDo: "Junior", donViCungCap: "Tập đoàn Giải pháp Số VietSoft", maDDH: "DDH.08", trangThai: "Đang làm việc" },
  { id: "NS009", cccd: "079969839301", hoTen: "Trần Hồng Chi", viTri: "Frontend Developer", capDo: "Senior", donViCungCap: "Tập đoàn Tư vấn Nhân sự Global Elite", maDDH: "DDH.02", trangThai: "Đang làm việc" },
  { id: "NS010", cccd: "042987382997", hoTen: "Lý Công Hải", viTri: "Backend Developer", capDo: "Junior", donViCungCap: "Công ty TNHH Phát triển Phần mềm Hưng Thịnh", maDDH: "DDH.14", trangThai: "Đang làm việc" },
  { id: "NS011", cccd: "008997010651", hoTen: "Phan Xuân Đức", viTri: "DevOps Engineer", capDo: "Junior", donViCungCap: "Công ty CP Nhân lực Chất lượng cao HiTalent", maDDH: "DDH.17", trangThai: "Đang làm việc" },
  { id: "NS012", cccd: "020998108013", hoTen: "Lý Xuân Hải", viTri: "DevOps Engineer", capDo: "Senior", donViCungCap: "Công ty TNHH Outsourcing Toàn Cầu", maDDH: "DDH.10", trangThai: "Đang làm việc" },
  { id: "NS013", cccd: "001994746872", hoTen: "Phan Văn Việt", viTri: "Fullstack Developer", capDo: "Mid", donViCungCap: "Công ty TNHH Kỹ thuật số Phương Nam", maDDH: "DDH.07", trangThai: "Đang chờ phân bổ" },
  { id: "NS014", cccd: "017969788208", hoTen: "Huỳnh Hữu Vinh", viTri: "Backend Developer", capDo: "Mid", donViCungCap: "Công ty CP Đầu tư Công nghệ Bắc Việt", maDDH: "DDH.11", trangThai: "Đang làm việc" },
  { id: "NS015", cccd: "022003990916", hoTen: "Đào Kim Linh", viTri: "Tester", capDo: "Mid", donViCungCap: "Công ty TNHH Kỹ thuật số Phương Nam", maDDH: "DDH.07", trangThai: "Đang làm việc" },
  { id: "NS016", cccd: "048992475107", hoTen: "Đào Ngọc Chi", viTri: "QA Engineer", capDo: "Junior", donViCungCap: "Công ty CP Đầu tư Công nghệ Bắc Việt", maDDH: "DDH.11", trangThai: "Đang làm việc" },
  { id: "NS017", cccd: "089963542784", hoTen: "Trịnh Thị Vân", viTri: "Business Analyst", capDo: "Senior", donViCungCap: "Công ty CP Công nghệ Sáng Tạo Việt", maDDH: "DDH.15", trangThai: "Đang làm việc" },
  { id: "NS018", cccd: "030981182449", hoTen: "Bùi Minh Khoa", viTri: "QA Engineer", capDo: "Mid", donViCungCap: "Công ty CP Tư vấn Quản trị Nhân lực Á Châu", maDDH: "DDH.13", trangThai: "Ngừng hợp tác" },
  { id: "NS019", cccd: "017966400524", hoTen: "Dương Công Thắng", viTri: "Frontend Developer", capDo: "Junior", donViCungCap: "Công ty CP Thiết kế và Xây dựng Kỹ thuật số", maDDH: "DDH.19", trangThai: "Ngừng hợp tác" },
  { id: "NS020", cccd: "030000598262", hoTen: "Đỗ Văn Nam", viTri: "Tester", capDo: "Mid", donViCungCap: "Công ty TNHH Dịch vụ IT Toàn Phát", maDDH: "DDH.16", trangThai: "Đang làm việc" },
  { id: "NS021", cccd: "089028692322", hoTen: "Nguyễn Thu Ngọc", viTri: "DevOps Engineer", capDo: "Senior", donViCungCap: "Công ty TNHH Vận hành Hệ thống CNTT Nam Á", maDDH: "DDH.20", trangThai: "Đang chờ phân bổ" },
  { id: "NS022", cccd: "042982160733", hoTen: "Dương Kim Mai", viTri: "Tester", capDo: "Junior", donViCungCap: "Công ty TNHH Giải pháp Doanh nghiệp Số EnterSoft", maDDH: "DDH.18", trangThai: "Đang làm việc" },
  { id: "NS023", cccd: "096984145868", hoTen: "Nguyễn Hữu Khoa", viTri: "Mobile Developer", capDo: "Mid", donViCungCap: "Công ty TNHH Giải pháp Phần mềm ABC Việt Nam", maDDH: "DDH.01", trangThai: "Ngừng hợp tác" },
  { id: "NS024", cccd: "017969655698", hoTen: "Đào Minh Khoa", viTri: "Frontend Developer", capDo: "Mid", donViCungCap: "Liên minh Công nghệ số DTG Group", maDDH: "DDH.04", trangThai: "Đang làm việc" },
  { id: "NS025", cccd: "037013561595", hoTen: "Phạm Thanh Trang", viTri: "Business Analyst", capDo: "Mid", donViCungCap: "Công ty CP Nhân sự HR Solutions", maDDH: "DDH.09", trangThai: "Đang làm việc" },
  { id: "NS026", cccd: "060002366299", hoTen: "Đinh Văn Long", viTri: "Business Analyst", capDo: "Junior", donViCungCap: "Công ty TNHH Giải pháp Doanh nghiệp Số EnterSoft", maDDH: "DDH.18", trangThai: "Đang chờ phân bổ" },
  { id: "NS027", cccd: "048015777387", hoTen: "Huỳnh Ngọc Mai", viTri: "QA Engineer", capDo: "Mid", donViCungCap: "Công ty Logistics Thần Tốc", maDDH: "DDH.05", trangThai: "Đang làm việc" },
  { id: "NS028", cccd: "020023433200", hoTen: "Lý Hữu Sơn", viTri: "DevOps Engineer", capDo: "Senior", donViCungCap: "Công ty CP Tư vấn Quản trị Nhân lực Á Châu", maDDH: "DDH.13", trangThai: "Đang làm việc" },
  { id: "NS029", cccd: "096996320163", hoTen: "Trịnh Xuân Bình", viTri: "QA Engineer", capDo: "Junior", donViCungCap: "Công ty TNHH Vận hành Hệ thống CNTT Nam Á", maDDH: "DDH.20", trangThai: "Đang chờ phân bổ" },
  { id: "NS030", cccd: "001977889579", hoTen: "Trịnh Diễm Vân", viTri: "Data Analyst", capDo: "Senior", donViCungCap: "Tập đoàn Tư vấn Nhân sự Global Elite", maDDH: "DDH.02", trangThai: "Đang chờ phân bổ" },
  { id: "NS031", cccd: "022994348734", hoTen: "Đặng Minh Khoa", viTri: "UI/UX Designer", capDo: "Junior", donViCungCap: "Tập đoàn Tư vấn Nhân sự Global Elite", maDDH: "DDH.02", trangThai: "Đang làm việc" },
  { id: "NS032", cccd: "030973623166", hoTen: "Dương Công Bình", viTri: "Tester", capDo: "Senior", donViCungCap: "Công ty TNHH Vận hành Hệ thống CNTT Nam Á", maDDH: "DDH.20", trangThai: "Đang làm việc" },
  { id: "NS033", cccd: "079010967054", hoTen: "Ngô Hồng Thanh", viTri: "Tester", capDo: "Junior", donViCungCap: "Công ty CP Dịch vụ Nhân lực Việt Thành", maDDH: "DDH.06", trangThai: "Đang làm việc" },
  { id: "NS034", cccd: "096986272980", hoTen: "Đào Thị Chi", viTri: "Project Manager", capDo: "Mid", donViCungCap: "Liên minh Công nghệ số DTG Group", maDDH: "DDH.04", trangThai: "Đang chờ phân bổ" },
  { id: "NS035", cccd: "037964653755", hoTen: "Hồ Thanh Quỳnh", viTri: "Business Analyst", capDo: "Senior", donViCungCap: "Công ty CP Nhân lực Chất lượng cao HiTalent", maDDH: "DDH.17", trangThai: "Đang làm việc" },
  { id: "NS036", cccd: "037965310033", hoTen: "Chu Thu Lan", viTri: "Mobile Developer", capDo: "Mid", donViCungCap: "Công ty CP Nhân sự HR Solutions", maDDH: "DDH.09", trangThai: "Đang làm việc" },
  { id: "NS037", cccd: "038994529912", hoTen: "Phạm Thị Mai", viTri: "System Admin", capDo: "Mid", donViCungCap: "Công ty TNHH Giải pháp Điện toán Đám mây SkyNet", maDDH: "DDH.12", trangThai: "Ngừng hợp tác" },
  { id: "NS038", cccd: "096013193149", hoTen: "Đào Thị Nhi", viTri: "QA Engineer", capDo: "Mid", donViCungCap: "Công ty Logistics Thần Tốc", maDDH: "DDH.05", trangThai: "Đang làm việc" },
  { id: "NS039", cccd: "079015067165", hoTen: "Dương Thu Quỳnh", viTri: "Mobile Developer", capDo: "Mid", donViCungCap: "Công ty TNHH Giải pháp Phần mềm ABC Việt Nam", maDDH: "DDH.01", trangThai: "Ngừng hợp tác" },
  { id: "NS040", cccd: "048008776945", hoTen: "Lê Thanh Thảo", viTri: "Tester", capDo: "Senior", donViCungCap: "Tập đoàn Giải pháp Số VietSoft", maDDH: "DDH.08", trangThai: "Đang làm việc" },
  { id: "NS041", cccd: "096980752735", hoTen: "Bùi Thanh Xuân", viTri: "Fullstack Developer", capDo: "Senior", donViCungCap: "Công ty TNHH Dịch vụ IT Toàn Phát", maDDH: "DDH.16", trangThai: "Đang làm việc" },
  { id: "NS042", cccd: "079971367837", hoTen: "Lý Mỹ Anh", viTri: "Backend Developer", capDo: "Junior", donViCungCap: "Công ty CP Tư vấn Quản trị Nhân lực Á Châu", maDDH: "DDH.13", trangThai: "Đang làm việc" },
  { id: "NS043", cccd: "042989578856", hoTen: "Đinh Kim Nhi", viTri: "Fullstack Developer", capDo: "Mid", donViCungCap: "Công ty CP Dịch vụ Nhân lực Việt Thành", maDDH: "DDH.06", trangThai: "Đang làm việc" },
  { id: "NS044", cccd: "042963518233", hoTen: "Võ Thanh Dung", viTri: "Tester", capDo: "Junior", donViCungCap: "Công ty TNHH Giải pháp Điện toán Đám mây SkyNet", maDDH: "DDH.12", trangThai: "Đang làm việc" },
  { id: "NS045", cccd: "060968240084", hoTen: "Hoàng Mỹ Dung", viTri: "Frontend Developer", capDo: "Mid", donViCungCap: "Công ty CP Công nghệ Sáng Tạo Việt", maDDH: "DDH.15", trangThai: "Đang làm việc" },
  { id: "NS046", cccd: "001982047116", hoTen: "Đào Văn Đức", viTri: "Mobile Developer", capDo: "Senior", donViCungCap: "Công ty CP Thiết kế và Xây dựng Kỹ thuật số", maDDH: "DDH.19", trangThai: "Ngừng hợp tác" },
  { id: "NS047", cccd: "020971869993", hoTen: "Hồ Mỹ Thảo", viTri: "Business Analyst", capDo: "Senior", donViCungCap: "Công ty TNHH Giải pháp Doanh nghiệp Số EnterSoft", maDDH: "DDH.18", trangThai: "Ngừng hợp tác" },
  { id: "NS048", cccd: "060009091334", hoTen: "Huỳnh Hồng Hà", viTri: "QA Engineer", capDo: "Junior", donViCungCap: "Công ty CP Thiết kế và Xây dựng Kỹ thuật số", maDDH: "DDH.19", trangThai: "Đang làm việc" },
  { id: "NS049", cccd: "001019740344", hoTen: "Dương Ngọc Lan", viTri: "Business Analyst", capDo: "Senior", donViCungCap: "Công ty Logistics Thần Tốc", maDDH: "DDH.05", trangThai: "Đang làm việc" },
  { id: "NS050", cccd: "038991832421", hoTen: "Đặng Quốc Sơn", viTri: "Backend Developer", capDo: "Mid", donViCungCap: "Công ty CP Công nghệ Sáng Tạo Việt", maDDH: "DDH.15", trangThai: "Đang làm việc" },
];