import { useEffect } from 'react'
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa'

function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const styles = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }

  const icons = {
    success: <FaCheckCircle className="text-2xl" />,
    error: <FaExclamationCircle className="text-2xl" />,
    info: <FaInfoCircle className="text-2xl" />
  }

  return (
    <div className="fixed top-4 right-4 z-50 animate-slideIn">
      <div className={`${styles[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 min-w-[300px]`}>
        {icons[type]}
        <p className="font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200 transition-colors"
        >
          <FaTimes className="text-xl" />
        </button>
      </div>
    </div>
  )
}

export default Toast

