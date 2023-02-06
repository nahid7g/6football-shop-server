import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import stripe from 'stripe'

const stripeGateway = stripe(
  'sk_test_51MUixuK69RZsC2jNOVoWUbq3Tpa6h9dCzZBXAdW38blnzAgdEwunj7lzgfpumz6TCfdUYXU3sTfVzstSw9HbEKFT00L3Wo3iIa'
)

const app = express()
dotenv.config()

connectDB()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Api is running')
})
app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.post('/create-payment-intent', async (req, res) => {
  const order = req.body
  const price = order.price
  const amount = price * 100
  const paymentIntent = await stripeGateway.paymentIntents.create({
    currency: 'usd',
    amount: amount,
    payment_method_types: ['card'],
  })
  res.send({
    clientSecret: paymentIntent.client_secret,
  })
})

app.use(notFound)

app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Express is running from Port: ${PORT}`)
})
