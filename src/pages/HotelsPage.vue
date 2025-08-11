<template>
    <q-page class="q-pa-lg">
        <div class="row q-col-gutter-lg">
            <!-- Search filters -->
            <div class="col-12 col-md-4">
                <q-card>
                    <q-card-section>
                        <h6>Поиск отелей</h6>

                        <q-select v-model="selectedCity" :options="cityOptions" label="Город" clearable
                            class="q-mb-md" />

                        <q-input v-model="checkInDate" type="date" label="Дата заезда" class="q-mb-md" :min="today" />

                        <q-input v-model="checkOutDate" type="date" label="Дата выезда" class="q-mb-md"
                            :min="checkInDate || today" />

                        <q-input v-model.number="guests" type="number" label="Количество гостей" :min="1" :max="10"
                            class="q-mb-md" />

                        <q-range v-model="priceRange" :min="0" :max="500" :step="25" label label-always
                            class="q-mb-md" />

                        <q-btn color="primary" label="Найти отели" icon="search" @click="searchHotels"
                            class="full-width" />
                    </q-card-section>
                </q-card>
            </div>

            <!-- Hotels list -->
            <div class="col-12 col-md-8">
                <h4 class="q-my-none q-mb-lg">Доступные отели</h4>

                <div v-if="filteredHotels.length === 0 && searchPerformed" class="text-center q-mt-xl">
                    <q-icon name="hotel_class" size="4rem" color="grey-5" />
                    <p class="text-h6 text-grey-6 q-mt-md">
                        Отели не найдены
                    </p>
                </div>

                <div v-for="hotel in filteredHotels" :key="hotel.id" class="q-mb-lg">
                    <q-card>
                        <div class="row no-wrap">
                            <div class="col-4">
                                <q-img :src="hotel.image" style="height: 250px" class="bg-grey-3" />
                            </div>

                            <div class="col-8">
                                <q-card-section>
                                    <div class="row items-center">
                                        <div class="col">
                                            <div class="text-h5">{{ hotel.name }}</div>
                                            <div class="text-subtitle2 text-grey-7">{{ hotel.city }}</div>
                                        </div>
                                        <div class="col-auto">
                                            <div class="row items-center">
                                                <q-rating v-model="hotel.rating" readonly color="orange" size="sm" />
                                                <span class="q-ml-sm text-weight-bold">{{ hotel.rating }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="q-mt-md">
                                        <div class="text-h4 text-weight-bold text-primary">
                                            ${{ hotel.price }}
                                            <span class="text-body2 text-grey-7">/ ночь</span>
                                        </div>

                                        <!-- Bug: shows available even when hotel.available is false -->
                                        <div class="text-body2 text-positive q-mt-sm">
                                            <q-icon name="check_circle" size="sm" />
                                            Доступно для бронирования
                                        </div>

                                        <div class="text-caption text-grey-6">
                                            Свободных номеров: {{ hotel.rooms }}
                                        </div>

                                        <div v-if="checkInDate && checkOutDate" class="text-body2 q-mt-sm">
                                            Всего ночей: {{ calculateNights() }}
                                            <br>
                                            <!-- Bug: wrong total calculation when nights = 0 -->
                                            Общая стоимость: ${{ hotel.price * Math.max(calculateNights(), 1) }}
                                        </div>
                                    </div>
                                </q-card-section>

                                <q-card-actions align="right" class="q-pa-md">
                                    <q-btn flat color="grey-7" label="Подробнее" @click="showHotelDetails(hotel)" />
                                    <q-btn color="primary" label="Забронировать" @click="bookHotel(hotel)"
                                        :disable="!canBook(hotel)" />
                                </q-card-actions>
                            </div>
                        </div>
                    </q-card>
                </div>
            </div>
        </div>

        <!-- Hotel details dialog -->
        <q-dialog v-model="showDetails">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">{{ selectedHotel?.name }}</div>
                </q-card-section>

                <q-card-section>
                    <p>Детальная информация об отеле будет здесь...</p>
                    <p><strong>Город:</strong> {{ selectedHotel?.city }}</p>
                    <p><strong>Рейтинг:</strong> {{ selectedHotel?.rating }}/5</p>
                    <p><strong>Цена за ночь:</strong> ${{ selectedHotel?.price }}</p>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Закрыть" color="primary" v-close-popup />
                </q-card-actions>
            </q-card>
        </q-dialog>

        <!-- Booking confirmation dialog -->
        <q-dialog v-model="showBookingForm">
            <q-card style="min-width: 400px">
                <q-card-section>
                    <div class="text-h6">Подтверждение бронирования</div>
                </q-card-section>

                <q-card-section>
                    <div><strong>Отель:</strong> {{ selectedHotel?.name }}</div>
                    <div><strong>Даты:</strong> {{ checkInDate }} - {{ checkOutDate }}</div>
                    <div><strong>Гостей:</strong> {{ guests }}</div>
                    <div><strong>Ночей:</strong> {{ calculateNights() }}</div>
                    <div class="text-h6 text-primary q-mt-md">
                        <strong>Итого: ${{ selectedHotel ? selectedHotel.price * Math.max(calculateNights(), 1) : 0
                            }}</strong>
                    </div>
                </q-card-section>

                <q-card-actions align="right">
                    <q-btn flat label="Отмена" color="grey" v-close-popup />
                    <q-btn label="Подтвердить" color="primary" @click="confirmBooking" />
                </q-card-actions>
            </q-card>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMainStore } from 'stores/main'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const router = useRouter()
