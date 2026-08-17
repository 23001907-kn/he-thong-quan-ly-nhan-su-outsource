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
  FileExcelOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { orderApi } from "../../../services/orderApi";
import type { Order } from "../../../types/order";

const STATUS_OPTIONS = [
  { value: "Hiệu lực", label: "Hiệu lực" },
  { value: "Bản nháp", label: "Bản nháp" },
  { value: "Hết hiệu lực", label: "Hết hiệu lực" },
];

const STATUS_COLOR: Record<Order["tinhTrang"], string> = {
  "Hiệu lực": "green",
  "Bản nháp": "default",
  "Hết hiệu lực": "red",
};

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN");
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [maDDHInput, setMaDDHInput] = useState("");
  const [maNganSachInput, setMaNganSachInput] = useState("");
  const [tenDoiTacInput, setTenDoiTacInput] = useState("");
  const [filter, setFilter] = useState({
    maDDH: "",
    maNganSach: "",
    tenDoiTac: "",
    tinhTrang: undefined as string | undefined,
  });

  const [pendingDelete, setPendingDelete] = useState<Order | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderApi.getAll();
      setAllOrders(data);
    } catch {
      message.error("Không tải được danh sách đơn đặt hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const setPage = (p: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
  };

  const filteredOrders = useMemo(() => {
    return allOrders.filter((o) => {
      if (filter.maDDH && !o.id.toLowerCase().includes(filter.maDDH.toLowerCase())) return false;
      if (filter.maNganSach && !o.maNganSach.toLowerCase().includes(filter.maNganSach.toLowerCase())) return false;
      if (filter.tenDoiTac && !o.tenDoiTac.toLowerCase().includes(filter.tenDoiTac.toLowerCase())) return false;
      if (filter.tinhTrang && o.tinhTrang !== filter.tinhTrang) return false;
      return true;
    });
  }, [allOrders, filter]);

  const resetFilters = () => {
    setMaDDHInput("");
    setMaNganSachInput("");
    setTenDoiTacInput("");
    setFilter({ maDDH: "", maNganSach: "", tenDoiTac: "", tinhTrang: undefined });
    setPage(1);
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await orderApi.remove(pendingDelete.id);
      message.success("Xóa đơn đặt hàng thành công");
      setPendingDelete(null);
      fetchOrders();
    } catch {
      message.error("Xóa đơn đặt hàng thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const stats = useMemo(() => {
    return {
      total: allOrders.length,
      hieuLuc: allOrders.filter((o) => o.tinhTrang === "Hiệu lực").length,
      banNhap: allOrders.filter((o) => o.tinhTrang === "Bản nháp").length,
      hetHieuLuc: allOrders.filter((o) => o.tinhTrang === "Hết hiệu lực").length,
    };
  }, [allOrders]);

  const columns: ColumnsType<Order> = [
    {
      title: "Mã DDH",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (value: string) => (
        <Link to={`/dashboard/don-dat-hang/${value.split("/")[0]}`} style={{ color: "#005F36", fontWeight: 600 }}>
          {value}
        </Link>
      ),
    },
    { title: "Tên đối tác", dataIndex: "tenDoiTac", key: "tenDoiTac", width: 240 },
    { title: "Mã ngân sách", dataIndex: "maNganSach", key: "maNganSach" },
    {
      title: "Giá trị DDH (VNĐ)",
      dataIndex: "giaTri",
      key: "giaTri",
      align: "right",
      render: (v: number) => <strong>{formatCurrency(v)}</strong>,
    },
    {
      title: "Tình trạng",
      dataIndex: "tinhTrang",
      key: "tinhTrang",
      render: (status: Order["tinhTrang"]) => <Tag color={STATUS_COLOR[status]}>{status}</Tag>,
    },
    { title: "Người tạo", dataIndex: "nguoiTao", key: "nguoiTao" },
    { title: "Thời điểm tạo", dataIndex: "thoiDiemTao", key: "thoiDiemTao" },
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
            onClick: () => navigate(`/dashboard/don-dat-hang/${record.id.split("/")[0]}?edit=true`),
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
        Bạn có chắc muốn xóa đơn đặt hàng <strong>{pendingDelete?.id}</strong> không? Hành động
        này không thể hoàn tác.
      </Modal>

      <Space orientation="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Quản lý đơn đặt hàng
          </Typography.Title>
          <Space>
            <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
            <Link to="/dashboard/don-dat-hang/tao-moi">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: "#22C55E", borderColor: "#22C55E" }}
              >
                Tạo DDH mới
              </Button>
            </Link>
          </Space>
        </div>

        <Row gutter={16}>
          <Col xs={12} md={6}>
            <Card>
              <Space>
                <FileTextOutlined style={{ fontSize: 20, color: "#0B3D1F" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Tổng số Đơn hàng</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.total}</div>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Space>
                <CheckCircleOutlined style={{ fontSize: 20, color: "#16a34a" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Đang hiệu lực</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.hieuLuc}</div>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Space>
                <ClockCircleOutlined style={{ fontSize: 20, color: "#f59e0b" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Bản nháp</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.banNhap}</div>
                </div>
              </Space>
            </Card>
          </Col>
          <Col xs={12} md={6}>
            <Card>
              <Space>
                <CloseCircleOutlined style={{ fontSize: 20, color: "#ef4444" }} />
                <div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Hết hiệu lực</div>
                  <div style={{ fontSize: 20, fontWeight: 700 }}>{stats.hetHieuLuc}</div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

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
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Mã DDH</div>
                        <Input
                          placeholder="Nhập mã DDH..."
                          value={maDDHInput}
                          onChange={(e) => {
                            setMaDDHInput(e.target.value);
                            setFilter((prev) => ({ ...prev, maDDH: e.target.value }));
                            setPage(1);
                          }}
                          allowClear
                        />
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Mã ngân sách</div>
                        <Input
                          placeholder="VD: NSC.01-2026-CNTT"
                          value={maNganSachInput}
                          onChange={(e) => {
                            setMaNganSachInput(e.target.value);
                            setFilter((prev) => ({ ...prev, maNganSach: e.target.value }));
                            setPage(1);
                          }}
                          allowClear
                        />
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Tình trạng</div>
                        <Select
                          allowClear
                          style={{ width: "100%" }}
                          placeholder="Chọn tình trạng"
                          value={filter.tinhTrang}
                          onChange={(v) => {
                            setFilter((prev) => ({ ...prev, tinhTrang: v }));
                            setPage(1);
                          }}
                          options={STATUS_OPTIONS}
                        />
                      </Col>
                      <Col xs={24} md={12} lg={6}>
                        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>Tên đối tác</div>
                        <Input
                          placeholder="Nhập tên đối tác..."
                          value={tenDoiTacInput}
                          onChange={(e) => {
                            setTenDoiTacInput(e.target.value);
                            setFilter((prev) => ({ ...prev, tenDoiTac: e.target.value }));
                            setPage(1);
                          }}
                          allowClear
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
          <Typography.Title level={5} style={{ padding: "16px 16px 0" }}>
            Danh sách đơn đặt hàng
          </Typography.Title>
          <Table<Order>
            rowKey="id"
            columns={columns}
            dataSource={filteredOrders}
            loading={loading}
            scroll={{ x: 1200 }}
            pagination={{
              current: page,
              pageSize,
              total: filteredOrders.length,
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