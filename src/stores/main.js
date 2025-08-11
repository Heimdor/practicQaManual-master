import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useMainStore = defineStore('main', () => {
  const products = ref([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 999,
      image: '/icons/favicon-96x96.png',
      category: 'electronics',
      stock: 10,
    },
    {
      id: 2,
      name: 'Samsung Galaxy S24',
      price: 899,
      image: '/icons/favicon-96x96.png',
      category: 'electronics',
      stock: 5,
    },
    {
      id: 3,
      name: 'MacBook Air M3',
      price: 1299,
      image: '/icons/favicon-96x96.png',
      category: 'electronics',
      stock: 3,
    },
    {
      id: 4,
      name: 'Nike Air Max',
      price: 150,
      image: '/icons/favicon-96x96.png',
      category: 'shoes',
      stock: 20,
    },
    {
      id: 5,
      name: 'Adidas Ultraboost',
      price: 180,
      image: '/icons/favicon-96x96.png',
      category: 'shoes',
      stock: 0,
    },
  ])

  // Hotels state
  const hotels = ref([
    {
      id: 1,
      name: 'Grand Hotel Moscow',
      price: 250,
      rating: 4.8,
      image: '/icons/favicon-96x96.png',
      city: 'Moscow',
      available: true,
      rooms: 15,
    },
    {
      id: 2,
      name: 'Hotel St. Petersburg',
      price: 200,
      rating: 4.5,
      image: '/icons/favicon-96x96.png',
      city: 'St. Petersburg',
      available: true,
      rooms: 8,
    },
    {
      id: 3,
      name: 'Sochi Resort',
      price: 180,
      rating: 4.2,
      image: '/icons/favicon-96x96.png',
      city: 'Sochi',
      available: false,
      rooms: 0,
    },
  ])

  // Cart state
  const cart = ref([])
  const bookings = ref([])

  // User state
  const user = ref({
    isLoggedIn: false,
    name: '',
    email: '',
    phone: '',
  })

  // Computed
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + item.price * item.quantity, 0)
  })

  const cartItemsCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0)
  })

  // Actions
  function addToCart(product) {
    const existingItem = cart.value.find((item) => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
  }

  function removeFromCart(productId) {
    const index = cart.value.findIndex((item) => item.id === productId)
    if (index > -1) {
      cart.value.splice(index, 1)
    }
  }

  function updateCartQuantity(productId, quantity) {
    const item = cart.value.find((item) => item.id === productId)
    if (item) {
      item.quantity = quantity
      if (quantity <= 0) {
        removeFromCart(productId)
      }
    }
  }

  function clearCart() {
    cart.value = []
  }

  function login(userData) {
    user.value = {
      isLoggedIn: true,
      ...userData,
    }
  }

  function logout() {
    user.value = {
      isLoggedIn: false,
      name: '',
      email: '',
      phone: '',
    }
    // Bug: cart should be cleared on logout but isn't
  }

  function bookHotel(hotelData) {
    const booking = {
      id: Date.now(),
      hotelId: hotelData.hotelId,
      hotelName: hotelData.hotelName,
      checkIn: hotelData.checkIn,
      checkOut: hotelData.checkOut,
      guests: hotelData.guests,
      totalPrice: hotelData.totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    }
    bookings.value.push(booking)

    // Bug: hotel availability not updated after booking
    return booking
  }

  function cancelBooking(bookingId) {
    const index = bookings.value.findIndex((b) => b.id === bookingId)
    if (index > -1) {
      bookings.value.splice(index, 1)
      // Bug: cancellation doesn't restore hotel availability
    }
  }

  return {
    products,
    hotels,
    cart,
    bookings,
    user,
    cartTotal,
    cartItemsCount,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    login,
    logout,
    bookHotel,
    cancelBooking,
  }
})
