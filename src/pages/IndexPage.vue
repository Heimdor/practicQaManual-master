<template>
  <q-page class="flex flex-center">
    <div class="q-pa-lg" style="max-width: 1200px;">
      <!-- Hero Section -->
      <div class="text-center q-mb-xl">
        <h1 class="text-h2 text-weight-bold q-mb-md">
          Добро пожаловать в QA Test Shop
        </h1>
        <p class="text-h6 text-grey-7 q-mb-lg">
          Интернет-магазин и бронирование отелей для тестирования QA навыков
        </p>

        <div class="row q-gutter-md justify-center">
          <q-btn size="lg" color="primary" label="Начать покупки" icon="store" @click="goToShop" />
          <q-btn size="lg" color="secondary" label="Забронировать отель" icon="hotel" @click="goToHotels" />
        </div>
      </div>

      <!-- Features -->
      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-4">
          <q-card class="full-height">
            <q-card-section class="text-center">
              <q-icon name="store" size="4rem" color="primary" />
              <h5 class="q-mt-md q-mb-sm">Интернет-магазин</h5>
              <p class="text-grey-7">
                Широкий ассортимент товаров с удобной корзиной и оформлением заказов
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card class="full-height">
            <q-card-section class="text-center">
              <q-icon name="hotel" size="4rem" color="secondary" />
              <h5 class="q-mt-md q-mb-sm">Бронирование отелей</h5>
              <p class="text-grey-7">
                Система бронирования номеров в отелях с выбором дат и количества гостей
              </p>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-4">
          <q-card class="full-height">
            <q-card-section class="text-center">
              <q-icon name="account_circle" size="4rem" color="accent" />
              <h5 class="q-mt-md q-mb-sm">Личный кабинет</h5>
              <p class="text-grey-7">
                Управление профилем, история заказов и бронирований
              </p>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- Stats -->
      <div class="row q-col-gutter-md q-mt-xl">
        <div class="col-6 col-md-3 text-center">
          <div class="text-h4 text-weight-bold text-primary">{{ products.length }}</div>
          <div class="text-grey-7">Товаров</div>
        </div>
        <div class="col-6 col-md-3 text-center">
          <div class="text-h4 text-weight-bold text-secondary">{{ hotels.length }}</div>
          <div class="text-grey-7">Отелей</div>
        </div>
        <div class="col-6 col-md-3 text-center">
          <div class="text-h4 text-weight-bold text-accent">{{ cartItemsCount }}</div>
          <div class="text-grey-7">В корзине</div>
        </div>
        <div class="col-6 col-md-3 text-center">
          <div class="text-h4 text-weight-bold text-positive">{{ bookings.length }}</div>
          <div class="text-grey-7">Бронирований</div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useMainStore } from 'stores/main'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useMainStore()
const { products, hotels, cartItemsCount, bookings } = storeToRefs(store)

function goToShop() {
  router.push('/shop')
}

function goToHotels() {
  router.push('/hotels')
}
</script>
