const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Model
const Student = require('./models/Student');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose.connect('mongodb://localhost:27017/student_db')
  .then(() => console.log("✅ Đã kết nối MongoDB thành công"))
  .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// Route kiểm tra server
app.get('/', (req, res) => {
  res.json({ message: 'Server đang hoạt động!' });
});

// ============ API ROUTES ============

// GET - Lấy danh sách tất cả học sinh
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
});
