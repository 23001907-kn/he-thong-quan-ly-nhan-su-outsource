import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  InputNumber,
  Button,
  Tag,
  Skeleton,
  Empty,
  Space,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { orderApi } from "../../../../services/orderApi";
import { budgetApi } from "../../../../services/budgetApi";
import type { Order } from "../../../../types/order";
import type { Budget } from "../../../../types/budget";

const STATUS_OPTIONS = [
  { value: "Bản nháp", label: "Bản nháp" },
  { value: "Hiệu lực", label: "Hiệu lực" },
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

type FormValues = {
  tenDoiTac: string;
  maNganSach: string;
  giaTri: number;
  tinhTrang: string;
};

export default function OrdersDetail() {
  // URL chỉ mang đoạn đầu của id (VD "DDH.01"), vì id đầy đủ chứa dấu "/"
  // (VD "DDH.01/NSC.01/VMO-AQT") không thể đặt thẳng vào 1 route segment.
  // Tìm đúng bản ghi bằng cách so khớp đoạn đầu này với id.split("/")[0].
  const { id: orderKey } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [form] = Form.useForm<FormValues>();
  const [order, setOrder] = useState<Order | null>(null);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!orderKey) return;
    setLoading(true);
    Promise.all([orderApi.getAll(), budgetApi.getAll()])
      .then(([orders, budgetList]) => {
        const found = orders.find((o) => o.id.split("/")[0] === orderKey) ?? null;
        setOrder(found);
        setBudgets(budgetList);
        if (found) {
          form.setFieldsValue({
            tenDoiTac: found.tenDoiTac,
            maNganSach: found.maNganSach,
            giaTri: found.giaTri,
            tinhTrang: found.tinhTrang,
          });
        }
      })
      .catch(() => message.error("Không tải được thông tin đơn đặt hàng"))
      .finally(() => setLoading(false));
  }, [orderKey]);

  const setEditMode = (edit: boolean) => {
    setSearchParams((prev) => {
      if (edit) prev.set("edit", "true");
      else prev.delete("edit");
      return prev;
    });
  };

  const handleSave = async (values: FormValues) => {
    if (!order) return;
    setSaving(true);
    try {
      const updated = await orderApi.update(order.id, {
        tenDoiTac: values.tenDoiTac,
        maNganSach: values.maNganSach,
        giaTri: values.giaTri,
        tinhTrang: values.tinhTrang as Order["tinhTrang"],
      });
      setOrder(updated);
      message.success("Cập nhật đơn đặt hàng thành công");
      setEditMode(false);
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 10 }} />
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <Empty description="Không tìm thấy thông tin đơn đặt hàng">
          <Button onClick={() => navigate("/dashboard/don-dat-hang")}>Về danh sách</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {isEdit ? "Chỉnh sửa đơn đặt hàng" : `Chi tiết đơn đặt hàng — ${order.id}`}
        </Typography.Title>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard/don-dat-hang")}>
            Quay lại
          </Button>
          {!isEdit && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ background: "#22C55E", borderColor: "#22C55E" }}
              onClick={() => setEditMode(true)}
            >
              Chỉnh sửa
            </Button>
          )}
        </Space>
      </div>

      <Card>
        <Row gutter={[24, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Mã DDH</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{order.id}</div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Tình trạng</div>
            <Tag color={STATUS_COLOR[order.tinhTrang]} style={{ marginTop: 4 }}>
              {order.tinhTrang}
            </Tag>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Giá trị DDH (VNĐ)</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{formatCurrency(order.giaTri)}</div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Người tạo</div>
            <div style={{ fontSize: 14 }}>{order.nguoiTao}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{order.thoiDiemTao}</div>
          </Col>
        </Row>

        <Form<FormValues>
          form={form}
          layout="vertical"
          disabled={!isEdit || saving}
          onFinish={handleSave}
        >
          <Typography.Title level={5}>Thông tin chung</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="tenDoiTac" label="Tên đối tác" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="maNganSach" label="Mã ngân sách" rules={[{ required: true }]}>
                <Select
                  showSearch
                  optionFilterProp="label"
                  options={budgets.map((b) => ({ value: b.maNganSach, label: b.maNganSach }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="giaTri" label="Giá trị DDH (VNĐ)" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="tinhTrang" label="Tình trạng" rules={[{ required: true }]}>
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          {isEdit && (
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <Button onClick={() => setEditMode(false)} disabled={saving}>
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
          )}
        </Form>
      </Card>
    </Space>
  );
}