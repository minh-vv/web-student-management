# 📚 Hệ thống Quản lý Học sinh

Ứng dụng web quản lý học sinh sử dụng React, Express, và MongoDB.

## 🛠️ Công nghệ sử dụng

- **Frontend:** React + Vite + Tailwind CSS
- **Backend:** Node.js + Express
- **Database:** MongoDB (Docker)

## 📁 Cấu trúc dự án

```
web-student-management/
├── frontend/                # React Vite App
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── backend/                 # Express Server
│   ├── models/
│   │   └── Student.js
│   ├── index.js
│   ├── docker-compose.yml
│   └── package.json
│
└── README.md
```

## ⚙️ Yêu cầu hệ thống

- [Node.js](https://nodejs.org/) (v18 trở lên)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Git](https://git-scm.com/)

## 🚀 Hướng dẫn cài đặt

### 1. Clone dự án

```bash
git clone https://github.com/minh-vv/web-student-management.git
cd web-student-management
```

### 2. Cài đặt Backend

```bash
cd backend
npm install
```

### 3. Cài đặt Frontend

```bash
cd frontend
npm install
```

### 4. Khởi động MongoDB (Docker)

```bash
cd backend
docker-compose up -d
```

## ▶️ Chạy ứng dụng

**Terminal 1 - Backend:**

```bash
cd backend
node index.js
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

## 🌐 Truy cập ứng dụng

| Thành phần   | URL                                  |
|--------------|--------------------------------------|
| Frontend     | http://localhost:5173                |
| Backend API  | http://localhost:5000                |
| API Students | http://localhost:5000/api/students   |

## 📡 API Endpoints

| Method | Endpoint           | Mô tả                  |
|--------|--------------------|------------------------|
| GET    | /api/students      | Lấy danh sách học sinh |
| POST   | /api/students      | Thêm học sinh mới      |
| PUT    | /api/students/:id  | Cập nhật học sinh      |
| DELETE | /api/students/:id  | Xóa học sinh           |

## 📝 Cấu trúc dữ liệu Student

```json
{
  "_id": "ObjectId",
  "name": "Nguyễn Văn A",
  "age": 18,
  "class": "12A1",
  "email": "nguyenvana@email.com",
  "createdAt": "2025-12-03T00:00:00.000Z",
  "updatedAt": "2025-12-03T00:00:00.000Z"
}
```

## 🐳 Docker Commands

```bash
# Khởi động MongoDB
docker-compose up -d

# Dừng MongoDB
docker-compose down

# Xem logs
docker-compose logs -f

# Kiểm tra container
docker ps
```

## 👨‍💻 Tác giả

**minh-vv**

## 📄 License

MIT License

