const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/shop', component: () => import('pages/ShopPage.vue') },
      { path: '/hotels', component: () => import('pages/HotelsPage.vue') },
      { path: '/cart', component: () => import('pages/CartPage.vue') },
      { path: '/checkout', component: () => import('pages/CheckoutPage.vue') },
      { path: '/profile', component: () => import('pages/ProfilePage.vue') },
      { path: '/bookings', component: () => import('pages/BookingsPage.vue') },
      { path: '/login', component: () => import('pages/LoginPage.vue') },
      { path: '/about', component: () => import('pages/AboutPage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
