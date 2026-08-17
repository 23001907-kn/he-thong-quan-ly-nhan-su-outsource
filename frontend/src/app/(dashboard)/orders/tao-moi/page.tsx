import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Typography,
  Space,
  message,
  Breadcrumb,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { orderApi } from "../../../../services/orderApi";
import { budgetApi } from "../../../../services/budgetApi";
import type { Order } from "../../../../types/order";
import type { Budget } from "../../../../types/budget";

const STATUS_OPTIONS = [
  { value: "Bản nháp", label: "Bản nháp" },
  { value: "Hiệu lực", label: "Hiệu lực" },
];

type FormValues = {
  id: string;
  tenDoiTac: string;
  maNganSach: string;
  giaTri: number;
  tinhTrang: string;
};

export default function OrdersCreate() {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loadingBudgets, setLoadingBudgets] = useState(true);

  useEffect(() => {
    budgetApi
      .getAll()
      .then(setBudgets)
      .catch(() => message.error("Không tải được danh sách ngân sách"))
      .finally(() => setLoadingBudgets(false));
  }, []);

  const handleSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const now = dayjs().format("DD/MM/YYYY HH:mm");
      const newOrder: Order = {
        id: values.id,
        tenDoiTac: values.tenDoiTac,
        maNganSach: values.maNganSach,
        giaTri: values.giaTri,
        tinhTrang: values.tinhTrang as Order["tinhTrang"],
        nguoiTao: "Test SUPERADMIN",
        thoiDiemTao: now,
      };

      await orderApi.create(newOrder);
      message.success("Tạo đơn đặt hàng thành công");
      navigate(`/dashboard/don-dat-hang/${values.id}`);
    } catch {
      message.error("Tạo đơn đặt hàng thất bại — mã DDH có thể đã tồn tại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <Breadcrumb
        items={[
          { title: <Link to="/dashboard/don-dat-hang">Quản lý đơn đặt hàng</Link> },
          { title: "Tạo DDH mới" },
        ]}
      />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          Tạo DDH mới
        </Typography.Title>
      </div>

      <Card>
        <Form<FormValues>
          form={form}
          layout="vertical"
          disabled={saving}
          initialValues={{ tinhTrang: "Bản nháp" }}
          onFinish={handleSubmit}
        >
          <Typography.Title level={5}>Thông tin chung</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="id"
                label="Mã DDH"
                rules={[{ required: true, message: "Vui lòng nhập mã DDH" }]}
              >
                <Input placeholder="VD: DDH.21/NSC.01/VMO-AQT" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="maNganSach"
                label="Mã ngân sách"
                rules={[{ required: true, message: "Vui lòng chọn mã ngân sách" }]}
              >
                <Select
                  placeholder="Chọn mã ngân sách"
                  loading={loadingBudgets}
                  showSearch
                  optionFilterProp="label"
                  options={budgets.map((b) => ({ value: b.maNganSach, label: b.maNganSach }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="tinhTrang"
                label="Tình trạng"
                rules={[{ required: true, message: "Vui lòng chọn tình trạng" }]}
              >
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="tenDoiTac"
                label="Tên đối tác"
                rules={[{ required: true, message: "Vui lòng nhập tên đối tác" }]}
              >
                <Input placeholder="Nhập tên đối tác" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="giaTri"
                label="Giá trị DDH (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá trị DDH" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập giá trị đơn đặt hàng"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button onClick={() => navigate("/dashboard/don-dat-hang")} disabled={saving}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              htmlType="submit"
              loading={saving}
              style={{ background: "#22C55E", borderColor: "#22C55E" }}
            >
              Lưu đơn đặt hàng
            </Button>
          </div>
        </Form>
      </Card>
    </Space>
  );
}