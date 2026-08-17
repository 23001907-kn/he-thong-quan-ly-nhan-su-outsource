import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Form,
  Input,
  Select,
  Button,
  Typography,
  message,
  Row,
  Col,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import { createEmployee } from "../../../../services/employeeApi";
import type { Employee } from "../../../../types/employee";

const CAP_DO_OPTIONS = [
  { value: "Junior", label: "Junior" },
  { value: "Mid", label: "Mid" },
  { value: "Senior", label: "Senior" },
];

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<Employee>();
  const [saving, setSaving] = useState(false);

  const handleCancel = () => {
    navigate("/dashboard/nhan-su");
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSaving(true);
      const newEmployee: Employee = {
        ...values,
        id: `NS-${Date.now()}`,
        trangThai: "Đang chờ phân bổ",
      };
      await createEmployee(newEmployee);
      message.success("Tạo mới nhân sự thành công");
      navigate("/dashboard/nhan-su");
    } catch {
      message.error("Tạo mới nhân sự thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Typography.Title level={4} style={{ marginBottom: 24 }}>
        Tạo mới nhân sự
      </Typography.Title>

      <Card>
        <Form form={form} layout="vertical">
          <Typography.Title level={5} style={{ marginBottom: 16 }}>
            Thông tin định danh
          </Typography.Title>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Số CCCD"
                name="cccd"
                rules={[
                  { required: true, message: "Vui lòng nhập số CCCD" },
                  { pattern: /^\d{12}$/, message: "Số CCCD phải gồm 12 chữ số" },
                ]}
              >
                <Input placeholder="VD: 001201099887" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Họ và tên"
                name="hoTen"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input placeholder="Nhập họ và tên" />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5} style={{ margin: "24px 0 16px" }}>
            Thông tin công việc
          </Typography.Title>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Form.Item
                label="Vị trí"
                name="viTri"
                rules={[{ required: true, message: "Vui lòng nhập vị trí" }]}
              >
                <Input placeholder="VD: Frontend Developer" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                label="Cấp độ"
                name="capDo"
                rules={[{ required: true, message: "Vui lòng chọn cấp độ" }]}
              >
                <Select placeholder="Chọn cấp độ" options={CAP_DO_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item label="Trạng thái ban đầu">
                <Input value="Đang chờ phân bổ" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5} style={{ margin: "24px 0 16px" }}>
            Liên kết đơn hàng
          </Typography.Title>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Đơn vị cung cấp"
                name="donViCungCap"
                rules={[{ required: true, message: "Vui lòng nhập đơn vị cung cấp" }]}
              >
                <Input placeholder="Nhập tên đơn vị cung cấp / đối tác" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Mã DDH" name="maDDH">
                <Input placeholder="VD: DDH.01 (để trống nếu chưa phân bổ)" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <Button onClick={handleCancel}>Hủy bỏ</Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              loading={saving}
              onClick={handleSubmit}
              style={{ background: "#22C55E", borderColor: "#22C55E" }}
            >
              Lưu nhân sự
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}