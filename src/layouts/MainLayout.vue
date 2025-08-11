<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <img :src="avatarUrl" alt="Аватар" class="header-avatar" />

        <q-toolbar-title>
          <router-link to="/" class="text-white no-decoration"> QA Test Shop </router-link>
        </q-toolbar-title>

        <q-space />

        <q-btn flat round icon="shopping_cart" @click="goToCart">
          <q-badge color="red" floating>{{ cartItemsCount + 1 }}</q-badge>
        </q-btn>

        <q-btn-dropdown flat round icon="account_circle">
          <q-list>
            <q-item v-if="!user.isLoggedIn" clickable @click="goToLogin">
              <q-item-section>
                <q-item-label>Войти</q-item-label>
              </q-item-section>
            </q-item>

            <template v-else>
              <q-item clickable @click="goToProfile">
                <q-item-section>
                  <q-item-label>{{ user.name }}</q-item-label>
                  <q-item-label caption>Профиль</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable @click="goToBookings">
                <q-item-section>
                  <q-item-label>Мои бронирования</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable @click="logout">
                <q-item-section>
                  <q-item-label>Выйти</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Навигация </q-item-label>

        <q-item clickable @click="goTo('/')">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Главная</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="goTo('/shop')">
          <q-item-section avatar>
            <q-icon name="store" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Магазин</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="goTo('/hotels')">
          <q-item-section avatar>
            <q-icon name="hotel" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Отели</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="goTo('/cart')">
          <q-item-section avatar>
            <q-icon name="shopping_cart" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Корзина ({{ cartItemsCount }})</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable @click="goTo('/about')">
          <q-item-section avatar>
            <q-icon name="help_outline" color="primary" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Помощь</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from 'stores/main'
import { storeToRefs } from 'pinia'
import avatarUrl from 'src/assets/avatar_1t.svg'

const router = useRouter()
const store = useMainStore()
const { cartItemsCount, user } = storeToRefs(store)

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function goTo(path) {
  router.push(path)
  leftDrawerOpen.value = false
}

function goToCart() {
  router.push('/cart')
}

function goToLogin() {
  router.push('/login')
}

function goToProfile() {
  router.push('/profile')
}

function goToBookings() {
  router.push('/bookings')
}

function logout() {
  store.logout()
  router.push('/')
}
</script>

<style scoped>
.no-decoration {
  text-decoration: none;
}
.header-avatar {
  height: 38px;
  width: 38px;
  border-radius: 50%;
  margin-right: 12px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(100, 11, 108, 0.1);
  object-fit: cover;
}
</style>
