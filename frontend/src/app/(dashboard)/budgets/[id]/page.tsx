import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Button,
  Table,
  Tag,
  Skeleton,
  Empty,
  Space,
  Typography,
  message,
} from "antd";
import { ArrowLeftOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { budgetApi } from "../../../../services/budgetApi";
import { orderApi } from "../../../../services/orderApi";
import type { Budget } from "../../../../types/budget";
import type { Order } from "../../../../types/order";

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
  return value.toLocaleString("vi-VN");
}

type FormValues = {
  loai: string;
  dauMoi: string;
  soQD: string;
  ngayPheDuyet: dayjs.Dayjs | null;
  giaTri: number;
  thoiGianThucHienTu: string;
  thoiGianThucHienDen: string;
  trangThai: string;
};

export default function BudgetsDetail() {
  const { maNganSach } = useParams<{ maNganSach: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isEdit = searchParams.get("edit") === "true";

  const [form] = Form.useForm<FormValues>();
  const [budget, setBudget] = useState<Budget | null>(null);
  const [relatedOrders, setRelatedOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!maNganSach) return;
    setLoading(true);
    Promise.all([budgetApi.getOne(maNganSach), orderApi.getAll()])
      .then(([budgetData, orders]) => {
        setBudget(budgetData);
        setRelatedOrders(orders.filter((o) => o.maNganSach === maNganSach));
        form.setFieldsValue({
          loai: budgetData.loai,
          dauMoi: budgetData.dauMoi,
          soQD: budgetData.soQD,
          ngayPheDuyet: dayjs(budgetData.ngayPheDuyet, "DD/MM/YYYY"),
          giaTri: budgetData.giaTri,
          thoiGianThucHienTu: budgetData.thoiGianThucHienTu,
          thoiGianThucHienDen: budgetData.thoiGianThucHienDen,
          trangThai: budgetData.trangThai,
        });
      })
      .catch(() => message.error("Không tải được thông tin ngân sách"))
      .finally(() => setLoading(false));
  }, [maNganSach]);

  const setEditMode = (edit: boolean) => {
    setSearchParams((prev) => {
      if (edit) prev.set("edit", "true");
      else prev.delete("edit");
      return prev;
    });
  };

  const handleSave = async (values: FormValues) => {
    if (!maNganSach || !budget) return;
    setSaving(true);
    try {
      const conLai = values.giaTri - budget.daSuDung;
      const updated = await budgetApi.update(maNganSach, {
        loai: values.loai,
        dauMoi: values.dauMoi,
        soQD: values.soQD,
        ngayPheDuyet: values.ngayPheDuyet ? values.ngayPheDuyet.format("DD/MM/YYYY") : "",
        giaTri: values.giaTri,
        conLai,
        thoiGianThucHienTu: values.thoiGianThucHienTu,
        thoiGianThucHienDen: values.thoiGianThucHienDen,
        trangThai: values.trangThai as Budget["trangThai"],
      });
      setBudget(updated);
      message.success("Cập nhật ngân sách thành công");
      setEditMode(false);
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const orderColumns: ColumnsType<Order> = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id" },
    { title: "Tên đối tác", dataIndex: "tenDoiTac", key: "tenDoiTac" },
    {
      title: "Giá trị (VNĐ)",
      dataIndex: "giaTri",
      key: "giaTri",
      align: "right",
      render: (v: number) => formatCurrency(v),
    },
    { title: "Người tạo", dataIndex: "nguoiTao", key: "nguoiTao" },
    { title: "Thời điểm tạo", dataIndex: "thoiDiemTao", key: "thoiDiemTao" },
    {
      title: "Trạng thái",
      dataIndex: "tinhTrang",
      key: "tinhTrang",
      render: (status: Order["tinhTrang"]) => {
        const colorMap: Record<string, string> = {
          "Hiệu lực": "success",
          "Hết hiệu lực": "error",
          "Bản nháp": "default",
        };
        return <Tag color={colorMap[status] ?? "default"}>{status}</Tag>;
      },
    },
  ];

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 12 }} />
      </Card>
    );
  }

  if (!budget) {
    return (
      <Card>
        <Empty description="Không tìm thấy thông tin ngân sách">
          <Button onClick={() => navigate("/dashboard/ngan-sach")}>Về danh sách</Button>
        </Empty>
      </Card>
    );
  }

  const tyLeSuDung =
    budget.giaTri > 0 ? ((budget.daSuDung / budget.giaTri) * 100).toFixed(2) : "0";

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {isEdit ? "Chỉnh sửa ngân sách" : `Chi tiết ngân sách — ${budget.maNganSach}`}
        </Typography.Title>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/dashboard/ngan-sach")}>
            Quay lại
          </Button>
          {!isEdit && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => setEditMode(true)}>
              Chỉnh sửa
            </Button>
          )}
        </Space>
      </div>

      <Card>
        <Row gutter={[24, 16]} style={{ marginBottom: 24 }}>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Tổng ngân sách (VNĐ)</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(budget.giaTri)}</div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Đã sử dụng (VNĐ)</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(budget.daSuDung)}</div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Còn lại (VNĐ)</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(budget.conLai)}</div>
          </Col>
          <Col xs={12} md={6}>
            <div style={{ fontSize: 12, color: "#6b7280" }}>Tỷ lệ sử dụng</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a" }}>{tyLeSuDung} %</div>
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
              <Form.Item name="loai" label="Loại ngân sách" rules={[{ required: true }]}>
                <Select options={BUDGET_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="dauMoi" label="Đầu mối ngân sách" rules={[{ required: true }]}>
                <Select options={FOCAL_POINT_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="trangThai" label="Trạng thái" rules={[{ required: true }]}>
                <Select options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5}>Phê duyệt & Thời gian</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item name="soQD" label="Số QĐ phê duyệt" rules={[{ required: true }]}>
                <Input placeholder="VD: 15/QĐ-TW" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="ngayPheDuyet" label="Ngày phê duyệt" rules={[{ required: true }]}>
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="giaTri" label="Giá trị ngân sách (VNĐ)" rules={[{ required: true }]}>
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                  
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="thoiGianThucHienTu"
                label="Thời gian bắt đầu (MM/YYYY)"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: 01/2026" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="thoiGianThucHienDen"
                label="Thời gian kết thúc (MM/YYYY)"
                rules={[{ required: true }]}
              >
                <Input placeholder="VD: 12/2026" />
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
                Lưu ngân sách
              </Button>
            </div>
          )}
        </Form>
      </Card>

      <Card>
        <Typography.Title level={5}>Danh sách Đơn hàng</Typography.Title>
        <Table<Order>
          rowKey="id"
          columns={orderColumns}
          dataSource={relatedOrders}
          pagination={false}
          scroll={{ x: 900 }}
          onRow={(record) => ({
            onClick: () => navigate(`/dashboard/don-dat-hang/${record.id}`),
            style: { cursor: "pointer" },
          })}
          locale={{
            emptyText: (
              <Empty description="Chưa có đơn hàng nào." image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ),
          }}
        />
      </Card>
    </Space>
  );
}