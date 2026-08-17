import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Divider,
  Alert,
  Grid,
  message,
} from "antd";
import { MailOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";

type LoginFormValues = {
  username: string;
  password: string;
  rememberMe: boolean;
};

const { useBreakpoint } = Grid;

const FIXED_ACCOUNT = {
    username: "namvk@vmogroup.com",
    password: "123456",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<LoginFormValues>();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onFinish = async (values: LoginFormValues) => {
    setSubmitting(true);
    setErrorMsg("");

    // Giả lập xử lý đăng nhập — không gọi API thật
    setTimeout(() => {
      const isValid =
        values.username === FIXED_ACCOUNT.username &&
        values.password === FIXED_ACCOUNT.password;

      if (isValid) {
        navigate("/dashboard");
      } else {
        setErrorMsg("Email hoặc mật khẩu không đúng");
        setSubmitting(false);
      }
    }, 500);
    };

  const handleValuesChange = () => {
    if (errorMsg) setErrorMsg("");
  };

  return (
  <div
    style={{
      
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(180deg, #0B3D1F 0%, #0A2E17 100%)",
      position: "relative",
    }}
  >

    <div
      style={{
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: isMobile ? 0 : 16,
        boxShadow: isMobile
          ? "none"
          : "0 20px 50px rgba(0,0,0,0.35), 0 4px 12px rgba(0,0,0,0.15)",
        padding: isMobile ? "24px 20px 20px" : "24px 32px 20px",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <Typography.Title level={3} style={{ margin: "0 0 4px", color: "#1a1a2e", fontWeight: 700 }}>
          Đăng nhập hệ thống
        </Typography.Title>
        <Typography.Text type="secondary" style={{ fontSize: 14 }}>
          Vui lòng nhập thông tin tài khoản để truy cập hệ thống quản lý
        </Typography.Text>
      </div>

      <Form<LoginFormValues>
        form={form}
        layout="vertical"
        initialValues={{ username: "", password: "", rememberMe: false }}
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
        requiredMark={false}
        disabled={submitting}
      >
        <Form.Item
          name="username"
          label="Email / Tên đăng nhập"
          rules={[
            { required: true, message: "Vui lòng nhập email hoặc tên đăng nhập" },
            { type: "email", message: "Email không đúng định dạng" },
          ]}
        >
          <Input
            size="large"
            prefix={<MailOutlined style={{ color: "#9ca3af" }} />}
            placeholder="namvk@vmogroup.com"
            autoComplete="username"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu" },
            { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined style={{ color: "#9ca3af" }} />}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </Form.Item>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <Form.Item name="rememberMe" valuePropName="checked" noStyle>
            <Checkbox>Ghi nhớ đăng nhập</Checkbox>
          </Form.Item>
          <Link to="/quen-mat-khau" style={{ color: "#005F36", fontSize: 13, fontWeight: 500 }}>
            Quên mật khẩu?
          </Link>
        </div>

        {errorMsg && <Alert type="error" message={errorMsg} showIcon style={{ marginBottom: 16 }} />}

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={submitting}
          style={{ background: "#005F36", borderColor: "#005F36", height: 44, fontSize: 15, fontWeight: 600, boxShadow: "none" }}
        >
          Đăng nhập
        </Button>

        <Divider plain style={{ marginTop: 24, marginBottom: 16 }}>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>HOẶC</Typography.Text>
        </Divider>

        <Button
          size="large"
          block
          icon={<SafetyOutlined style={{ color: "#005F36" }} />}
          style={{ borderColor: "#e5e7eb", color: "#374151" }}
          onClick={() => message.info("Tính năng đang phát triển")}
          disabled={submitting}
        >
          Đăng nhập bằng SSO
        </Button>
      </Form>
    </div>
  </div>
);
}