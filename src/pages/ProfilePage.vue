<template>
    <q-page class="q-pa-lg">
        <div class="row justify-center">
            <div class="col-12 col-md-8">
                <h4 class="q-mb-lg">Профиль пользователя</h4>

                <div v-if="!user.isLoggedIn" class="text-center q-mt-xl">
                    <q-icon name="account_circle" size="4rem" color="grey-5" />
                    <p class="text-h6 text-grey-6 q-mt-md">
                        Войдите в систему для просмотра профиля
                    </p>
                    <q-btn color="primary" label="Войти" @click="goToLogin" />
                </div>

                <div v-else>
                    <q-card class="q-mb-lg">
                        <q-card-section>
                            <div class="text-h6 q-mb-md">Личная информация</div>

                            <q-form class="q-gutter-md">
                                <q-input v-model="profileForm.name" label="Имя" :readonly="!editing" :outlined="editing"
                                    :standout="!editing" />

                                <q-input v-model="profileForm.email" label="Email" type="email" :readonly="!editing"
                                    :outlined="editing" :standout="!editing" />

                                <q-input v-model="profileForm.phone" label="Телефон" mask="# (###) ###-##-##"
                                    :readonly="!editing" :outlined="editing" :standout="!editing" />

                                <div class="q-mt-md">
                                    <q-btn v-if="!editing" color="primary" label="Редактировать" icon="edit"
                                        @click="startEditing" />

                                    <div v-else class="q-gutter-sm">
                                        <q-btn color="positive" label="Сохранить" icon="save" @click="saveProfile"
                                            :loading="saving" />
                                        <q-btn flat color="grey" label="Отмена" @click="cancelEditing" />
                                    </div>
                                </div>
                            </q-form>
                        </q-card-section>
                    </q-card>

                    <!-- Statistics -->
                    <div class="row q-col-gutter-md q-mb-lg">
                        <div class="col-6 col-md-3">
                            <q-card class="text-center">
                                <q-card-section>
                                    <div class="text-h4 text-primary">{{ cart.length }}</div>
                                    <div class="text-grey-7">Товаров в корзине</div>
                                </q-card-section>
                            </q-card>
                        </div>

                        <div class="col-6 col-md-3">
                            <q-card class="text-center">
                                <q-card-section>
                                    <div class="text-h4 text-secondary">{{ bookings.length }}</div>
                                    <div class="text-grey-7">Бронирований</div>
                                </q-card-section>
                            </q-card>
                        </div>

                        <div class="col-6 col-md-3">
                            <q-card class="text-center">
                                <q-card-section>
                                    <div class="text-h4 text-accent">${{ cartTotal.toFixed(2) }}</div>
                                    <div class="text-grey-7">Сумма в корзине</div>
                                </q-card-section>
                            </q-card>
                        </div>

                        <div class="col-6 col-md-3">
                            <q-card class="text-center">
                                <q-card-section>
                                    <!-- Bug: shows random number instead of actual orders -->
                                    <div class="text-h4 text-positive">{{ Math.floor(Math.random() * 10) }}</div>
                                    <div class="text-grey-7">Заказов</div>
                                </q-card-section>
                            </q-card>
                        </div>
                    </div>

                    <!-- Quick actions -->
                    <q-card>
                        <q-card-section>
                            <div class="text-h6 q-mb-md">Быстрые действия</div>

                            <div class="row q-gutter-md">
                                <q-btn color="primary" label="Перейти к покупкам" icon="store" @click="goToShop" />

                                <q-btn color="secondary" label="Мои бронирования" icon="hotel" @click="goToBookings" />

                                <q-btn color="accent" label="Корзина" icon="shopping_cart" @click="goToCart" />

                                <q-btn flat color="negative" label="Выйти" icon="logout" @click="confirmLogout" />
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>

        <!-- Logout confirmation dialog -->
        <q-dialog v-model="showLogoutDialog">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Подтверждение</div>
                </q-card-section>

                <q-card-section>
                    Вы уверены, что хотите выйти из системы?
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Отмена" color="grey" v-close-popup />
                    <q-btn label="Выйти" color="negative" @click="logout" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from 'stores/main'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const router = useRouter()
const store = useMainStore()
const { user, cart, cartTotal, bookings } = storeToRefs(store)

const editing = ref(false)
const saving = ref(false)
const showLogoutDialog = ref(false)

const profileForm = reactive({
    name: '',
    email: '',
    phone: ''
})

// Watch for user changes to populate form
watch(user, (newUser) => {
    if (newUser.isLoggedIn) {
        Object.assign(profileForm, {
            name: newUser.name,
            email: newUser.email,
            phone: newUser.phone
        })
    }
}, { immediate: true })

function goToLogin() {
    router.push('/login')
}

function goToShop() {
    router.push('/shop')
}

function goToBookings() {
    router.push('/bookings')
}

function goToCart() {
    router.push('/cart')
}

function startEditing() {
    editing.value = true
}

function cancelEditing() {
    editing.value = false
    // Reset form to original values
    Object.assign(profileForm, {
        name: user.value.name,
        email: user.value.email,
        phone: user.value.phone
    })
}

async function saveProfile() {
    saving.value = true

    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Bug: doesn't validate email format before saving
        store.login(profileForm)

        editing.value = false

        $q.notify({
            type: 'positive',
            message: 'Профиль успешно обновлен!',
            position: 'top'
        })
    } catch {
        $q.notify({
            type: 'negative',
            message: 'Ошибка при сохранении профиля',
            position: 'top'
        })
    } finally {
        saving.value = false
    }
}

function confirmLogout() {
    showLogoutDialog.value = true
}

function logout() {
    store.logout()
    showLogoutDialog.value = false

    $q.notify({
        type: 'info',
        message: 'Вы вышли из системы',
        position: 'top'
    })

    router.push('/')
}
</script>