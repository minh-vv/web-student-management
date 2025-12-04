import { useState, useEffect } from 'react';
import { FaUserEdit, FaSave, FaTimes } from 'react-icons/fa';
import axios from 'axios';

const EditStudentModal = ({ isOpen, onClose, student, onUpdate }) => {
  // State lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cập nhật form data khi student thay đổi
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        age: student.age,
        class: student.class
      });
    }
  }, [student]);

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
    if (!student) return;

    setIsSubmitting(true);
    try {
      const response = await axios.put(`http://localhost:5000/api/students/${student._id}`, {
        name: formData.name,
        age: Number(formData.age), // Đảm bảo age là số
        class: formData.class
      });
      
      onUpdate(response.data);
      onClose();
    } catch (err) {
      console.error("Error updating student:", err);
      alert('Lỗi khi cập nhật: ' + (err.response?.data?.error || err.message));
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FaUserEdit /> Chỉnh sửa thông tin
            </h2>
            <button onClick={onClose} className="text-white hover:text-gray-200">
                <FaTimes />
            </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-name">
              Họ và Tên
            </label>
            <input
              type="text"
              id="edit-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-age">
              Tuổi
            </label>
            <input
              type="number"
              id="edit-age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="edit-class">
              Lớp
            </label>
            <input
              type="text"
              id="edit-class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center justify-end mt-6 space-x-2">
             <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg focus:outline-none transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none transition-colors flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Đang lưu...' : <><FaSave /> Lưu thay đổi</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudentModal;

