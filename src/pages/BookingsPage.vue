<template>
    <q-page class="q-pa-lg">
        <div class="row justify-center">
            <div class="col-12 col-md-10">
                <h4 class="q-mb-lg">Мои бронирования</h4>

                <div v-if="!user.isLoggedIn" class="text-center q-mt-xl">
                    <q-icon name="hotel_class" size="4rem" color="grey-5" />
                    <p class="text-h6 text-grey-6 q-mt-md">
                        Войдите в систему для просмотра бронирований
                    </p>
                    <q-btn color="primary" label="Войти" @click="goToLogin" />
                </div>

                <div v-else-if="bookings.length === 0" class="text-center q-mt-xl">
                    <q-icon name="hotel_class" size="4rem" color="grey-5" />
                    <p class="text-h6 text-grey-6 q-mt-md">
                        У вас пока нет бронирований
                    </p>
                    <q-btn color="primary" label="Забронировать отель" @click="goToHotels" />
                </div>

                <div v-else>
                    <div class="row q-mb-md">
                        <div class="col">
                            <div class="text-subtitle1">
                                Всего бронирований: {{ bookings.length }}
                            </div>
                        </div>
                        <div class="col-auto">
                            <q-btn color="primary" label="Забронировать еще" icon="add" @click="goToHotels" />
                        </div>
                    </div>

                    <div class="q-gutter-md">
                        <q-card v-for="booking in sortedBookings" :key="booking.id" class="booking-card">
                            <q-card-section>
                                <div class="row">
                                    <div class="col">
                                        <div class="text-h6">{{ booking.hotelName }}</div>
                                        <div class="text-subtitle2 text-grey-7">
                                            Бронирование #{{ booking.id }}
                                        </div>
                                    </div>
                                    <div class="col-auto">
                                        <q-chip :color="getStatusColor(booking.status)" text-color="white"
                                            :label="getStatusLabel(booking.status)" />
                                    </div>
                                </div>

                                <q-separator class="q-my-md" />

                                <div class="row q-col-gutter-md">
                                    <div class="col-12 col-md-6">
                                        <div class="text-body2">
                                            <q-icon name="calendar_today" class="q-mr-sm" />
                                            <strong>Заезд:</strong> {{ formatDate(booking.checkIn) }}
                                        </div>
                                        <div class="text-body2 q-mt-sm">
                                            <q-icon name="calendar_today" class="q-mr-sm" />
                                            <strong>Выезд:</strong> {{ formatDate(booking.checkOut) }}
                                        </div>
                                        <div class="text-body2 q-mt-sm">
                                            <q-icon name="people" class="q-mr-sm" />
                                            <strong>Гостей:</strong> {{ booking.guests }}
                                        </div>
                                    </div>

                                    <div class="col-12 col-md-6">
                                        <div class="text-body2">
                                            <q-icon name="schedule" class="q-mr-sm" />
                                            <strong>Ночей:</strong> {{ calculateNights(booking.checkIn,
                                            booking.checkOut) }}
                                        </div>
                                        <div class="text-body2 q-mt-sm">
                                            <q-icon name="attach_money" class="q-mr-sm" />
                                            <strong>Общая стоимость:</strong> ${{ booking.totalPrice }}
                                        </div>
                                        <div class="text-body2 q-mt-sm text-grey-6">
                                            <q-icon name="access_time" class="q-mr-sm" />
                                            Создано: {{ formatDateTime(booking.createdAt) }}
                                        </div>
                                    </div>
                                </div>
                            </q-card-section>

                            <q-card-actions align="right">
                                <q-btn flat color="grey-7" label="Подробнее" @click="showBookingDetails(booking)" />

                                <!-- Bug: allows cancellation of past bookings -->
                                <q-btn flat color="negative" label="Отменить" @click="confirmCancellation(booking)"
                                    :disable="booking.status === 'cancelled'" />
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>

        <!-- Booking details dialog -->
        <q-dialog v-model="showDetails">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Детали бронирования</div>
                </q-card-section>

                <q-card-section v-if="selectedBooking">
                    <div class="q-gutter-sm">
                        <div><strong>Отель:</strong> {{ selectedBooking.hotelName }}</div>
                        <div><strong>Номер бронирования:</strong> #{{ selectedBooking.id }}</div>
                        <div><strong>Статус:</strong> {{ getStatusLabel(selectedBooking.status) }}</div>
                        <div><strong>Заезд:</strong> {{ formatDate(selectedBooking.checkIn) }}</div>
                        <div><strong>Выезд:</strong> {{ formatDate(selectedBooking.checkOut) }}</div>
                        <div><strong>Количество гостей:</strong> {{ selectedBooking.guests }}</div>
                        <div><strong>Ночей:</strong> {{ calculateNights(selectedBooking.checkIn,
                            selectedBooking.checkOut) }}</div>
                        <div><strong>Общая стоимость:</strong> ${{ selectedBooking.totalPrice }}</div>
                        <div><strong>Дата создания:</strong> {{ formatDateTime(selectedBooking.createdAt) }}</div>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Закрыть" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Cancellation confirmation dialog -->
        <q-dialog v-model="showCancellation">
            <q-card>
                <q-card-section>
                    <div class="text-h6">Подтверждение отмены</div>
                </q-card-section>

                <q-card-section>
                    Вы уверены, что хотите отменить бронирование в {{ selectedBooking?.hotelName }}?
                    <br><br>
                    <!-- Bug: shows incorrect cancellation policy -->
                    <div class="text-body2 text-grey-7">
                        Отмена бесплатная за 24 часа до заезда.
                        При более поздней отмене взимается штраф 50%.
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Нет" color="grey" v-close-popup />
                    <q-btn label="Да, отменить" color="negative" @click="cancelBooking" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from 'stores/main'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const router = useRouter()
const store = useMainStore()
const { bookings, user } = storeToRefs(store)

const showDetails = ref(false)
const showCancellation = ref(false)
const selectedBooking = ref(null)

const sortedBookings = computed(() => {
    return [...bookings.value].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
    )
})

function goToLogin() {
    router.push('/login')
}

function goToHotels() {
    router.push('/hotels')
}

function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn)
    const end = new Date(checkOut)
    const diffTime = end - start
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
}

function formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

function formatDateTime(dateString) {
    const date = new Date(dateString)
    return date.toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}

function getStatusColor(status) {
    switch (status) {
        case 'confirmed': return 'positive'
        case 'cancelled': return 'negative'
        case 'pending': return 'warning'
        default: return 'grey'
    }
}

function getStatusLabel(status) {
    switch (status) {
        case 'confirmed': return 'Подтверждено'
        case 'cancelled': return 'Отменено'
        case 'pending': return 'Ожидает подтверждения'
        default: return status
    }
}

function showBookingDetails(booking) {
    selectedBooking.value = booking
    showDetails.value = true
}

function confirmCancellation(booking) {
    selectedBooking.value = booking
    showCancellation.value = true
}

function cancelBooking() {
    if (!selectedBooking.value) return

    store.cancelBooking(selectedBooking.value.id)

    $q.notify({
        type: 'info',
        message: `Бронирование #${selectedBooking.value.id} отменено`,
        position: 'top'
    })

    showCancellation.value = false
    selectedBooking.value = null
}
</script>

<style scoped>
.booking-card {
    transition: all 0.3s ease;
}

.booking-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
</style>