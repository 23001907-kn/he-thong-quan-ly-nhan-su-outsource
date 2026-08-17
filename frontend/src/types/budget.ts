export interface Budget {
  maNganSach: string;
  loai: string;
  dauMoi: string;
  soQD: string;
  ngayPheDuyet: string;
  giaTri: number;
  daSuDung: number;
  conLai: number;
  thoiGianThucHienTu: string;
  thoiGianThucHienDen: string;
  trangThai: "Hiệu lực" | "Hết hiệu lực";
}