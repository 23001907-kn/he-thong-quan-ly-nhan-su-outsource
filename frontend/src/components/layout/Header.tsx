import { Link } from "react-router-dom";
import { Input, Badge, Avatar } from "antd";
import { MenuOutlined, SearchOutlined, BellOutlined } from "@ant-design/icons";

export default function Header() {
  return (
    <header
      style={{
        height: 64,
        background: "#EEEEEE",
        borderBottom: "1px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Icon + Tổng quan - click về dashboard */}
      <Link
        to="/dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#1a1a2e",
          textDecoration: "none",
        }}
      >
        <MenuOutlined style={{ fontSize: 16 }} />
        <span style={{ fontSize: 15, fontWeight: 600 }}>Tổng quan</span>
      </Link>

      {/* Thanh tìm kiếm */}
      <Input
        prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
        placeholder="Tìm kiếm menu, chức năng, báo cáo..."
        suffix={<span style={{ fontSize: 12, color: "#9ca3af" }}>Ctrl + K</span>}
        style={{ width: 400, borderRadius: 8 }}
      />

      {/* Chuông + User */}
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Badge count={3} size="small">
          <BellOutlined style={{ fontSize: 18, color: "#374151" }} />
        </Badge>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar style={{ background: "#0B3D1F" }}>N</Avatar>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a2e" }}>
              ADMIN
            </div>
            <div style={{ fontSize: 11, color: "#9ca3af" }}>Toàn quyền hệ thống</div>
          </div>
        </div>
      </div>
    </header>
  );
}