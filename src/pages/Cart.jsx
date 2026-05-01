import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const [cartItems, setCartItems] = useState(
        JSON.parse(localStorage.getItem('cart')) || []
    )
    const navigate = useNavigate()

    const updateQty = (id, newQty) => {
        const updated = cartItems.map(item =>
            item._id === id ? { ...item, qty: Number(newQty) } : item
        )
        setCartItems(updated)
        localStorage.setItem('cart', JSON.stringify(updated))
    }

    const removeItem = (id) => {
        const updated = cartItems.filter(item => item._id !== id)
        setCartItems(updated)
        localStorage.setItem('cart', JSON.stringify(updated))
    }

    const total = cartItems.reduce(
        (acc, item) => acc + Number(item.price) * Number(item.qty), 0
    )

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Your cart</h1>
                    <p className="text-sm text-neutral-400 mt-1">
                        {cartItems.length === 0 ? 'Nothing here yet' : `${cartItems.length} item${cartItems.length > 1 ? 's' : ''}`}
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
                        <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.992-7.107a60.034 60.034 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-neutral-700">Your cart is empty</p>
                            <p className="text-sm text-neutral-400 mt-1">Add some products to get started</p>
                        </div>
                        <button
                            onClick={() => navigate('/')}
                            className="mt-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-150 cursor-pointer"
                        >
                            Browse products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Items list */}
                        <div className="lg:col-span-2 flex flex-col gap-3">
                            {cartItems.map(item => (
                                <div
                                    key={item._id}
                                    className="bg-white border border-neutral-200 rounded-2xl p-4 flex gap-4 items-start"
                                >
                                    <div className="w-20 h-20 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-100">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2">
                                            <h3 className="text-sm font-medium text-neutral-900 truncate">{item.name}</h3>
                                            <button
                                                onClick={() => removeItem(item._id)}
                                                className="text-neutral-300 hover:text-red-400 transition-colors duration-150 cursor-pointer shrink-0"
                                                aria-label="Remove item"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        <p className="text-sm text-neutral-400 mt-0.5">${Number(item.price).toFixed(2)} each</p>

                                        <div className="flex items-center justify-between mt-3">
                                            {/* Qty */}
                                            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                                                <button
                                                    onClick={() => item.qty > 1 ? updateQty(item._id, item.qty - 1) : removeItem(item._id)}
                                                    className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-150 text-base cursor-pointer"
                                                >
                                                    −
                                                </button>
                                                <span className="px-3 py-1.5 text-sm font-medium text-neutral-900 border-x border-neutral-200 min-w-8 text-center">
                                                    {item.qty}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(item._id, item.qty + 1)}
                                                    className="px-3 py-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors duration-150 text-base cursor-pointer"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <p className="text-sm font-semibold text-neutral-900">
                                                ${(Number(item.price) * item.qty).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-neutral-200 rounded-2xl p-5 sticky top-24">
                                <h2 className="text-sm font-semibold text-neutral-900 mb-4">Order summary</h2>

                                <div className="flex flex-col gap-2 text-sm">
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Subtotal</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-500">
                                        <span>Shipping</span>
                                        <span className="text-green-600">Free</span>
                                    </div>
                                    <div className="border-t border-neutral-100 mt-2 pt-3 flex justify-between font-semibold text-neutral-900">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="mt-5 w-full py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors duration-150 cursor-pointer"
                                >
                                    Proceed to checkout
                                </button>
                                <button
                                    onClick={() => navigate('/')}
                                    className="mt-2 w-full py-2.5 rounded-xl border border-neutral-200 text-neutral-600 text-sm hover:bg-neutral-50 transition-colors duration-150 cursor-pointer"
                                >
                                    Continue shopping
                                </button>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}

export default Cart