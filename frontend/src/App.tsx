import { Routes, Route, BrowserRouter } from "react-router-dom";

import MainLayout from "./components/layout/MainLayout";

import DashboardPage from "./app/(dashboard)/page";
// Auth
import LoginPage from "./app/(auth)/Login";
import ForgotPasswordPage from "./app/(auth)/ForgotPassword";
import NewPasswordPage from "./app/(auth)/NewPassword";

// Ngân sách
import BudgetsPage from "./app/(dashboard)/budgets/page";
import BudgetsCreate from "./app/(dashboard)/budgets/tao-moi/page";
import BudgetsDetail from "./app/(dashboard)/budgets/[id]/page";

// Đơn đặt hàng
import OrdersPage from "./app/(dashboard)/orders/page";
import OrdersCreate from "./app/(dashboard)/orders/tao-moi/page";
import OrdersDetail from "./app/(dashboard)/orders/[id]/page";
import OrderStaffs from "./app/(dashboard)/orders/ds-nhan-su/page";

// Đối tác
import PartnersPage from "./app/(dashboard)/partners/page";
import PartnersCreate from "./app/(dashboard)/partners/tao-moi/page";
import PartnersDetail from "./app/(dashboard)/partners/[id]/page";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth - không có sidebar */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/quen-mat-khau" element={<ForgotPasswordPage />} />
        <Route path="/mat-khau-moi" element={<NewPasswordPage />} />

        {/* Dashboard - có sidebar, bọc trong MainLayout */}
        <Route path="/dashboard" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="ngan-sach" element={<BudgetsPage />} />
          <Route path="ngan-sach/tao-moi" element={<BudgetsCreate />} />
          <Route path="ngan-sach/:maNganSach" element={<BudgetsDetail />} />

          <Route path="don-dat-hang" element={<OrdersPage />} />
          <Route path="don-dat-hang/tao-moi" element={<OrdersCreate />} />
          <Route path="don-dat-hang/:id" element={<OrdersDetail />} />
          <Route path="don-dat-hang/:id/nhan-su" element={<OrderStaffs />} />

          <Route path="doi-tac" element={<PartnersPage />} />
          <Route path="doi-tac/tao-moi" element={<PartnersCreate />} />
          <Route path="doi-tac/:maSoThue" element={<PartnersDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}