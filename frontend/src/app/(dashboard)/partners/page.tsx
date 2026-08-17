import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Select,
  Input,
  Table,
  Tag,
  Button,
  Dropdown,
  Modal,
  message,
  Typography,
  Space,
  Collapse,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { partnerApi } from "../../../services/partnerApi";
import type { Partner } from "../../../types/partner";

const STATUS_OPTIONS = [
  { value: "Đang hợp tác", label: "Đang hợp tác" },
  { value: "Ngưng hợp tác", label: "Ngưng hợp tác" },
  { value: "Chưa hợp tác", label: "Chưa hợp tác" },
];

const STATUS_COLOR: Record<Partner["trangThai"], string> = {
  "Đang hợp tác": "green",
  "Ngưng hợp tác": "red",
  "Chưa hợp tác": "blue",
};

export default function PartnersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");

  const [allPartners, setAllPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);

  const [tenCongTyInput, setTenCongTyInput] = useState("");
  const [tenVietTatInput, setTenVietTatInput] = useState("");
  const [maSoThueInput, setMaSoThueInput] = useState("");
  const [filter, setFilter] = useState({
    tenCongTy: "",
    tenVietTat: "",
    maSoThue: "",
    trangThai: undefined as string | undefined,
  });

  const [pendingDelete, setPendingDelete] = useState<Partner | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const data = await partnerApi.getAll();
      setAllPartners(data);
    } catch {
      message.error("Không tải được danh sách đối tác");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  const setPage = (p: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
  };

  const filteredPartners = useMemo(() => {
    return allPartners.filter((p) => {
      if (filter.tenCongTy && !p.tenCongTy.toLowerCase().includes(filter.tenCongTy.toLowerCase())) return false;
      if (filter.tenVietTat && !p.tenVietTat.toLowerCase().includes(filter.tenVietTat.toLowerCase())) return false;
      if (filter.maSoThue && !p.maSoThue.includes(filter.maSoThue)) return false;
      if (filter.trangThai && p.trangThai !== filter.trangThai) return false;
      return true;
    });
  }, [allPartners, filter]);

  const resetFilters = () => {
    setTenCongTyInput("");
    setTenVietTatInput("");
    setMaSoThueInput("");
    setFilter({ tenCongTy: "", tenVietTat: "", maSoThue: "", trangThai: undefined });
    setPage(1);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await partnerApi.remove(pendingDelete.maSoThue);
      message.success("Xóa đối tác thành công");
      setPendingDelete(null);
      fetchPartners();
    } catch {
      message.error("Xóa đối tác thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const columns: ColumnsType<Partner> = [
    {
      title: "Mã số thuế",
      dataIndex: "maSoThue",
      key: "maSoThue",
      fixed: "left",
      render: (value: string) => (
        <Link to={`/dashboard/doi-tac/${value}`} style={{ color: "#005F36", fontWeight: 600 }}>
          {value}
        </Link>
      ),
    },
    { title: "Tên công ty", dataIndex: "tenCongTy", key: "tenCongTy", width: 220 },
    { title: "Tên viết tắt", dataIndex: "tenVietTat", key: "tenVietTat" },
    { title: "Địa chỉ", dataIndex: "diaChi", key: "diaChi", width: 260 },
    { title: "Số điện thoại", dataIndex: "soDienThoai", key: "soDienThoai" },
    {
      title: "Trạng thái hợp tác",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (status: Partner["trangThai"]) => <Tag color={STATUS_COLOR[status]}>{status}</Tag>,
    },
    { title: "Người tạo", dataIndex: "nguoiTao", key: "nguoiTao" },
    { title: "Thời điểm tạo", dataIndex: "thoiDiemTao", key: "thoiDiemTao" },
    { title: "Người cập nhật", dataIndex: "nguoiCapNhat", key: "nguoiCapNhat" },
    { title: "Thời điểm cập nhật", dataIndex: "thoiDiemCapNhat", key: "thoiDiemCapNhat" },
    {
      title: "",
      key: "actions",
      fixed: "right",
      width: 60,
      render: (_, record) => {
        const items: MenuProps["items"] = [
          {
            key: "edit",
            label: "Chỉnh sửa",
            icon: <EditOutlined />,
            onClick: () => navigate(`/dashboard/doi-tac/${record.maSoThue}?edit=true`),
          },
          { type: "divider" },
          {
            key: "delete",
            label: "Xóa",
            icon: <DeleteOutlined />,
            danger: true,
            onClick: () => setPendingDelete(record),
          },
        ];
        return (
          <Dropdown menu={{ items }} trigger={["click"]} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined style={{ fontSize: 18 }} />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <>
      <Modal
        open={pendingDelete !== null}
        onCancel={() => setPendingDelete(null)}
        onOk={handleDelete}
        okText="Xóa"
        okButtonProps={{ danger: true, loading: deleting }}
        cancelText="Hủy"
        title="Xác nhận xóa"
      >
        Bạn có chắc muốn xóa đối tác <strong>{pendingDelete?.tenCongTy}</strong> không? Hành động
        này không thể hoàn tác.
      </Modal>

      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Quản lý đối tác
          </Typography.Title>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchPartners}>
              Làm mới
            </Button>
            <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
            <Link to="/dashboard/doi-tac/tao-moi">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: "#22C55E", borderColor: "#22C55E" }}
              >
                Thêm mới
              </Button>
            </Link>
          </Space>
        </div>

        <Card>
          <Collapse
            defaultActiveKey={["1"]}
            items={[
              {
                key: "1",
                label: (
                  <span style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600 }}>
                    <FilterOutlined style={{ color: "#22C55E" }} />
                    Bộ lọc tìm kiếm
                  </span>
                ),
                children: (
                  <>
                    <Row gutter={[16, 16]}>
                      <Col xs={24} md={12} lg={6}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Tên công ty</div>
                        <Input
                          placeholder="Nhập tên công ty..."
                          value={tenCongTyInput}
                          onChange={(e) => {
                            setTenCongTyInput(e.target.value);
                            setFilter((prev) => ({ ...prev, tenCongTy: e.target.value }));
                            setPage(1);
                          }}
                          allowClear
                        />
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Tên viết tắt</div>
                        <Input
                          placeholder="Nhập tên viết tắt..."
                          value={tenVietTatInput}
                          onChange={(e) => {
                            setTenVietTatInput(e.target.value);
                            setFilter((prev) => ({ ...prev, tenVietTat: e.target.value }));
                            setPage(1);
                          }}
                          allowClear
                        />
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Mã số thuế</div>
                        <Input
                          placeholder="Nhập mã số thuế..."
                          value={maSoThueInput}
                          onChange={(e) => {
                            setMaSoThueInput(e.target.value);
                            setFilter((prev) => ({ ...prev, maSoThue: e.target.value }));
                            setPage(1);
                          }}
                          allowClear
                        />
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Trạng thái hợp tác</div>
                        <Select
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Tất cả trạng thái"
                          value={filter.trangThai}
                          onChange={(v) => {
                            setFilter((prev) => ({ ...prev, trangThai: v }));
                            setPage(1);
                          }}
                          options={STATUS_OPTIONS}
                        />
                      </Col>
                    </Row>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                      <Button onClick={resetFilters}>Đặt lại</Button>
                    </div>
                  </>
                ),
              },
            ]}
          />
        </Card>

        <Card styles={{ body: { padding: 0 } }}>
          <Table<Partner>
            rowKey="maSoThue"
            columns={columns}
            dataSource={filteredPartners}
            loading={loading}
            scroll={{ x: 1600 }}
            pagination={{
              current: page,
              pageSize,
              total: filteredPartners.length,
              showSizeChanger: true,
              showTotal: (total) => (
                <span style={{ color: "#6b7280", fontSize: 13 }}>
                  Hiển thị {pageSize} trong số {total} bản ghi
                </span>
              ),
              onChange: (p, s) => {
                if (s !== pageSize) {
                  setSearchParams((prev) => {
                    prev.set("pageSize", String(s));
                    prev.set("page", "1");
                    return prev;
                  });
                } else {
                  setPage(p);
                }
              },
            }}
          />
        </Card>
      </Space>
    </>
  );
}