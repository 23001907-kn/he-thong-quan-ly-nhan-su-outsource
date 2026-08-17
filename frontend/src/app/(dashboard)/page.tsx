import { useState, useEffect, useMemo } from "react";
import { Card, Row, Col, Typography, Space, Skeleton, Empty } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { budgetApi } from "../../services/budgetApi";
import { orderApi } from "../../services/orderApi";
import { partnerApi } from "../../services/partnerApi";
import type { Budget } from "../../types/budget";
import type { Order } from "../../types/order";
import type { Partner } from "../../types/partner";

const PIE_COLORS_ORDER = ["#22C55E", "#94A3B8", "#EF4444"]; // Hiệu lực, Bản nháp, Hết hiệu lực
const PIE_COLORS_PARTNER = ["#22C55E", "#3B82F6", "#EF4444"]; // Đang, Chưa, Ngưng hợp tác

function formatCurrency(value: number) {
  return value.toLocaleString("vi-VN");
}

function formatTrieu(value: number) {
  return (value / 1_000_000).toLocaleString("vi-VN", { maximumFractionDigits: 1 }) + " tr";
}

export default function DashboardPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([budgetApi.getAll(), orderApi.getAll(), partnerApi.getAll()])
      .then(([b, o, p]) => {
        setBudgets(b);
        setOrders(o);
        setPartners(p);
      })
      .finally(() => setLoading(false));
  }, []);

  // ===== Tổng quan =====
  const summary = useMemo(() => {
    const tongNganSach = budgets.reduce((sum, b) => sum + b.giaTri, 0);
    const daSuDung = budgets.reduce((sum, b) => sum + b.daSuDung, 0);
    const tongDonHang = orders.length;
    const tongDoiTac = partners.length;
    const nganSachSapHet = budgets.filter(
      (b) => b.giaTri > 0 && b.conLai < b.giaTri * 0.1
    ).length;
    return { tongNganSach, daSuDung, tongDonHang, tongDoiTac, nganSachSapHet };
  }, [budgets, orders, partners]);

  // ===== Biểu đồ 1: Top ngân sách theo mức sử dụng (đã dùng / còn lại) =====
  const budgetUsageData = useMemo(() => {
    return [...budgets]
      .sort((a, b) => b.giaTri - a.giaTri)
      .slice(0, 8)
      .map((b) => ({
        name: b.maNganSach,
        daSuDung: b.daSuDung,
        conLai: b.conLai,
        tyLe: b.giaTri > 0 ? Math.round((b.daSuDung / b.giaTri) * 100) : 0,
      }));
  }, [budgets]);

  // ===== Biểu đồ 2: Giá trị đơn hàng theo đối tác (top 8) =====
  const orderByPartnerData = useMemo(() => {
    const map = new Map<string, { giaTri: number; soDon: number }>();
    orders.forEach((o) => {
      const cur = map.get(o.tenDoiTac) ?? { giaTri: 0, soDon: 0 };
      cur.giaTri += o.giaTri;
      cur.soDon += 1;
      map.set(o.tenDoiTac, cur);
    });
    return Array.from(map.entries())
      .map(([name, v]) => ({ name, ...v }))
      .sort((a, b) => b.giaTri - a.giaTri)
      .slice(0, 8);
  }, [orders]);

  // ===== Biểu đồ 3: Phân bố trạng thái đơn hàng =====
  const orderStatusData = useMemo(() => {
    const counts: Record<string, number> = { "Hiệu lực": 0, "Bản nháp": 0, "Hết hiệu lực": 0 };
    orders.forEach((o) => {
      counts[o.tinhTrang] = (counts[o.tinhTrang] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  // ===== Biểu đồ 4: Phân bố trạng thái đối tác =====
  const partnerStatusData = useMemo(() => {
    const counts: Record<string, number> = {
      "Đang hợp tác": 0,
      "Chưa hợp tác": 0,
      "Ngưng hợp tác": 0,
    };
    partners.forEach((p) => {
      counts[p.trangThai] = (counts[p.trangThai] ?? 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [partners]);

  if (loading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 12 }} />
      </Card>
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <Typography.Title level={4} style={{ margin: 0 }}>
        Bảng điều khiển
      </Typography.Title>

      {/* Thẻ tổng quan */}
      <Row gutter={16}>
        <Col xs={12} md={6}>
          <Card>
            <Space>
              <DollarOutlined style={{ fontSize: 22, color: "#0B3D1F" }} />
              <div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Tổng ngân sách (VNĐ)</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(summary.tongNganSach)}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Space>
              <DollarOutlined style={{ fontSize: 22, color: "#16a34a" }} />
              <div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Đã sử dụng (VNĐ)</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{formatCurrency(summary.daSuDung)}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Space>
              <ShoppingCartOutlined style={{ fontSize: 22, color: "#3B82F6" }} />
              <div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Tổng đơn đặt hàng</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{summary.tongDonHang}</div>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={12} md={6}>
          <Card>
            <Space>
              <TeamOutlined style={{ fontSize: 22, color: "#F59E0B" }} />
              <div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>Tổng đối tác</div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{summary.tongDoiTac}</div>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {summary.nganSachSapHet > 0 && (
        <Card style={{ background: "#FFFBEB", borderColor: "#FDE68A" }}>
          <Space>
            <WarningOutlined style={{ color: "#D97706", fontSize: 18 }} />
            <Typography.Text style={{ color: "#92400E" }}>
              Có <strong>{summary.nganSachSapHet}</strong> ngân sách còn lại dưới 10% giá trị ban đầu — cần theo dõi.
            </Typography.Text>
          </Space>
        </Card>
      )}

      {/* Biểu đồ 1: Mức sử dụng ngân sách */}
      <Card>
        <Typography.Title level={5}>Mức sử dụng ngân sách (Top 8, đơn vị: triệu đồng)</Typography.Title>
        {budgetUsageData.length === 0 ? (
          <Empty description="Chưa có dữ liệu" />
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={budgetUsageData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tickFormatter={(v) => formatTrieu(v)} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => formatCurrency(Number(v)) + " đ"} />
              <Legend />
              <Bar dataKey="daSuDung" name="Đã sử dụng" stackId="a" fill="#EF4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="conLai" name="Còn lại" stackId="a" fill="#22C55E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Row gutter={16}>
        {/* Biểu đồ 2: Giá trị đơn hàng theo đối tác */}
        <Col xs={24} lg={14}>
          <Card style={{ height: "100%" }}>
            <Typography.Title level={5}>Giá trị đơn đặt hàng theo đối tác (Top 8)</Typography.Title>
            {orderByPartnerData.length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={orderByPartnerData} layout="vertical" margin={{ left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => formatTrieu(v)} />
                  <YAxis type="category" dataKey="name" width={160} tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => formatCurrency(Number(v)) + " đ"} />
                  <Bar dataKey="giaTri" name="Giá trị (VNĐ)" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Card>
        </Col>

        {/* Biểu đồ 3: Trạng thái đơn hàng */}
        <Col xs={24} lg={10}>
          <Card style={{ height: "100%" }}>
            <Typography.Title level={5}>Trạng thái đơn đặt hàng</Typography.Title>
            <ResponsiveContainer width="100%" height={340}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {orderStatusData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS_ORDER[idx % PIE_COLORS_ORDER.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ 4: Trạng thái đối tác */}
      <Card>
        <Typography.Title level={5}>Trạng thái hợp tác đối tác</Typography.Title>
        <Row align="middle">
          <Col xs={24} md={12}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={partnerStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                >
                  {partnerStatusData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS_PARTNER[idx % PIE_COLORS_PARTNER.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Col>
          <Col xs={24} md={12}>
            <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
              {partnerStatusData.map((item, idx) => (
                <div
                  key={item.name}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <Space>
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: PIE_COLORS_PARTNER[idx % PIE_COLORS_PARTNER.length],
                      }}
                    />
                    <Typography.Text>{item.name}</Typography.Text>
                  </Space>
                  <Typography.Text strong>
                    {item.value} ({partners.length > 0 ? Math.round((item.value / partners.length) * 100) : 0}%)
                  </Typography.Text>
                </div>
              ))}
            </Space>
          </Col>
        </Row>
      </Card>
    </Space>
  );
}