import { useState } from "react";
import { useNavigate,} from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Typography,
  Space,
  message,

} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { partnerApi } from "../../../../services/partnerApi";
import type { Partner } from "../../../../types/partner";

const STATUS_OPTIONS = [
  { value: "Đang hợp tác", label: "Đang hợp tác" },
  { value: "Ngưng hợp tác", label: "Ngưng hợp tác" },
  { value: "Chưa hợp tác", label: "Chưa hợp tác" },
];

type FormValues = {
  maSoThue: string;
  tenCongTy: string;
  tenVietTat: string;
  diaChi: string;
  soDienThoai: string;
  trangThai: string;
};

export default function PartnersCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const now = dayjs().format("DD/MM/YYYY HH:mm");
      const newPartner: Partner = {
        maSoThue: values.maSoThue,
        tenCongTy: values.tenCongTy,
        tenVietTat: values.tenVietTat,
        diaChi: values.diaChi,
        soDienThoai: values.soDienThoai,
        trangThai: values.trangThai as Partner["trangThai"],
        nguoiTao: "Test SUPERADMIN",
        thoiDiemTao: now,
        nguoiCapNhat: "Test SUPERADMIN",
        thoiDiemCapNhat: now,
      };

      await partnerApi.create(newPartner);
      message.success("Tạo đối tác thành công");
      navigate(`/dashboard/doi-tac/${values.maSoThue}`);
    } catch {
      message.error("Tạo đối tác thất bại — mã số thuế có thể đã tồn tại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Tạo mới đối tác
        </Typography.Title>
      </div>

      <Card>
        <Form<FormValues>
          form={form}
          layout="vertical"
          disabled={saving}
          initialValues={{ trangThai: "Chưa hợp tác" }}
          onFinish={handleSubmit}
        >
          <Typography.Title level={5}>Thông tin chung</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="maSoThue"
                label="Mã số thuế"
                rules={[
                  { required: true, message: "Vui lòng nhập mã số thuế" },
                  { pattern: /^\d{10}$/, message: "Mã số thuế phải gồm 10 chữ số" },
                ]}
              >
                <Input placeholder="VD: 0106056411" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="tenCongTy"
                label="Tên công ty"
                rules={[{ required: true, message: "Vui lòng nhập tên công ty" }]}
              >
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="tenVietTat"
                label="Tên viết tắt"
                rules={[{ required: true, message: "Vui lòng nhập tên viết tắt" }]}
              >
                <Input placeholder="VD: VMO" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item
                name="diaChi"
                label="Địa chỉ"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
              >
                <Input placeholder="Nhập địa chỉ công ty" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="soDienThoai"
                label="Số điện thoại"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
              >
                <Input placeholder="VD: 024.33101103" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="trangThai"
                label="Trạng thái hợp tác"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái hợp tác" }]}
              >
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button onClick={() => navigate("/dashboard/doi-tac")} disabled={saving}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              htmlType="submit"
              loading={saving}
              style={{ background: "#22C55E", borderColor: "#22C55E" }}
            >
              Lưu đối tác
            </Button>
          </div>
        </Form>
      </Card>
    </Space>
  );
}