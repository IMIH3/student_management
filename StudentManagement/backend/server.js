const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3000;

// Middleware để xử lý JSON
app.use(express.json());

// Cấu hình CORS (cho phép frontend gọi API)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Cấu hình Nodemailer (dùng Gmail làm ví dụ)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'pbminh09122003@gmail.com', // Thay bằng email của bạn
    pass: 'vzru tvak xfsh bydh', // Thay bằng App Password của Gmail
  },
});

// Danh sách tài khoản
const accounts = [
  { username: 'admin', password: 'admin123', role: 'admin', email: 'pbminh09122003@gmail.com' },
  { username: 'user', password: 'user123', role: 'user', email: 'phamminh001199@gmail.com' },
];

// API gửi mã xác nhận qua email
app.post('/send-reset-code', async (req, res) => {
  const { email } = req.body;

  // Kiểm tra email có tồn tại không
  const account = accounts.find(acc => acc.email === email);
  if (!account) {
    return res.status(400).json({ message: 'Email không hợp lệ!' });
  }

  // Tạo mã xác nhận ngẫu nhiên (6 chữ số)
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Cấu hình email
  const mailOptions = {
    from: 'pbminh09122003@gmail.com', // Email gửi
    to: email, // Email người nhận
    subject: 'Mã xác nhận đặt lại mật khẩu',
    text: `Mã xác nhận của bạn là: ${resetCode}\nVui lòng sử dụng mã này để đặt lại mật khẩu. Mã có hiệu lực trong 10 phút.`,
  };

  try {
    // Gửi email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Mã xác nhận đã được gửi vào email của bạn.', resetCode });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Không thể gửi email. Vui lòng thử lại!' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});