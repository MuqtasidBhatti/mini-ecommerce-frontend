import { useState, useEffect } from 'react'

const AdminOrders = () => {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [delivering, setDelivering] = useState(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch('http://localhost:5000/api/orders', {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrders(Array.isArray(data) ? data : [])
                setLoading(false)
            })
    }, [])

    const markDelivered = async (id) => {
        if (delivering) return
        setDelivering(id)
        const token = localStorage.getItem('token')
        try {
            const res = await fetch(`http://localhost:5000/api/orders/${id}/deliver`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data._id) {
                setOrders(prev =>
                    prev.map(order =>
                        order._id === id
                            ? { ...order, isDelivered: true, deliveredAt: data.deliveredAt, isPaid: true, paidAt: data.paidAt }
                            : order
                    )
                )
            }
        } catch (err) {
            console.error(err)
        } finally {
            setDelivering(null)
        }
    }

    if (loading) return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
                <p className="text-sm text-neutral-400">Loading orders...</p>
            </div>
        </div>
    )

    const totalRevenue = orders
        .filter(o => o.isPaid)
        .reduce((acc, o) => acc + Number(o.totalPrice), 0)

    const pendingCount = orders.filter(o => !o.isDelivered).length
    const deliveredCount = orders.filter(o => o.isDelivered).length

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Admin Orders</h1>
                    <p className="text-sm text-neutral-400 mt-1">{orders.length} total orders</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
                        <p className="text-xs text-neutral-400 mb-1">Revenue</p>
                        <p className="text-xl font-semibold text-neutral-900">${totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-2xl p-4">
                        <p className="text-xs text-neutral-400 mb-1">Processing</p>
                        <p className="text-xl font-semibold text-neutral-900">{pendingCount}</p>
                    </div>
                    <div className="bg-white border border-neutral-200 rounded-2xl p-4 col-span-2 sm:col-span-1">
                        <p className="text-xs text-neutral-400 mb-1">Delivered</p>
                        <p className="text-xl font-semibold text-neutral-900">{deliveredCount}</p>
                    </div>
                </div>

                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-3 text-center">
                        <p className="text-sm font-medium text-neutral-700">No orders yet</p>
                        <p className="text-sm text-neutral-400">Orders will appear here once customers start buying</p>
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden sm:block bg-white border border-neutral-200 rounded-2xl overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-neutral-100">
                                        <th className="text-left text-xs font-medium text-neutral-400 px-5 py-3.5">Order ID</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-5 py-3.5">Date</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-5 py-3.5">Customer</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-5 py-3.5">Total</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-5 py-3.5">Payment</th>
                                        <th className="text-left text-xs font-medium text-neutral-400 px-5 py-3.5">Delivery</th>
                                        <th className="px-5 py-3.5" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {orders.map(order => (
                                        <tr key={order._id} className="hover:bg-neutral-50 transition-colors duration-100">
                                            <td className="px-5 py-3.5">
                                                <span className="font-mono text-xs text-neutral-400 truncate block max-w-30">
                                                    #{order._id}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-neutral-500 whitespace-nowrap">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-5 py-3.5 text-neutral-800 font-medium">
                                                {order.user?.name || 'Unknown'}
                                            </td>
                                            <td className="px-5 py-3.5 text-neutral-900 font-semibold whitespace-nowrap">
                                                ${Number(order.totalPrice).toFixed(2)}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${order.isPaid
                                                        ? 'bg-green-50 text-green-600 border-green-100'
                                                        : 'bg-amber-50 text-amber-600 border-amber-100'
                                                    }`}>
                                                    {order.isPaid ? 'Paid' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${order.isDelivered
                                                        ? 'bg-green-50 text-green-600 border-green-100'
                                                        : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {order.isDelivered ? 'Delivered' : 'Processing'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-right">
                                                {!order.isDelivered && (
                                                    <button
                                                        onClick={() => markDelivered(order._id)}
                                                        disabled={delivering === order._id}
                                                        className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition-all duration-150 cursor-pointer whitespace-nowrap ${delivering === order._id
                                                                ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                                                                : 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-700'
                                                            }`}
                                                    >
                                                        {delivering === order._id ? 'Updating...' : 'Mark delivered'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="sm:hidden flex flex-col gap-3">
                            {orders.map(order => (
                                <div key={order._id} className="bg-white border border-neutral-200 rounded-2xl p-4">
                                    <div className="flex items-start justify-between gap-2 mb-3">
                                        <div>
                                            <p className="font-mono text-xs text-neutral-400">#{order._id.slice(-8)}</p>
                                            <p className="text-sm font-semibold text-neutral-900 mt-0.5">{order.user?.name || 'Unknown'}</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <p className="text-base font-semibold text-neutral-900">${Number(order.totalPrice).toFixed(2)}</p>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${order.isPaid
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : 'bg-amber-50 text-amber-600 border-amber-100'
                                                }`}>
                                                {order.isPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border ${order.isDelivered
                                                    ? 'bg-green-50 text-green-600 border-green-100'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                                }`}>
                                                {order.isDelivered ? 'Delivered' : 'Processing'}
                                            </span>
                                        </div>
                                        {!order.isDelivered && (
                                            <button
                                                onClick={() => markDelivered(order._id)}
                                                disabled={delivering === order._id}
                                                className={`text-xs font-medium px-3 py-2 rounded-xl border transition-colors duration-150 cursor-pointer ${delivering === order._id
                                                        ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                                                        : 'bg-neutral-900 text-white border-neutral-900 hover:bg-neutral-700'
                                                    }`}
                                            >
                                                {delivering === order._id ? 'Updating...' : 'Mark delivered'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

export default AdminOrders