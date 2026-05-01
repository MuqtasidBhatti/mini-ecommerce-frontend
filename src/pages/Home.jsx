import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const [products, setProducts] = useState([])
    const [searchTerm, setSearchTerm] = useState('')
    const [addedMap, setAddedMap] = useState({})
    const [toast, setToast] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchProducts = async () => {
            const token = localStorage.getItem('token')
            const headers = { 'Content-Type': 'application/json' }
            if (token) headers.Authorization = `Bearer ${token}`

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
                method: 'GET',
                headers
            })
            const data = await res.json()
            if (Array.isArray(data)) setProducts(data)
        }
        fetchProducts()
    }, [])

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const addToCart = (e, product) => {
        e.preventDefault()
        const cart = JSON.parse(localStorage.getItem('cart')) || []
        const existingItem = cart.find(item => item._id === product._id)

        const updatedCart = existingItem
            ? cart.map(item =>
                item._id === product._id
                    ? { ...item, qty: (item.qty || 1) + 1 }
                    : item
            )
            : [...cart, { _id: product._id, name: product.name, image: product.image, price: Number(product.price), qty: 1 }]

        localStorage.setItem('cart', JSON.stringify(updatedCart))
        setAddedMap(prev => ({ ...prev, [product._id]: true }))
        setTimeout(() => setAddedMap(prev => ({ ...prev, [product._id]: false })), 1500)

        setToast(`${product.name} added to cart`)
        setTimeout(() => setToast(''), 2500)
    }


    return (
        <div className="min-h-screen bg-neutral-50">
            {toast && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-indigo-900 text-white text-sm px-5 py-3 rounded-xl shadow-lg transition-all duration-300">
                    {toast}
                </div>
            )}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Products</h1>
                    <p className="text-sm text-neutral-400 mt-1">{filteredProducts.length} items available</p>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search products..."
                        className="mt-4 w-full max-w-lg text-sm border border-neutral-200 rounded-xl px-4 py-2 focus:outline-none focus:border-indigo-400"
                    />
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <p className="text-neutral-400 text-sm">No products found.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <Link
                                to={`/product/${product._id}`}
                                key={product._id}
                                className="group bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-indigo-400 hover:shadow-sm transition-all duration-150"
                            >
                                <div className="aspect-square bg-neutral-100 overflow-hidden">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>

                                <div className="p-3">
                                    <h3 className="text-sm font-medium text-neutral-900 truncate">{product.name}</h3>
                                    <p className="text-sm text-neutral-400 mt-0.5">${Number(product.price).toFixed(2)}</p>

                                    <button
                                        onClick={(e) => addToCart(e, product)}
                                        className={`mt-3 w-full py-2 rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer ${addedMap[product._id]
                                            ? 'bg-neutral-100 text-neutral-500'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                            }`}
                                    >
                                        {addedMap[product._id] ? 'Added' : 'Add to cart'}
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home