import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUserEdit, FaSave, FaTimes, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch thông tin học sinh khi component được mount
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students/${id}`);
        // Điền dữ liệu vào form
        setFormData({
          name: response.data.name,
          age: response.data.age,
          class: response.data.class
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching student:", err);
        setError('Không thể tải thông tin học sinh. ' + (err.response?.data?.error || err.message));
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id]);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/students/${id}`, {
        name: formData.name,
        age: Number(formData.age), // Đảm bảo age là số
        class: formData.class
      });
      
      alert('Cập nhật thành công!');
      navigate('/'); // Quay về trang chủ
    } catch (err) {
      console.error("Error updating student:", err);
      alert('Lỗi khi cập nhật: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Đang tải...</p>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
        <button onClick={() => navigate('/')} className="ml-4 text-blue-500 underline flex items-center gap-1">
          <FaArrowLeft /> Quay lại
        </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaUserEdit /> Chỉnh sửa thông tin học sinh
            </h2>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Họ và Tên
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="age">
              Tuổi
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="class">
              Lớp
            </label>
            <input
              type="text"
              id="class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-end mt-6 space-x-2">
             <button
              type="button"
              onClick={() => navigate('/')}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
            >
              <FaTimes /> Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
            >
              <FaSave /> Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
