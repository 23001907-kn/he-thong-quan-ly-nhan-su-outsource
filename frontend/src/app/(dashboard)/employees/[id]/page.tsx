import { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Space,
  Typography,
  Tag,
  message,
  Skeleton,
  Row,
  Col,
} from "antd";
import { ArrowLeftOutlined, EditOutlined, SaveOutlined, CloseOutlined } from "@ant-design/icons";
import { getEmployeeByCccd, updateEmployee } from "../../../../services/employeeApi";
import type { Employee } from "../../../../types/employee";

const CAP_DO_OPTIONS = [
  { value: "Junior", label: "Junior" },
  { value: "Mid", label: "Mid" },
  { value: "Senior", label: "Senior" },
];

const TRANG_THAI_OPTIONS = [
  { value: "Đang làm việc", label: "Đang làm việc" },
  { value: "Đang chờ phân bổ", label: "Đang chờ phân bổ" },
  { value: "Ngừng hợp tác", label: "Ngừng hợp tác" },
];

const trangThaiColor: Record<Employee["trangThai"], string> = {
  "Đang làm việc": "green",
  "Đang chờ phân bổ": "orange",
  "Ngừng hợp tác": "red",
};

const metaLabelStyle: React.CSSProperties = {
  fontSize: 12,
  color: "rgba(0,0,0,0.45)",
  marginBottom: 4,
};

export default function EmployeeDetail() {
  const { cccd } = useParams<{ cccd: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [form] = Form.useForm<Employee>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchEmployee = async () => {
    if (!cccd) return;
    setLoading(true);
    try {
      const data = await getEmployeeByCccd(cccd);
      setEmployee(data);
      form.setFieldsValue(data);
    } catch {
      message.error("Không tìm thấy nhân sự");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployee();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cccd]);

  const enterEdit = () => {
    setSearchParams((prev) => {
      prev.set("edit", "true");
      return prev;
    });
  };

  const cancelEdit = () => {
    if (employee) form.setFieldsValue(employee);
    setSearchParams((prev) => {
      prev.delete("edit");
      return prev;
    });
  };

  const handleSave = async () => {
    if (!cccd) return;
    try {
      const values = await form.validateFields();
      setSaving(true);
      const updated = await updateEmployee(cccd, values);
      setEmployee(updated);
      message.success("Cập nhật nhân sự thành công");
      setSearchParams((prev) => {
        prev.delete("edit");
        return prev;
      });
    } catch {
      message.error("Cập nhật nhân sự thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton active />
      </Card>
    );
  }

  if (!employee) {
    return (
      <Card>
        <Typography.Text type="secondary">Không tìm thấy nhân sự.</Typography.Text>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Chi tiết nhân sự — {employee.hoTen}
        </Typography.Title>

        {!isEdit && (
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard/nhan-su")}>
              Quay lại
            </Button>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={enterEdit}
              style={{ background: "#22C55E", borderColor: "#22C55E" }}
            >
              Chỉnh sửa
            </Button>
          </Space>
        )}
      </div>

      <Card>
        {/* Hàng thông tin tóm tắt */}
        <Row gutter={[24, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} md={6}>
            <div style={metaLabelStyle}>Số CCCD</div>
            <Typography.Text strong>{employee.cccd}</Typography.Text>
          </Col>
          <Col xs={12} md={6}>
            <div style={metaLabelStyle}>Trạng thái</div>
            <Tag color={trangThaiColor[employee.trangThai]}>{employee.trangThai}</Tag>
          </Col>
          <Col xs={12} md={6}>
            <div style={metaLabelStyle}>Đơn vị cung cấp</div>
            <Typography.Text>{employee.donViCungCap}</Typography.Text>
          </Col>
          <Col xs={12} md={6}>
            <div style={metaLabelStyle}>Mã DDH</div>
            <Typography.Text>{employee.maDDH}</Typography.Text>
          </Col>
        </Row>

        <Typography.Title level={5} style={{ marginBottom: 16 }}>
          Thông tin chung
        </Typography.Title>

        <Form form={form} layout="vertical" initialValues={employee} disabled={!isEdit}>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ và tên"
                name="hoTen"
                rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Vị trí"
                name="viTri"
                rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
              >
                <Input placeholder="Nhập vị trí công việc" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Cấp độ"
                name="capDo"
                rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
              >
                <Select options={CAP_DO_OPTIONS} placeholder="Chọn cấp độ" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Trạng thái"
                name="trangThai"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
              >
                <Select options={TRANG_THAI_OPTIONS} placeholder="Chọn trạng thái" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Đơn vị cung cấp"
                name="donViCungCap"
                rules={[{ required: true, message: "Vui lòng nhập đơn vị cung cấp" }]}
              >
                <Input placeholder="Nhập đơn vị cung cấp" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Mã DDH" name="maDDH">
                <Input placeholder="Nhập mã đơn đặt hàng liên kết" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {isEdit && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button icon={<CloseOutlined />} onClick={cancelEdit}>
              Hủy
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              loading={saving}
              onClick={handleSave}
              style={{ background: "#22C55E", borderColor: "#22C55E" }}
            >
              Lưu
            </Button>
          </div>
        )}
      </Card>
    </Space>
  );
}