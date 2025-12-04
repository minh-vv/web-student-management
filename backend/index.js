const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import Model
const Student = require('./models/Student');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware - log tất cả requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// Kết nối MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student_db';
mongoose.connect(MONGODB_URI)
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
    const students = await Student.find().sort({ createdAt: -1 });
    console.log(`📋 Trả về ${students.length} học sinh`);
    res.json(students);
  } catch (err) {
    console.error('❌ Lỗi GET /api/students:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET - Lấy thông tin một học sinh theo ID
app.get('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 Tìm học sinh với ID:', id);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ ID không hợp lệ:', id);
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    
    const student = await Student.findById(id);
    
    if (!student) {
      console.log('❌ Không tìm thấy học sinh với ID:', id);
      return res.status(404).json({ error: 'Không tìm thấy học sinh với ID này' });
    }
    
    console.log('✅ Tìm thấy:', student.name);
    res.json(student);
  } catch (err) {
    console.error('❌ Lỗi GET /api/students/:id:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST - Thêm học sinh mới
app.post('/api/students', async (req, res) => {
  try {
    console.log('📝 Thêm học sinh mới:', req.body);
    const newStudent = await Student.create(req.body);
    console.log('✅ Đã thêm:', newStudent.name, '- ID:', newStudent._id);
    res.status(201).json(newStudent);
  } catch (err) {
    console.error('❌ Lỗi POST /api/students:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// PUT - Cập nhật thông tin học sinh theo ID
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('📝 Cập nhật học sinh ID:', id);
    console.log('📝 Dữ liệu mới:', req.body);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log('❌ ID không hợp lệ:', id);
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      req.body,
      { 
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      console.log('❌ Không tìm thấy học sinh để cập nhật');
      return res.status(404).json({ error: 'Không tìm thấy học sinh với ID này' });
    }

    console.log('✅ Đã cập nhật:', updatedStudent.name);
    res.json(updatedStudent);
  } catch (err) {
    console.error('❌ Lỗi PUT /api/students/:id:', err.message);
    res.status(400).json({ error: err.message });
  }
});

// DELETE - Xóa học sinh theo ID
app.delete('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ Xóa học sinh ID:', id);
    
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID không hợp lệ' });
    }
    
    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: 'Không tìm thấy học sinh với ID này' });
    }

    console.log('✅ Đã xóa:', deletedStudent.name);
    res.json({ message: 'Đã xóa học sinh thành công', student: deletedStudent });
  } catch (err) {
    console.error('❌ Lỗi DELETE /api/students/:id:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
  console.log('📡 API endpoints:');
  console.log('   GET    /api/students     - Lấy danh sách học sinh');
  console.log('   GET    /api/students/:id - Lấy thông tin 1 học sinh');
  console.log('   POST   /api/students     - Thêm học sinh mới');
  console.log('   PUT    /api/students/:id - Cập nhật học sinh');
  console.log('   DELETE /api/students/:id - Xóa học sinh');
});
