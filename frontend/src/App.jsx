import axios from 'axios'
import { useState, useEffect } from 'react'

function App() {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchStudents()
  }, [])

  const fetchStudents = () => {
    axios.get('http://localhost:5000/api/students')
      .then(response => {
        setStudents(response. data)
        setLoading(false)
      })
      .catch(error => {
        console.error("Lỗi khi fetch danh sách:", error)
        setError("Không thể kết nối đến server")
        setLoading(false)
      })
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
      <div className="max-w-5xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📚 Danh sách Học sinh
          </h1>
          <p className="text-gray-600">
            Tổng số: {students.length} học sinh
          </p>
        </div>

        {/* Table */}
        {students.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-500 text-lg italic">
              Chưa có học sinh nào trong danh sách. 
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-green-500 to-green-600">
                <tr>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    STT
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Họ và Tên
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Tuổi
                  </th>
                  <th className="px-6 py-4 text-left text-white font-semibold">
                    Lớp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr 
                    key={student._id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {student.age}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {student.class}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default App