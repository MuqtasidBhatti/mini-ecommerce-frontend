import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const MyOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expandedId, setExpandedId] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/myorders`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : [])
                setLoading(false)
            })
    }, [])

    if (loading) return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
                <p className="text-sm text-neutral-400">Loading your orders...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">My Orders</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        {orders.length === 0 ? 'No orders yet' : `${orders.length} order${orders.length > 1 ? 's' : ''} placed`}
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-700">No orders yet</p>
                            <p className="text-sm text-neutral-400 mt-1">Your completed orders will appear here</p>
                        </div>
                        <Link
                            to="/"
                            className="mt-2 px-6 py-2.5 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors duration-150"
                        >
                            Browse products
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {orders.map(order => {
                            const isExpanded = expandedId === order._id
                            return (
                                <div
                                    key={order._id}
                                    className="bg-white border border-neutral-200 rounded-2xl overflow-hidden"
                                >
                                    {/* Order header */}
                                    <button
                                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                                        className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 text-left">
                                            <p className="text-xs font-mono text-neutral-400 truncate max-w-35 sm:max-w-none">
                                                #{order._id}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                            <p className="text-sm font-semibold text-neutral-900">
                                                ${Number(order.totalPrice).toFixed(2)}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2 shrink-0">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                                                order.isDelivered
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </button>

                                    {/* Expanded details */}
                                    {isExpanded && (
                                        <div className="border-t border-neutral-100 px-5 py-4">

                                            {/* Items */}
                                            <div className="flex flex-col gap-3 mb-4">
                                                {order.orderItems.map(item => (
                                                    <div key={item._id} className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-100 shrink-0">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-sm text-neutral-800 truncate">{item.name}</p>
                                                            <p className="text-xs text-neutral-400">Qty: {item.qty}</p>
                                                        </div>
                                                        <p className="text-sm font-medium text-neutral-900 shrink-0">
                                                            ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Meta row */}
                                            <div className="border-t border-neutral-100 pt-3 flex flex-wrap gap-4 justify-between items-center">
                                                <div className="flex gap-3">
                                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${
                                                        order.isPaid
                                                            ? 'bg-green-50 text-green-600 border-green-100'
                                                            : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                        {order.isPaid ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </div>
                                                <Link
                                                    to={`/order/${order._id}`}
                                                    className="text-xs font-medium text-neutral-500 hover:text-neutral-900 underline underline-offset-2 transition-colors duration-150"
                                                >
                                                    View full details
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyOrders