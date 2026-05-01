import { useAuthModal } from '../AuthModalContext'
import { useEffect } from 'react'

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token')
    const { setShowModal } = useAuthModal()

    useEffect(() => {
        if (!token) setShowModal(true)
    }, [token])

    return token ? children : null
}

export default PrivateRoute