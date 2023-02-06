import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @@ Desc Get all products
// @@ Get it from "api/products"
// @@ Access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({})
  res.json(products)
})

// @@ Desc Get a single product
// @@ Get it from "api/products/id"
// @@ Access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    res.json(product)
  } else {
    res.status(404).json({ message: 'Product not found' })
  }
})

// @@ Desc Delete a product
// @@ Get it from "api/products/:id"
// @@ Access Private / Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (product) {
    await product.remove()
    res.json({ message: 'Product removed successfully' })
  } else {
    res.status(404)
    throw new Error('Product Not found')
  }
})

// @@ Desc Create a product
// @@ Create it from "api/products/"
// @@ Access Private / Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: 'Sample Name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample Brand',
    category: 'Sample Category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample Description',
  })
  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @@ Desc Update a product
// @@ Put it from "api/products/:id"
// @@ Access Private / Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    brand,
    category,
    countInStock,
    numReviews,
    image,
  } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    ;(product.name = name),
      (product.price = price),
      (product.description = description),
      (product.brand = brand),
      (product.category = category),
      (product.countInStock = countInStock),
      (product.image = image)
    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Produt not found')
  }
})

// @@ Desc Create a new Review
// @@ Post it from "api/products/:id"
// @@ Access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body
  const product = await Product.findById(req.params.id)
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )
    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: Date.now(),
      user: req.user._id,
    }
    product.reviews.push(review)
    product.numReviews = product.reviews.length
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length
    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Produt not found')
  }
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
}
