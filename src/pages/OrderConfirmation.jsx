import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

const OrderConfirmation = () => {
    const { id } = useParams()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('token')
        fetch(`${import.meta.env.VITE_API_URL}/api/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setOrder(data)
                setLoading(false)
            })
    }, [id])

    if (loading) return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
                <p className="text-sm text-neutral-400">Loading your order...</p>
            </div>
        </div>
    )

    if (!order) return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <p className="text-sm text-neutral-400">Order not found.</p>
        </div>
    )

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

                {/* Success banner */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 mb-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-base font-semibold text-neutral-900">Order placed successfully</h1>
                        <p className="text-sm text-neutral-400 mt-0.5">
                            Order ID: <span className="font-mono text-neutral-600">{order._id}</span>
                        </p>
                        <p className="text-sm text-neutral-400 mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                    {/* Left: Items + Shipping */}
                    <div className="md:col-span-2 flex flex-col gap-5">

                        {/* Status badges */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white border border-neutral-200 rounded-2xl p-4">
                                <p className="text-xs text-neutral-400 mb-1.5">Payment</p>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                                    order.isPaid
                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                                }`}>
                                    {order.isPaid ? 'Paid' : 'Pending'}
                                </span>
                            </div>
                            <div className="bg-white border border-neutral-200 rounded-2xl p-4">
                                <p className="text-xs text-neutral-400 mb-1.5">Delivery</p>
                                <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${
                                    order.isDelivered
                                        ? 'bg-green-50 text-green-600 border border-green-100'
                                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                                }`}>
                                    {order.isDelivered ? 'Delivered' : 'Processing'}
                                </span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
                            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Items ordered</h2>
                            <div className="flex flex-col divide-y divide-neutral-100">
                                {order.orderItems.map(item => (
                                    <div key={item._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                                        <div className="w-12 h-12 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                                            <p className="text-xs text-neutral-400 mt-0.5">Qty: {item.qty}</p>
                                        </div>
                                        <p className="text-sm font-medium text-neutral-900 shrink-0">
                                            ${(Number(item.price) * Number(item.qty)).toFixed(2)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping address */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-5">
                            <h2 className="text-sm font-semibold text-neutral-900 mb-3">Shipping address</h2>
                            <div className="text-sm text-neutral-500 leading-relaxed">
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                <p>{order.shippingAddress.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Summary */}
                    <div className="md:col-span-1">
                        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sticky top-24">
                            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Order summary</h2>

                            <div className="flex flex-col gap-2.5 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span>${Number(order.itemsPrice).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Shipping</span>
                                    <span className={Number(order.shippingPrice) === 0 ? 'text-green-600' : ''}>
                                        {Number(order.shippingPrice) === 0 ? 'Free' : `$${Number(order.shippingPrice).toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Tax</span>
                                    <span>${Number(order.taxPrice).toFixed(2)}</span>
                                </div>
                                <div className="border-t border-neutral-100 mt-1 pt-3 flex justify-between font-semibold text-neutral-900">
                                    <span>Total</span>
                                    <span>${Number(order.totalPrice).toFixed(2)}</span>
                                </div>
                            </div>

                            <Link
                                to="/myorders"
                                className="mt-5 block text-center w-full py-3 rounded-xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-700 transition-colors duration-150"
                            >
                                View all orders
                            </Link>
                            <Link
                                to="/"
                                className="mt-2 block text-center w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-sm hover:bg-neutral-50 transition-colors duration-150"
                            >
                                Continue shopping
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default OrderConfirmation