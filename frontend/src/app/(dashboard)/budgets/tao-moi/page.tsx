import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  Typography,
  Space,
  message,
  Breadcrumb,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { budgetApi } from "../../../../services/budgetApi";
import type { Budget } from "../../../../types/budget";

const BUDGET_TYPE_OPTIONS = [
  { value: "NSC", label: "NSC" },
  { value: "NSR", label: "NSR" },
];
const FOCAL_POINT_OPTIONS = [
  { value: "CNTT", label: "CNTT" },
  { value: "NV", label: "NV" },
  { value: "DLPT", label: "DLPT" },
];
const STATUS_OPTIONS = [{ value: "Hiệu lực", label: "Hiệu lực" }];

type FormValues = {
  loai: string;
  dauMoi: string;
  trangThai: string;
  soQD: string;
  ngayPheDuyet: dayjs.Dayjs | null;
  giaTri: number;
  thoiGianBatDau: dayjs.Dayjs | null;
  thoiGianKetThuc: dayjs.Dayjs | null;
};

function generateBudgetCode(loai: string, dauMoi: string): string {
  const year = dayjs().year();
  const random = Math.floor(Math.random() * 90 + 10);
  return `${loai}.${random}-${year}-${dauMoi}`;
}

export default function BudgetCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<FormValues>();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const maNganSach = generateBudgetCode(values.loai, values.dauMoi);
      const newBudget: Budget = {
        maNganSach,
        loai: values.loai,
        dauMoi: values.dauMoi,
        soQD: values.soQD,
        ngayPheDuyet: values.ngayPheDuyet ? values.ngayPheDuyet.format("DD/MM/YYYY") : "",
        giaTri: values.giaTri,
        daSuDung: 0,
        conLai: values.giaTri,
        thoiGianThucHienTu: values.thoiGianBatDau ? values.thoiGianBatDau.format("MM/YYYY") : "",
        thoiGianThucHienDen: values.thoiGianKetThuc ? values.thoiGianKetThuc.format("MM/YYYY") : "",
        trangThai: values.trangThai as Budget["trangThai"],
      };

      await budgetApi.create(newBudget);
      message.success("Tạo ngân sách thành công");
      navigate(`/dashboard/ngan-sach/${maNganSach}`);
    } catch {
      message.error("Tạo ngân sách thất bại");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>

      <Typography.Title level={4} style={{ margin: 0 }}>
        Tạo mới ngân sách
      </Typography.Title>

      <Card>
        <Form<FormValues>
          form={form}
          layout="vertical"
          disabled={saving}
          initialValues={{ trangThai: "Hiệu lực" }}
          onFinish={handleSubmit}
        >
          <Typography.Title level={5}>Thông tin chung</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="loai"
                label="Loại ngân sách"
                rules={[{ required: true, message: "Vui lòng chọn loại ngân sách" }]}
              >
                <Select placeholder="Chọn loại ngân sách" options={BUDGET_TYPE_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="dauMoi"
                label="Đầu mối Ngân sách"
                rules={[{ required: true, message: "Vui lòng chọn đầu mối ngân sách" }]}
              >
                <Select placeholder="Chọn đầu mối ngân sách" options={FOCAL_POINT_OPTIONS} />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="trangThai" label="Trạng thái ban đầu">
                <Select options={STATUS_OPTIONS} disabled />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5}>Phê duyệt & Thời gian</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="soQD"
                label="Số QĐ phê duyệt"
                rules={[{ required: true, message: "Vui lòng nhập số QĐ phê duyệt" }]}
              >
                <Input placeholder="VD: 15/QĐ-TW" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="ngayPheDuyet"
                label="Ngày phê duyệt"
                rules={[{ required: true, message: "Vui lòng chọn ngày phê duyệt" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Typography.Title level={5}>Giá trị Ngân sách</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={8}>
              <Form.Item
                name="giaTri"
                label="Giá trị ngân sách (VNĐ)"
                rules={[{ required: true, message: "Vui lòng nhập giá trị ngân sách" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập số tiền phê duyệt"
                  formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="thoiGianBatDau"
                label="Thời gian bắt đầu"
                rules={[{ required: true, message: "Vui lòng chọn thời gian bắt đầu" }]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name="thoiGianKetThuc"
                label="Thời gian kết thúc"
                dependencies={["thoiGianBatDau"]}
                rules={[
                  { required: true, message: "Vui lòng chọn thời gian kết thúc" },
                  ({ getFieldValue }) => ({
                    validator(_, value: dayjs.Dayjs | null) {
                      const start = getFieldValue("thoiGianBatDau") as dayjs.Dayjs | null;
                      if (!value || !start || value.isAfter(start)) return Promise.resolve();
                      return Promise.reject(new Error("Thời gian kết thúc phải sau thời gian bắt đầu"));
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
            <Button onClick={() => navigate("/dashboard/ngan-sach")} disabled={saving}>
              Hủy bỏ
            </Button>
            <Button type="primary" icon={<CheckOutlined />} htmlType="submit" loading={saving}>
              Lưu ngân sách
            </Button>
          </div>
        </Form>
      </Card>
    </Space>
  );
}