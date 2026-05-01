import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const ProductDetail = () => {
    const { id } = useParams()
    const [product, setProduct] = useState(null)
    const [added, setAdded] = useState(false)
    const [qty, setQty] = useState(1)
    const [toast, setToast] = useState('')
    const token = localStorage.getItem('token')
    const navigate = useNavigate()

    useEffect(() => {
        fetch(`http://localhost:5000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setProduct(data))
    }, [id])

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || []
        const exists = cart.find(item => item._id === product._id)

        const updatedCart = exists
            ? cart.map(item =>
                item._id === product._id
                    ? { ...item, qty: item.qty + qty }
                    : item
            )
            : [...cart, { ...product, qty }]

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)

        setToast(`${product.name} added to cart`)
        setTimeout(() => setToast(''), 2500)
    }

    if (!product) return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 rounded-full border-2 border-neutral-300 border-t-neutral-900 animate-spin" />
                <p className="text-sm text-neutral-400">Loading product...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-neutral-50">

            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg transition-all duration-300">
                    {toast}
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-900 transition-colors duration-150 mb-8 cursor-pointer"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    Back
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">

                    <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col justify-center gap-6">

                        <div>
                            <p className="text-xs font-medium text-neutral-400 uppercase tracking-widest mb-2">Product</p>
                            <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight leading-snug">
                                {product.name}
                            </h1>
                            <p className="text-2xl font-semibold text-neutral-900 mt-3">
                                ${Number(product.price).toFixed(2)}
                            </p>
                        </div>

                        <div className="border-t border-neutral-200 pt-5">
                            <p className="text-sm text-neutral-500 leading-relaxed">{product.description}</p>
                        </div>

                        <div className="flex items-center gap-3">
                            <p className="text-sm text-neutral-400">Quantity</p>
                            <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-white">
                                <button
                                    onClick={() => setQty(q => Math.max(1, q - 1))}
                                    className="px-4 py-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors duration-150 text-lg cursor-pointer"
                                >
                                    −
                                </button>
                                <span className="px-4 py-2.5 text-sm font-medium text-neutral-900 min-w-8 text-center border-x border-neutral-200">
                                    {qty}
                                </span>
                                <button
                                    onClick={() => setQty(q => q + 1)}
                                    className="px-4 py-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 transition-colors duration-150 text-lg cursor-pointer"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={addToCart}
                                className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                                    added
                                        ? 'bg-neutral-100 text-neutral-500'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {added ? 'Added to cart' : 'Add to cart'}
                            </button>
                            <button
                                onClick={() => { addToCart(); navigate('/cart') }}
                                className="flex-1 py-3 rounded-xl text-sm font-medium border border-neutral-200 text-neutral-900 hover:bg-neutral-100 transition-colors duration-150 cursor-pointer"
                            >
                                Buy now
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail