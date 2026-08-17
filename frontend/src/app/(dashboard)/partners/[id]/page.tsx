import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  Button,
  Tag,
  Skeleton,
  Empty,
  Space,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import { partnerApi } from "../../../../services/partnerApi";
import type { Partner } from "../../../../types/partner";

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

type FormValues = {
  tenCongTy: string;
  tenVietTat: string;
  diaChi: string;
  soDienThoai: string;
  trangThai: string;
};

export default function PartnersDetail() {
  const { maSoThue } = useParams<{ maSoThue: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [form] = Form.useForm<FormValues>();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!maSoThue) return;
    setLoading(true);
    partnerApi
      .getOne(maSoThue)
      .then((data) => {
        setPartner(data);
        form.setFieldsValue({
          tenCongTy: data.tenCongTy,
          tenVietTat: data.tenVietTat,
          diaChi: data.diaChi,
          soDienThoai: data.soDienThoai,
          trangThai: data.trangThai,
        });
      })
      .catch(() => message.error("Không tải được thông tin đối tác"))
      .finally(() => setLoading(false));
  }, [maSoThue]);

  const setEditMode = (edit: boolean) => {
    setSearchParams((prev) => {
      if (edit) prev.set("edit", "true");
      else prev.delete("edit");
      return prev;
    });
  };

  const handleSave = async (values: FormValues) => {
    if (!maSoThue) return;
    setSaving(true);
    try {
      const now = new Date();
      const thoiDiemCapNhat = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")} ${String(now.getDate()).padStart(2, "0")}/${String(
        now.getMonth() + 1
      ).padStart(2, "0")}/${now.getFullYear()}`;

      const updated = await partnerApi.update(maSoThue, {
        tenCongTy: values.tenCongTy,
        tenVietTat: values.tenVietTat,
        diaChi: values.diaChi,
        soDienThoai: values.soDienThoai,
        trangThai: values.trangThai as Partner["trangThai"],
        nguoiCapNhat: "Test SUPERADMIN",
        thoiDiemCapNhat,
      });
      setPartner(updated);
      message.success("Cập nhật đối tác thành công");
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

  if (!partner) {
    return (
      <Card>
        <Empty description="Không tìm thấy thông tin đối tác">
          <Button onClick={() => navigate("/dashboard/doi-tac")}>Về danh sách</Button>
        </Empty>
      </Card>
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {isEdit ? "Chỉnh sửa đối tác" : `Chi tiết đối tác — ${partner.tenCongTy}`}
        </Typography.Title>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard/doi-tac")}>
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
            <div style={{ fontSize: 12, color: "#6b7280" }}>Mã số thuế</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>{partner.maSoThue}</div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Trạng thái hợp tác</div>
            <Tag color={STATUS_COLOR[partner.trangThai]} style={{ marginTop: 4 }}>
              {partner.trangThai}
            </Tag>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Người tạo</div>
            <div style={{ fontSize: 14 }}>{partner.nguoiTao}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{partner.thoiDiemTao}</div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Người cập nhật</div>
            <div style={{ fontSize: 14 }}>{partner.nguoiCapNhat}</div>
            <div style={{ fontSize: 12, color: "#9ca3af" }}>{partner.thoiDiemCapNhat}</div>
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
            <Col xs={24} md={8}>
              <Form.Item name="tenCongTy" label="Tên công ty" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="tenVietTat" label="Tên viết tắt" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="trangThai" label="Trạng thái hợp tác" rules={[{ required: true }]}>
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} md={16}>
              <Form.Item name="diaChi" label="Địa chỉ" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="soDienThoai" label="Số điện thoại" rules={[{ required: true }]}>
                <Input />
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
                Lưu đối tác
              </Button>
            </div>
          )}
        </Form>
      </Card>
    </Space>
  );
}