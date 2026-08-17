import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Table,
  Tag,
  Button,
  Modal,
  message,
  Typography,
  Space,
  Dropdown,
  Tabs,
} from "antd";
import type { MenuProps } from "antd";
import type { TabsProps } from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  FileExcelOutlined,
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { getEmployees, deleteEmployee } from "../../../services/employeeApi";
import type { Employee } from "../../../types/employee";

type TabKey = "cccd" | "ddh" | "doitac";

export default function EmployeePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || "1");
  const pageSize = Number(searchParams.get("pageSize") || "10");

  const [activeTab, setActiveTab] = useState<TabKey>("cccd");
  const [searchText, setSearchText] = useState("");

  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const [pendingDelete, setPendingDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const data = await getEmployees();
      setAllEmployees(data);
    } catch {
      message.error("Không tải được danh sách nhân sự");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const setPage = (p: number) => {
    setSearchParams((prev) => {
      prev.set("page", String(p));
      return prev;
    });
  };

  const searchPlaceholder: Record<TabKey, string> = {
    cccd: "Tìm kiếm theo số CCCD hoặc họ tên...",
    ddh: "Tìm kiếm theo mã DDH hoặc tên đơn hàng...",
    doitac: "Tìm kiếm theo tên đối tác / đơn vị cung cấp...",
  };

  // Lọc dữ liệu ở client theo tab đang chọn (backend hiện chưa hỗ trợ query filter)
  const filteredEmployees = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return allEmployees;

    return allEmployees.filter((e) => {
      if (activeTab === "cccd") {
        return (
          e.cccd.toLowerCase().includes(keyword) ||
          e.hoTen.toLowerCase().includes(keyword)
        );
      }
      if (activeTab === "ddh") {
        return e.maDDH.toLowerCase().includes(keyword);
      }
      // doitac
      return e.donViCungCap.toLowerCase().includes(keyword);
    });
  }, [allEmployees, searchText, activeTab]);

  const handleDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteEmployee(pendingDelete.cccd);
      message.success("Xóa nhân sự thành công");
      setPendingDelete(null);
      fetchEmployees();
    } catch {
      message.error("Xóa nhân sự thất bại");
    } finally {
      setDeleting(false);
    }
  };

  const capDoColor: Record<Employee["capDo"], string> = {
    Junior: "blue",
    Mid: "gold",
    Senior: "purple",
  };

  const trangThaiColor: Record<Employee["trangThai"], string> = {
    "Đang làm việc": "green",
    "Đang chờ phân bổ": "orange",
    "Ngừng hợp tác": "red",
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Số CCCD",
      dataIndex: "cccd",
      key: "cccd",
      fixed: "left",
      render: (value: string, record) => (
        <Link
          to={`/dashboard/nhan-su/${value}`}
          style={{ color: "#339966", fontWeight: 600 }}
        >
          {record.hoTen ? value : value}
        </Link>
      ),
    },
    { title: "Họ và tên", dataIndex: "hoTen", key: "hoTen" },
    { title: "Vị trí", dataIndex: "viTri", key: "viTri" },
    {
      title: "Cấp độ",
      dataIndex: "capDo",
      key: "capDo",
      render: (capDo: Employee["capDo"]) => (
        <Tag color={capDoColor[capDo]}>{capDo}</Tag>
      ),
    },
    { title: "Đơn vị cung cấp", dataIndex: "donViCungCap", key: "donViCungCap" },
    { title: "Mã DDH", dataIndex: "maDDH", key: "maDDH" },
    {
      title: "Trạng thái",
      dataIndex: "trangThai",
      key: "trangThai",
      render: (status: Employee["trangThai"]) => (
        <Tag color={trangThaiColor[status]}>{status}</Tag>
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
            onClick: () => navigate(`/dashboard/nhan-su/${record.cccd}?edit=true`),
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

  const tabItems: TabsProps["items"] = [
    { key: "cccd", label: "Theo CCCD" },
    { key: "ddh", label: "Theo DDH" },
    { key: "doitac", label: "Theo Đối tác" },
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
        Bạn có chắc muốn xóa nhân sự <strong>{pendingDelete?.hoTen}</strong> (CCCD:{" "}
        {pendingDelete?.cccd}) không? Hành động này không thể hoàn tác.
      </Modal>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography.Title level={4} style={{ margin: 0 }}>
            Quản lý nhân sự outsource
          </Typography.Title>
          <Space>
            <Button icon={<FileExcelOutlined />}>Xuất Excel</Button>
            <Link to="/dashboard/nhan-su/tao-moi">
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
          <Tabs
            activeKey={activeTab}
            items={tabItems}
            onChange={(key) => {
              setActiveTab(key as TabKey);
              setSearchText("");
              setPage(1);
            }}
          />

          <Input.Search
            placeholder={searchPlaceholder[activeTab]}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(1);
            }}
            allowClear
            style={{ marginTop: 8 }}
          />
        </Card>

        <Card styles={{ body: { padding: 0 } }}>
          <Table<Employee>
            rowKey="cccd"
            columns={columns}
            dataSource={filteredEmployees}
            loading={loading}
            scroll={{ x: 1200 }}
            pagination={{
              current: page,
              pageSize,
              total: filteredEmployees.length,
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