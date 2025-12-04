import { useState } from 'react'
import { FaUserPlus, FaSpinner } from 'react-icons/fa'

function AddStudentForm({ onAddStudent }) {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: ''
  })

  // State quản lý trạng thái submit
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate dữ liệu
    if (!formData.name.trim() || !formData.age || !formData.class.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!')
      return
    }

    setIsSubmitting(true)

    try {
      // Gọi function từ component cha để thêm học sinh
      await onAddStudent({
        name: formData.name.trim(),
        age: parseInt(formData.age),
        class: formData.class.trim()
      })

      // Reset form sau khi thêm thành công
      setFormData({
        name: '',
        age: '',
        class: ''
      })
    } catch (error) {
      console.error('Lỗi khi thêm học sinh:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full border border-gray-100">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <FaUserPlus className="text-blue-600" /> Thêm Học sinh Mới
      </h2>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Họ tên */}
        <div className="md:col-span-4">
          <label htmlFor="name" className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
            Họ và Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập họ tên"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
            disabled={isSubmitting}
          />
        </div>

        {/* Tuổi */}
        <div className="md:col-span-2">
          <label htmlFor="age" className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
            Tuổi <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Tuổi"
            min="1"
            max="100"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
            disabled={isSubmitting}
          />
        </div>

        {/* Lớp */}
        <div className="md:col-span-3">
          <label htmlFor="class" className="block text-xs font-semibold text-gray-500 mb-1 uppercase">
            Lớp <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="class"
            name="class"
            value={formData.class}
            onChange={handleChange}
            placeholder="Lớp (12A1)"
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
            disabled={isSubmitting}
          />
        </div>

        {/* Nút submit */}
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center border border-transparent ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Đang xử lý...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <FaUserPlus /> Thêm mới
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStudentForm

