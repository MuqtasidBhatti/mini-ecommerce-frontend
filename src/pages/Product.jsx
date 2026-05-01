import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Product = () => {
  const [product, setProduct] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchProductById = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`)
        const data = await res.json()
        setProduct(data)
      } catch (error) {
        console.error('Error fetching product:', error)
      }
    }

    fetchProductById()
  }, [id])

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []

    const existingItem = cart.find(item => item._id === product._id)

    let updatedCart

    if (existingItem) {
      updatedCart = cart.map(item =>
        item._id === product._id
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      )
    } else {
      updatedCart = [
        ...cart,
        {
          _id: product._id,
          name: product.name,
          image: product.image,
          price: Number(product.price),
          qty: 1
        }
      ]
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart))
    alert('Added to cart ✅')
  }

  if (!product) return <p>Loading...</p>

  return (
    <div>
      <img src={product.image} alt={product.name} width="200" />
      <h2>{product.name}</h2>
      <p>${product.price}</p>
      <p>{product.description}</p>

      <button onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  )
}

export default Product