import express, { Request, Response } from "express";
import cors from "cors";
import { budgets, Budget } from "./data/budgets";
import { orders, Order, } from "./data/orders";
import { partners, Partner } from "./data/partners";
import { employees, Employee } from "./data/employee";

const app = express();
app.use(cors());
app.use(express.json());

// ============ NGÂN SÁCH ============
app.get("/api/budgets", (req: Request, res: Response) => {
  res.json(budgets);
});

app.get("/api/budgets/:maNganSach", (req: Request, res: Response) => {
  const item = budgets.find(b => b.maNganSach === req.params.maNganSach);
  if (!item) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(item);
});

app.post("/api/budgets", (req: Request, res: Response) => {
  const newItem: Budget = req.body;
  if (budgets.some(b => b.maNganSach === newItem.maNganSach)) {
    return res.status(400).json({ error: "Mã ngân sách đã tồn tại" });
  }
  budgets.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/budgets/:maNganSach", (req: Request, res: Response) => {
  const index = budgets.findIndex(b => b.maNganSach === req.params.maNganSach);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  budgets[index] = { ...budgets[index], ...req.body };
  res.json(budgets[index]);
});

app.delete("/api/budgets/:maNganSach", (req: Request, res: Response) => {
  const index = budgets.findIndex(b => b.maNganSach === req.params.maNganSach);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  budgets.splice(index, 1);
  res.json({ success: true });
});

// ============ ĐƠN ĐẶT HÀNG ============
app.get("/api/orders", (req: Request, res: Response) => {
  res.json(orders);
});

app.get("/api/orders/:id", (req: Request, res: Response) => {
  const item = orders.find(o => o.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(item);
});

app.post("/api/orders", (req: Request, res: Response) => {
  const newItem: Order = req.body;
  if (orders.some(o => o.id === newItem.id)) {
    return res.status(400).json({ error: "Mã đơn đặt hàng đã tồn tại" });
  }
  orders.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/orders/:id", (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  orders[index] = { ...orders[index], ...req.body };
  res.json(orders[index]);
});

app.delete("/api/orders/:id", (req: Request, res: Response) => {
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  orders.splice(index, 1);
  res.json({ success: true });
});

// ============ ĐỐI TÁC ============
app.get("/api/partners", (req: Request, res: Response) => {
  res.json(partners);
});

app.get("/api/partners/:maSoThue", (req: Request, res: Response) => {
  const item = partners.find(p => p.maSoThue === req.params.maSoThue);
  if (!item) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(item);
});

app.post("/api/partners", (req: Request, res: Response) => {
  const newItem: Partner = req.body;
  if (partners.some(p => p.maSoThue === newItem.maSoThue)) {
    return res.status(400).json({ error: "Mã số thuế đã tồn tại" });
  }
  partners.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/partners/:maSoThue", (req: Request, res: Response) => {
  const index = partners.findIndex(p => p.maSoThue === req.params.maSoThue);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  partners[index] = { ...partners[index], ...req.body };
  res.json(partners[index]);
});

app.delete("/api/partners/:maSoThue", (req: Request, res: Response) => {
  const index = partners.findIndex(p => p.maSoThue === req.params.maSoThue);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  partners.splice(index, 1);
  res.json({ success: true });
});

// ============ NHÂN SỰ ============
app.get("/api/employees", (req: Request, res: Response) => {
  res.json(employees);
});

app.get("/api/employees/:cccd", (req: Request, res: Response) => {
  const item = employees.find(e => e.cccd === req.params.cccd);
  if (!item) return res.status(404).json({ error: "Không tìm thấy" });
  res.json(item);
});

app.post("/api/employees", (req: Request, res: Response) => {
  const newItem: Employee = req.body;
  if (employees.some(e => e.cccd === newItem.cccd)) {
    return res.status(400).json({ error: "Số CCCD đã tồn tại" });
  }
  employees.push(newItem);
  res.status(201).json(newItem);
});

app.put("/api/employees/:cccd", (req: Request, res: Response) => {
  const index = employees.findIndex(e => e.cccd === req.params.cccd);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  employees[index] = { ...employees[index], ...req.body };
  res.json(employees[index]);
});

app.delete("/api/employees/:cccd", (req: Request, res: Response) => {
  const index = employees.findIndex(e => e.cccd === req.params.cccd);
  if (index === -1) return res.status(404).json({ error: "Không tìm thấy" });
  employees.splice(index, 1);
  res.json({ success: true });
});


const PORT = 5000;
app.listen(PORT, () => console.log(`Server chạy ở http://localhost:${PORT}`));