import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  DollarOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  ContactsOutlined,
} from "@ant-design/icons";

const menuGroups = [
  {
    title: "TỔNG QUAN",
    items: [{ key: "/dashboard", label: "Bảng điều khiển", icon: <DashboardOutlined /> }],
  },
  {
    title: "HỢP ĐỒNG & TÀI CHÍNH",
    items: [
      { key: "/dashboard/nhan-su", label: "Nhân sự OutSource", icon: <ContactsOutlined />},
      { key: "/dashboard/ngan-sach", label: "Quản lý ngân sách", icon: <DollarOutlined /> },
      { key: "/dashboard/doi-tac", label: "Quản lý đối tác", icon: <TeamOutlined /> },
      { key: "/dashboard/don-dat-hang", label: "Đơn đặt hàng", icon: <ShoppingCartOutlined /> },
    ],
  },
];

function isMenuActive(pathname: string, itemKey: string): boolean {
  if (itemKey === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === itemKey || pathname.startsWith(itemKey + "/");
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: 240,
        height: "100vh",
        background: "#0B3D1F",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
  

      {/* Menu groups */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "16px 12px"}}>
        {menuGroups.map((group) => (
          <div key={group.title} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "rgba(255,255,255,0.5)",
                padding: "0 12px 8px",
                letterSpacing: 0.5,
              }}
            >
              {group.title}
            </div>
            {group.items.map((item) => {
              const isActive = isMenuActive(location.pathname, item.key);
              return (
                <Link
                  key={item.key}
                  to={item.key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "10px 12px",
                    borderRadius: 5,
                    marginBottom: 2,
                    color: isActive ? "#0B3D1F" : "rgba(255,255,255,0.85)",
                    background: isActive ? "#22C55E" : "transparent",
                    fontWeight: isActive ? 600 : 400,
                    fontSize: 14,
                    textDecoration: "none",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </aside>
  );
}