const store = useMainStore()
const { hotels, user } = storeToRefs(store)

const selectedCity = ref(null)
const checkInDate = ref('')
const checkOutDate = ref('')
const guests = ref(2)
const priceRange = ref({ min: 0, max: 500 })
const searchPerformed = ref(false)
const showDetails = ref(false)
const showBookingForm = ref(false)
const selectedHotel = ref(null)

const today = new Date().toISOString().split('T')[0]

const cityOptions = ['Moscow', 'St. Petersburg', 'Sochi']

const filteredHotels = computed(() => {
    if (!searchPerformed.value) return []

    let result = hotels.value

    if (selectedCity.value) {
        result = result.filter(h => h.city === selectedCity.value)
    }

    result = result.filter(h =>
        h.price >= priceRange.value.min && h.price <= priceRange.value.max
    )

    return result
})

function searchHotels() {
    // Bug: doesn't validate that check-out is after check-in
    searchPerformed.value = true
}

function calculateNights() {
    if (!checkInDate.value || !checkOutDate.value) return 0

    const checkIn = new Date(checkInDate.value)
    const checkOut = new Date(checkOutDate.value)
    const diffTime = checkOut - checkIn
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return Math.max(0, diffDays)
}

function canBook(hotel) {
    // Bug: doesn't check if user is logged in
    return checkInDate.value && checkOutDate.value && hotel.rooms > 0
}

function showHotelDetails(hotel) {
    selectedHotel.value = hotel
    showDetails.value = true
}

function bookHotel(hotel) {
    if (!user.value.isLoggedIn) {
        $q.notify({
            type: 'warning',
            message: 'Для бронирования необходимо войти в систему',
            position: 'top'
        })
        router.push('/login')
        return
    }

    selectedHotel.value = hotel
    showBookingForm.value = true
}

function confirmBooking() {
    if (!selectedHotel.value) return

    const bookingData = {
        hotelId: selectedHotel.value.id,
        hotelName: selectedHotel.value.name,
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value,
        guests: guests.value,
        totalPrice: selectedHotel.value.price * Math.max(calculateNights(), 1)
    }

    store.bookHotel(bookingData)

    $q.notify({
        type: 'positive',
        message: 'Бронирование успешно создано!',
        position: 'top'
    })

    showBookingForm.value = false
    router.push('/bookings')
}
</script>