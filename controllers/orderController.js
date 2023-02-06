import asyncHandler from 'express-async-handler'
import Order from '../models/orderModel.js'
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

// @@ Create New Orders
// @@ Post orders "api/orders"
// @@ Access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  if (orderItems && orderItems.length === 0) {
    res.status(400)
    throw new Error('No order Items')
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      createdAt: Date.now(),
    })
    const createdOrder = await order.save()
    res.status(201).json(createdOrder)
  }
})

// @@ Get order by id
// @@ Post orders "api/orders:id"
// @@ Access Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  )
  if (order) {
    res.json(order)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @@ Update order to paid
// @@ Post orders "api/orders/:id/pay"
// @@ Access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  if (order) {
    order.isPaid = true
    order.paidAt = Date.now()
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    }
    const updatedOrder = order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @@ Update order to Delivered
// @@ Post orders "api/orders/:id/deliver"
// @@ Access Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
  console.log(order)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    const updatedOrder = order.save()
    res.json(updatedOrder)
  } else {
    res.status(404)
    throw new Error('Order not found')
  }
})

// @@ Get logged in users orders
// @@ Post orders "api/orders/myorders"
// @@ Access Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
  res.send(orders)
})

// @@ Get All orders
// @@ Post orders "api/orders"
// @@ Access Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name')
  res.send(orders)
})

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
}
