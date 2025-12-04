import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FaBook, FaEdit, FaInbox, FaTrash, FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa'
import AddStudentForm from '../components/AddStudentForm'
import EditStudentModal from '../components/EditStudentModal'
import Toast from '../components/Toast'

function HomePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' | 'desc'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(null)
  const [highlightedId, setHighlightedId] = useState(null)
  
  // State cho modal edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)

  // Fetch dữ liệu mỗi khi vào trang này (kể cả khi navigate từ trang khác về)
  useEffect(() => {
    fetchStudents()
  }, [location.key]) // Re-fetch khi navigate về trang này

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response.data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Lỗi khi fetch danh sách:", error)
        setError("Không thể kết nối đến server")
        setLoading(false)
      })
  }

  // Hàm xử lý thêm học sinh mới
  const handleAddStudent = async (newStudentData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/students', newStudentData)
      
      // Thêm học sinh mới vào danh sách hiện tại
      setStudents(prevStudents => [...prevStudents, response.data])
      
      // Highlight hàng vừa thêm
      setHighlightedId(response.data._id)
      setTimeout(() => setHighlightedId(null), 3000)
      
      // Hiển thị thông báo thành công
      setToast({
        message: `Đã thêm học sinh "${newStudentData.name}" thành công!`,
        type: 'success'
      })
    } catch (error) {
      console.error('Lỗi khi thêm học sinh:', error)
      setToast({
        message: error.response?.data?.error || 'Không thể thêm học sinh',
        type: 'error'
      })
      throw error
    }
  }

  // Hàm mở modal chỉnh sửa
  const handleEdit = (student) => {
    setEditingStudent(student)
    setIsEditModalOpen(true)
  }

  // Hàm xử lý cập nhật học sinh từ modal
  const handleUpdateStudent = (updatedStudent) => {
    setStudents(prevStudents => 
      prevStudents.map(s => s._id === updatedStudent._id ? updatedStudent : s)
    )
    setToast({
      message: 'Cập nhật thông tin thành công!',
      type: 'success'
    })
    setHighlightedId(updatedStudent._id)
    setTimeout(() => setHighlightedId(null), 3000)
  }

  // Hàm xử lý xóa học sinh
  const handleDelete = (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa học sinh này?")) return;

    axios.delete(`http://localhost:5000/api/students/${id}`)
      .then(res => {
        console.log(res.data.message);
        setStudents(prevList => prevList.filter(s => s._id !== id));
        setToast({
          message: 'Đã xóa học sinh thành công!',
          type: 'success'
        });
      })
      .catch(err => {
        console.error("Lỗi khi xóa:", err);
        setToast({
          message: err.response?.data?.error || 'Lỗi khi xóa học sinh',
          type: 'error'
        });
      });
  };

  // Lọc và sắp xếp danh sách học sinh (client-side)
  const processedStudents = students
    .filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const nameA = a.name.toLowerCase()
      const nameB = b.name.toLowerCase()
      if (nameA < nameB) return sortOrder === 'asc' ? -1 : 1
      if (nameA > nameB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

  // Hàm chuyển đổi thứ tự sắp xếp
  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
          <p className="font-medium">❌ Lỗi: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <FaBook className="text-blue-600" /> Quản lý Học sinh
          </h1>
          <p className="text-gray-600">
            Tổng số: {processedStudents.length} / {students.length} học sinh
          </p>
        </div>

        <div className="flex flex-col gap-6 mb-8">
           {/* Form thêm học sinh */}
           <AddStudentForm onAddStudent={handleAddStudent} />

            {/* Tìm kiếm và Sắp xếp */}
           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <FaSearch className="text-blue-600" /> Tìm kiếm & Sắp xếp
                </h2>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Search Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Nhập tên để tìm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-gray-50 focus:bg-white"
                  />
                  <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
                </div>

                {/* Sort Button */}
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium whitespace-nowrap"
                >
                  {sortOrder === 'asc' ? <FaSortAlphaDown className="text-blue-600" /> : <FaSortAlphaUp className="text-blue-600" />}
                  {sortOrder === 'asc' ? 'A → Z' : 'Z → A'}
                </button>
              </div>
           </div>
        </div>

        {/* Table */}
        {processedStudents.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
            <div className="flex justify-center mb-4">
              <FaInbox className="text-6xl text-gray-200" />
            </div>
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'Không tìm thấy học sinh nào phù hợp.' : 'Chưa có học sinh nào trong danh sách.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold text-sm uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold text-sm uppercase tracking-wider cursor-pointer hover:text-blue-600 transition-colors" onClick={toggleSortOrder} title="Nhấn để sắp xếp">
                    <div className="flex items-center gap-2">
                      Họ và Tên
                      {sortOrder === 'asc' ? <FaSortAlphaDown className="text-slate-400" /> : <FaSortAlphaUp className="text-slate-400" />}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold text-sm uppercase tracking-wider">
                    Tuổi
                  </th>
                  <th className="px-6 py-4 text-left text-slate-600 font-semibold text-sm uppercase tracking-wider">
                    Lớp
                  </th>
                  <th className="px-6 py-4 text-center text-slate-600 font-semibold text-sm uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {processedStudents.map((student, index) => (
                  <tr 
                    key={student._id}
                    className={`transition-colors duration-200 group hover:bg-slate-50 ${
                      highlightedId === student._id 
                        ? 'bg-blue-50' 
                        : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-slate-500 font-medium">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-slate-800 font-semibold">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {student.age}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-sm font-medium border border-slate-200">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center space-x-3 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(student)}
                          className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-50 transition-colors"
                          title="Sửa"
                        >
                          <FaEdit className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Xóa"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditStudentModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={editingStudent}
        onUpdate={handleUpdateStudent}
      />
    </div>
  )
}

export default HomePage

