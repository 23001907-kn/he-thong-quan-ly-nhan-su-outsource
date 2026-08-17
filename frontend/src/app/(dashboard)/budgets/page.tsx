import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Input,
  Table,
  Tag,
  Button,
  Modal,
  message,
  Typography,
  Space, 
  Dropdown,
  Collapse
} from "antd";
import type { MenuProps } from "antd";
import { PlusOutlined, ReloadOutlined,
  FileExcelOutlined, DeleteOutlined, EditOutlined, MoreOutlined, EyeOutlined, FilterOutlined, DownOutlined, UpOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { budgetApi } from "../../../services/budgetApi";
import type { Budget } from "../../../types/budget";

const BUDGET_TYPE_OPTIONS = [
  { value: "NSC", label: "NSC" },
  { value: "NSR", label: "NSR" },
];

const FOCAL_POINT_OPTIONS = [
  { value: "CNTT", label: "CNTT" },
  { value: "NV", label: "NV" },
  { value: "DLPT", label: "DLPT" },
];

const STATUS_OPTIONS = [
  { value: "Hiệu lực", label: "Hiệu lực" },
  { value: "Hết hiệu lực", label: "Hết hiệu lực" },
];

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN") + " đ";
}

export default function BudgetListPage() {
  const navigate = useNavigate();
  const [filterExpanded, setFilterExpanded] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");

  const [allBudgets, setAllBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  const [maNganSachInput, setMaNganSachInput] = useState("");
  const [filter, setFilter] = useState({
    maNganSach: "",
    loai: undefined as string | undefined,
    dauMoi: undefined as string | undefined,
    trangThai: undefined as string | undefined,
    namPheDuyet: undefined as number | undefined,
  });

  const [pendingDelete, setPendingDelete] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchBudgets = async () => {
    setLoading(true);
    try {
      const data = await budgetApi.getAll();
      setAllBudgets(data);
    } catch {
      message.error("Không tải được danh sách ngân sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const setPage = (p: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
  };

  // Lọc dữ liệu ở client (vì backend hiện chưa hỗ trợ query filter)
  const filteredBudgets = useMemo(() => {
    return allBudgets.filter((b) => {
      if (filter.maNganSach && !b.maNganSach.toLowerCase().includes(filter.maNganSach.toLowerCase())) {
        return false;
      }
      if (filter.loai && b.loai !== filter.loai) return false;
      if (filter.dauMoi && b.dauMoi !== filter.dauMoi) return false;
      if (filter.trangThai && b.trangThai !== filter.trangThai) return false;
      if (filter.namPheDuyet) {
        const year = dayjs(b.ngayPheDuyet, "DD/MM/YYYY").year();
        if (year !== filter.namPheDuyet) return false;
      }
      return true;
    });
  }, [allBudgets, filter]);

  const activeTagList = [
    ...(filter.maNganSach ? [{ key: "maNganSach" as const, label: filter.maNganSach }] : []),
    ...(filter.loai ? [{ key: "loai" as const, label: filter.loai }] : []),
    ...(filter.dauMoi ? [{ key: "dauMoi" as const, label: filter.dauMoi }] : []),
    ...(filter.trangThai ? [{ key: "trangThai" as const, label: filter.trangThai }] : []),
    ...(filter.namPheDuyet ? [{ key: "namPheDuyet" as const, label: `Năm ${filter.namPheDuyet}` }] : []),
  ];
  const hasActiveFilters = activeTagList.length > 0;

  const removeFilter = (key: keyof typeof filter) => {
    if (key === "maNganSach") setMaNganSachInput("");
    setFilter((prev) => ({ ...prev, [key]: key === "maNganSach" ? "" : undefined }));
    setPage(1);
  };

  const clearAllFilters = () => {
    setMaNganSachInput("");
    setFilter({
      maNganSach: "",
      loai: undefined,
      dauMoi: undefined,
      trangThai: undefined,
      namPheDuyet: undefined,
    });
    setPage(1);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await budgetApi.remove(pendingDelete.maNganSach);
      message.success("Xóa ngân sách thành công");
      setPendingDelete(null);
      fetchBudgets();
    } catch {
      message.error("Xóa ngân sách thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const columns: ColumnsType<Budget> = [
    {
    title: "Mã Ngân sách",
    dataIndex: "maNganSach",
    key: "maNganSach",
    fixed: "left",
    render: (value: string) => (
        <Link
        to={`/dashboard/ngan-sach/${value}`}
        style={{ color: "#339966", fontWeight: 600 }}
        >
        {value}
        </Link>
    ),
    },
    { title: "Loại", dataIndex: "loai", key: "loai" },
    { title: "Đầu mối", dataIndex: "dauMoi", key: "dauMoi" },
    { title: "Số QĐ", dataIndex: "soQD", key: "soQD" },
    { title: "Ngày phê duyệt", dataIndex: "ngayPheDuyet", key: "ngayPheDuyet" },
    {
      title: "Giá trị",
      dataIndex: "giaTri",
      key: "giaTri",
      align: "right",
      render: (v: number) => <strong>{formatCurrency(v)}</strong>,
    },
    {
      title: "Đã sử dụng",
      dataIndex: "daSuDung",
      key: "daSuDung",
      align: "right",
      render: (v: number) => formatCurrency(v),
    },
    {
      title: "Còn lại",
      key: "conLai",
      align: "right",
      render: (_, record) => <strong>{formatCurrency(record.conLai)}</strong>,
    },
    {
      title: "Thời gian thực hiện",
      key: "thoiGianThucHien",
      render: (_, record) => `${record.thoiGianThucHienTu} - ${record.thoiGianThucHienDen}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (status: Budget["trangThai"]) => (
        <Tag color={status === "Hiệu lực" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
    title: "",
    key: "actions",
    fixed: "right",
    width: 60,
    render: (_, record) => {
        const items: MenuProps["items"] = [
        {
            key: "edit",
            icon: <EditOutlined />,
            label: "Chỉnh sửa",
            onClick: () => navigate(`/dashboard/ngan-sach/${record.maNganSach}?edit=true`),
        },
        { type: "divider" },
        {
            key: "delete",
            icon: <DeleteOutlined />,
            label: "Xóa",
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
        Bạn có chắc muốn xóa ngân sách <strong>{pendingDelete?.maNganSach}</strong> không? Hành
        động này không thể hoàn tác.
      </Modal>

      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Quản lý đối tác
          </Typography.Title>
          <Space>
            <Button icon={<ReloadOutlined />} onClick={fetchBudgets}>
              Làm mới
            </Button>
            <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
            <Link to="/dashboard/ngan-sach/tao-moi">
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
                      <Col xs={24} md={12} lg={5}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Mã Ngân sách</div>
                        <Input
                          placeholder="Nhập mã ngân sách..."
                          value={maNganSachInput}
                          onChange={(e) => {
                            setMaNganSachInput(e.target.value);
                            setFilter((prev) => ({ ...prev, maNganSach: e.target.value }));
                            setPage(1);
                          }}
                          allowClear
                        />
                      </Col>
                      <Col xs={24} md={12} lg={5}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Loại ngân sách</div>
                        <Select
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Tất cả loại"
                          value={filter.loai}
                          onChange={(v) => {
                            setFilter((prev) => ({ ...prev, loai: v }));
                            setPage(1);
                          }}
                          options={BUDGET_TYPE_OPTIONS}
                        />
                      </Col>
                      <Col xs={24} md={12} lg={5}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Đầu mối</div>
                        <Select
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Tất cả đơn vị"
                          value={filter.dauMoi}
                          onChange={(v) => {
                            setFilter((prev) => ({ ...prev, dauMoi: v }));
                            setPage(1);
                          }}
                          options={FOCAL_POINT_OPTIONS}
                        />
                      </Col>
                      <Col xs={24} md={12} lg={5}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Trạng thái</div>
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
                      <Col xs={24} md={12} lg={4}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Năm phê duyệt</div>
                        <DatePicker
                          picker="year"
                          style={{ width: "100%" }}
                          value={filter.namPheDuyet ? dayjs().year(filter.namPheDuyet) : null}
                          onChange={(date) => {
                            setFilter((prev) => ({ ...prev, namPheDuyet: date ? date.year() : undefined }));
                            setPage(1);
                          }}
                          allowClear
                        />
                      </Col>
                    </Row>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
                      <Button onClick={clearAllFilters}>Đặt lại</Button>
                    </div>
                  </>
                ),
              },
            ]}
          />
        </Card>

        {hasActiveFilters && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>ĐANG LỌC:</span>
            {activeTagList.map((tag) => (
              <Tag key={tag.key} closable onClose={() => removeFilter(tag.key)}>
                {tag.label}
              </Tag>
            ))}
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", color: "#ff4d4f", fontSize: 12, padding: 0 }}
              onClick={clearAllFilters}
            >
              Xóa tất cả
            </button>
          </div>
        )}

        <Card styles={{ body: { padding: 0 } }}>
          <Table<Budget>
            rowKey="maNganSach"
            columns={columns}
            dataSource={filteredBudgets}
            loading={loading}
            scroll={{ x: 1400 }}
            pagination={{
              current: page,
              pageSize,
              total: filteredBudgets.length,
              showSizeChanger: true,
              showTotal: (t, range) => `${range[0]}-${range[1]} / ${t}`,
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