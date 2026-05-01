import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Navbar = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user'))
    const [menuOpen, setMenuOpen] = useState(false)

    const hideNavbar = location.pathname === '/login' || location.pathname === '/register'
    if (hideNavbar) return null

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
    }

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/cart', label: 'Cart' },
        { to: '/checkout', label: 'Checkout' },
        { to: '/myorders', label: 'My Orders' },
    ]

    return (
        <nav className="w-full bg-white border-b border-neutral-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="text-lg font-semibold text-indigo-600 tracking-tight">
                    Store
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-6">

                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className={`text-sm transition-colors duration-150 ${location.pathname === link.to
                                    ? 'text-indigo-700 font-medium'
                                    : 'text-neutral-400 hover:text-indigo-600'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user?.role === 'admin' && (
                        <Link
                            to="/admin/orders"
                            className="text-sm text-neutral-400 hover:text-indigo-600 transition-colors duration-150"
                        >
                            Admin
                        </Link>
                    )}

                    {token ? (
                        <button
                            onClick={handleLogout}
                            className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-150 cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login" className="text-sm text-neutral-400 hover:text-indigo-700 transition-colors duration-150">
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="text-sm px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-150"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile hamburger */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden flex flex-col gap-1.5 p-2 cursor-pointer"
                    aria-label="Toggle menu"
                >
                    <span className={`block w-5 h-0.5 bg-indigo-600 transition-all duration-200 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-indigo-600 transition-all duration-200 ${menuOpen ? 'opacity-0' : ''}`} />
                    <span className={`block w-5 h-0.5 bg-indigo-600 transition-all duration-200 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-neutral-100 bg-white px-4 py-4 flex flex-col gap-4">
                    {navLinks.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setMenuOpen(false)}
                            className={`text-sm ${location.pathname === link.to
                                    ? 'text-neutral-900 font-medium'
                                    : 'text-neutral-400'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {user?.role === 'admin' && (
                        <Link
                            to="/admin/orders"
                            onClick={() => setMenuOpen(false)}
                            className="text-sm text-neutral-400"
                        >
                            Admin
                        </Link>
                    )}

                    {token ? (
                        <button
                            onClick={() => { handleLogout(); setMenuOpen(false) }}
                            className="text-sm w-full py-2.5 rounded-xl bg-indigo-600 text-white cursor-pointer"
                        >
                            Logout
                        </button>
                    ) : (
                        <div className="flex flex-col gap-2 pt-2 border-t border-neutral-100">
                            <Link
                                to="/login"
                                onClick={() => setMenuOpen(false)}
                                className="text-sm text-center py-2.5 rounded-xl border border-neutral-200 text-indigo-600"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                onClick={() => setMenuOpen(false)}
                                className="text-sm text-center py-2.5 rounded-xl bg-indigo-600 text-white"
                            >
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    )
}

export default Navbar