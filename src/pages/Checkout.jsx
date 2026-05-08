import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)


const CheckoutForm = () => {
    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()

    const [shipping, setShipping] = useState({ address: '', city: '', postalCode: '', country: '' })
    const [placing, setPlacing] = useState(false)
    const [errors, setErrors] = useState({})

    const [cartItems, setCartItems] = useState(
        JSON.parse(localStorage.getItem('cart')) || []
    )

    const itemsPrice = cartItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty || 1), 0)
    const shippingPrice = itemsPrice > 100 ? 0 : 10
    const taxPrice = parseFloat((0.15 * itemsPrice).toFixed(2))
    const totalPrice = itemsPrice + shippingPrice + taxPrice

    useEffect(() => {
        if (cartItems.length === 0) navigate('/cart')
    }, [cartItems])

    const validate = () => {
        const newErrors = {}
        if (!shipping.address.trim()) newErrors.address = 'Address is required'
        if (!shipping.city.trim()) newErrors.city = 'City is required'
        if (!shipping.postalCode.trim()) newErrors.postalCode = 'Postal code is required'
        if (!shipping.country.trim()) newErrors.country = 'Country is required'
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handlePlaceOrder = async () => {
        if (placing) return
        if (!validate()) return
        if (!stripe || !elements) return
        setPlacing(true)

        const token = localStorage.getItem('token')

        try {
        
            const intentRes = await fetch(`${import.meta.env.VITE_API_URL}/api/payments/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ amount: Math.round(totalPrice * 100) }) // Stripe expects cents
            })

            const { clientSecret } = await intentRes.json()

          
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                }
            })

            if (result.error) {
                alert(result.error.message)
                setPlacing(false)
                return
            }

          
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderItems: cartItems.map(item => ({
                        product: item._id,
                        name: item.name,
                        qty: item.qty || 1,
                        image: item.image,
                        price: item.price
                    })),
                    shippingAddress: shipping,
                    paymentMethod: 'Stripe',
                    itemsPrice,
                    shippingPrice,
                    taxPrice,
                    totalPrice,
                    paymentIntentId: result.paymentIntent.id
                })
            })

            const data = await res.json()
            if (data._id) {
                localStorage.removeItem('cart')
                navigate(`/order/${data._id}`)
            }
        } catch (err) {
            console.error(err)
            setPlacing(false)
        }
    }

    const inputClass = (field) =>
        `w-full px-4 py-3 rounded-xl border text-sm text-neutral-800 placeholder:text-neutral-400 bg-neutral-50 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-150 ${
            errors[field]
                ? 'border-red-300 focus:ring-red-400'
                : 'border-neutral-200 focus:ring-neutral-900'
        }`

    return (
        <div className="min-h-screen bg-neutral-50">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">Checkout</h1>
                    <p className="text-sm text-neutral-400 mt-1">Fill in your shipping details to place your order</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left: Shipping + Card + Items */}
                    <div className="lg:col-span-2 flex flex-col gap-5">

                        {/* Shipping form */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-neutral-900 mb-5">Shipping address</h2>
                            <div className="flex flex-col gap-3">
                                <div>
                                    <input
                                        placeholder="Street address"
                                        onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                                        className={inputClass('address')}
                                    />
                                    {errors.address && <p className="text-xs text-red-400 mt-1 ml-1">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            placeholder="City"
                                            onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                            className={inputClass('city')}
                                        />
                                        {errors.city && <p className="text-xs text-red-400 mt-1 ml-1">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <input
                                            placeholder="Postal code"
                                            onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                                            className={inputClass('postalCode')}
                                        />
                                        {errors.postalCode && <p className="text-xs text-red-400 mt-1 ml-1">{errors.postalCode}</p>}
                                    </div>
                                </div>

                                <div>
                                    <input
                                        placeholder="Country"
                                        onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                                        className={inputClass('country')}
                                    />
                                    {errors.country && <p className="text-xs text-red-400 mt-1 ml-1">{errors.country}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Card details — NEW */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-neutral-900 mb-5">Card details</h2>
                            <div className="px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50">
                                <CardElement
                                    options={{
                                        style: {
                                            base: {
                                                fontSize: '14px',
                                                color: '#171717',
                                                '::placeholder': { color: '#a3a3a3' }
                                            },
                                            invalid: { color: '#f87171' }
                                        }
                                    }}
                                />
                            </div>
                            <p className="text-xs text-neutral-400 mt-3">
                                Test card: 4242 4242 4242 4242 — any future date — any CVC
                            </p>
                        </div>

                        {/* Order items */}
                        <div className="bg-white border border-neutral-200 rounded-2xl p-6">
                            <h2 className="text-sm font-semibold text-neutral-900 mb-5">
                                Order items
                                <span className="text-neutral-400 font-normal ml-2">({cartItems.length})</span>
                            </h2>
                            <div className="flex flex-col divide-y divide-neutral-100">
                                {cartItems.map(item => (
                                    <div key={item._id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                                        <div className="w-14 h-14 rounded-xl bg-neutral-100 overflow-hidden border border-neutral-100 shrink-0">
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
                    </div>

                    {/* Right: Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white border border-neutral-200 rounded-2xl p-5 sticky top-24">
                            <h2 className="text-sm font-semibold text-neutral-900 mb-4">Order summary</h2>

                            <div className="flex flex-col gap-2.5 text-sm">
                                <div className="flex justify-between text-neutral-500">
                                    <span>Subtotal</span>
                                    <span>${itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Shipping</span>
                                    <span className={shippingPrice === 0 ? 'text-green-600' : ''}>
                                        {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-neutral-500">
                                    <span>Tax (15%)</span>
                                    <span>${taxPrice.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-neutral-100 mt-1 pt-3 flex justify-between font-semibold text-neutral-900">
                                    <span>Total</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                            </div>

                            {itemsPrice <= 100 && (
                                <p className="text-xs text-neutral-400 mt-3 bg-neutral-50 rounded-xl px-3 py-2.5 border border-neutral-100">
                                    Add ${(100 - itemsPrice).toFixed(2)} more to get free shipping
                                </p>
                            )}

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing}
                                className={`mt-5 w-full py-3 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer ${
                                    placing
                                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {placing ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
                                        Placing order...
                                    </span>
                                ) : 'Place order'}
                            </button>

                            <p className="text-xs text-neutral-400 text-center mt-3">
                                Secured by Stripe
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

const Checkout = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    )
}

export default Checkout