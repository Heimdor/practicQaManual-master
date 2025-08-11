<template>
    <q-page class="q-pa-lg">
        <div class="row justify-center">
            <div class="col-12 col-md-10">
                <h4 class="q-mb-lg">Оформление заказа</h4>

                <div v-if="cart.length === 0" class="text-center q-mt-xl">
                    <q-icon name="shopping_cart" size="4rem" color="grey-5" />
                    <p class="text-h6 text-grey-6 q-mt-md">
                        Корзина пуста. Добавьте товары для оформления заказа.
                    </p>
                    <q-btn color="primary" label="Перейти к покупкам" @click="goToShop" />
                </div>

                <div v-else class="row q-col-gutter-lg">
                    <!-- Order form -->
                    <div class="col-12 col-md-8">
                        <q-stepper v-model="step" ref="stepper" color="primary" animated>
                            <!-- Step 1: Delivery -->
                            <q-step :name="1" title="Доставка" icon="local_shipping" :done="step > 1">
                                <q-form class="q-gutter-md">
                                    <div class="text-h6 q-mb-md">Адрес доставки</div>

                                    <q-input v-model="deliveryForm.address" label="Адрес" required
                                        :rules="[val => !!val || 'Поле обязательно']" />

                                    <div class="row q-col-gutter-md">
                                        <div class="col-6">
                                            <q-input v-model="deliveryForm.city" label="Город" required
                                                :rules="[val => !!val || 'Поле обязательно']" />
                                        </div>
                                        <div class="col-6">
                                            <q-input v-model="deliveryForm.zipCode" label="Индекс" mask="######"
                                                required :rules="[val => !!val || 'Поле обязательно']" />
                                        </div>
                                    </div>

                                    <q-select v-model="deliveryForm.method" :options="deliveryMethods"
                                        label="Способ доставки" emit-value map-options required />

                                    <q-input v-model="deliveryForm.comments" label="Комментарий к заказу"
                                        type="textarea" rows="3" />
                                </q-form>

                                <q-stepper-navigation>
                                    <q-btn @click="nextStep" color="primary" label="Далее" />
                                </q-stepper-navigation>
                            </q-step>

                            <!-- Step 2: Payment -->
                            <q-step :name="2" title="Оплата" icon="payment" :done="step > 2">
                                <q-form class="q-gutter-md">
                                    <div class="text-h6 q-mb-md">Способ оплаты</div>

                                    <q-option-group v-model="paymentForm.method" :options="paymentMethods"
                                        color="primary" />

                                    <div v-if="paymentForm.method === 'card'" class="q-mt-md">
                                        <div class="text-subtitle1 q-mb-md">Данные карты</div>

                                        <q-input v-model="paymentForm.cardNumber" label="Номер карты"
                                            mask="#### #### #### ####" placeholder="1234 5678 9012 3456" required />

                                        <div class="row q-col-gutter-md q-mt-md">
                                            <div class="col-6">
                                                <q-input v-model="paymentForm.expiryDate" label="Срок действия"
                                                    mask="##/##" placeholder="MM/YY" required />
                                            </div>
                                            <div class="col-6">
                                                <q-input v-model="paymentForm.cvv" label="CVV" mask="###"
                                                    placeholder="123" required />
                                            </div>
                                        </div>

                                        <q-input v-model="paymentForm.cardholderName" label="Имя держателя карты"
                                            class="q-mt-md" required />
                                    </div>
                                </q-form>

                                <q-stepper-navigation>
                                    <q-btn flat @click="prevStep" color="primary" label="Назад" />
                                    <q-btn @click="nextStep" color="primary" label="Далее" class="q-ml-sm" />
                                </q-stepper-navigation>
                            </q-step>

                            <!-- Step 3: Confirmation -->
                            <q-step :name="3" title="Подтверждение" icon="check">
                                <div class="text-h6 q-mb-md">Проверьте данные заказа</div>

                                <q-card class="q-mb-md">
                                    <q-card-section>
                                        <div class="text-subtitle1">Доставка</div>
                                        <div>{{ deliveryForm.address }}</div>
                                        <div>{{ deliveryForm.city }}, {{ deliveryForm.zipCode }}</div>
                                        <div>{{ getDeliveryMethodLabel(deliveryForm.method) }}</div>
                                    </q-card-section>
                                </q-card>

                                <q-card class="q-mb-md">
                                    <q-card-section>
                                        <div class="text-subtitle1">Оплата</div>
                                        <div>{{ getPaymentMethodLabel(paymentForm.method) }}</div>
                                        <div v-if="paymentForm.method === 'card'">
                                            **** **** **** {{ paymentForm.cardNumber.slice(-4) }}
                                        </div>
                                    </q-card-section>
                                </q-card>

                                <q-stepper-navigation>
                                    <q-btn flat @click="prevStep" color="primary" label="Назад" />
                                    <q-btn @click="submitOrder" color="positive" label="Оформить заказ" class="q-ml-sm"
                                        :loading="submitting" />
                                </q-stepper-navigation>
                            </q-step>
                        </q-stepper>
                    </div>

                    <!-- Order summary -->
                    <div class="col-12 col-md-4">
                        <q-card>
                            <q-card-section>
                                <div class="text-h6 q-mb-md">Ваш заказ</div>

                                <q-list>
                                    <q-item v-for="item in cart" :key="item.id" dense>
                                        <q-item-section>
                                            <q-item-label>{{ item.name }}</q-item-label>
                                            <q-item-label caption>{{ item.quantity }} x ${{ item.price }}</q-item-label>
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-item-label>${{ (item.price * item.quantity).toFixed(2) }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>

                                <q-separator class="q-my-md" />

                                <div class="row justify-between">
                                    <div>Подытог:</div>
                                    <div>${{ cartTotal.toFixed(2) }}</div>
                                </div>

                                <div class="row justify-between">
                                    <div>Доставка:</div>
                                    <!-- Bug: delivery cost calculation is wrong -->
                                    <div>${{ deliveryCost.toFixed(2) }}</div>
                                </div>

                                <q-separator class="q-my-sm" />

                                <div class="row justify-between text-h6 text-weight-bold">
                                    <div>Итого:</div>
                                    <div>${{ totalCost.toFixed(2) }}</div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </div>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from 'stores/main'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const router = useRouter()
const store = useMainStore()
const { cart, cartTotal, user } = storeToRefs(store)

const step = ref(1)
const submitting = ref(false)

const deliveryForm = reactive({
    address: '',
    city: '',
    zipCode: '',
    method: 'standard',
    comments: ''
})

const paymentForm = reactive({
    method: 'cash',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
})

const deliveryMethods = [
    { label: 'Стандартная доставка (3-5 дней) - $5', value: 'standard' },
    { label: 'Экспресс доставка (1-2 дня) - $15', value: 'express' },
    { label: 'Самовывоз - Бесплатно', value: 'pickup' }
]

const paymentMethods = [
    { label: 'Наличными при получении', value: 'cash' },
    { label: 'Банковской картой', value: 'card' },
    { label: 'Электронный кошелек', value: 'wallet' }
]

// Bug: delivery cost calculation doesn't match the labels
const deliveryCost = computed(() => {
    switch (deliveryForm.method) {
        case 'standard': return 10  // Should be 5
        case 'express': return 20   // Should be 15
        case 'pickup': return 0
        default: return 0
    }
})

const totalCost = computed(() => {
    return cartTotal.value + deliveryCost.value
})

function nextStep() {
    // Bug: doesn't validate form before proceeding
    step.value++
}

function prevStep() {
    step.value--
}

function goToShop() {
    router.push('/shop')
}

function getDeliveryMethodLabel(value) {
    const method = deliveryMethods.find(m => m.value === value)
    return method ? method.label : value
}

function getPaymentMethodLabel(value) {
    const method = paymentMethods.find(m => m.value === value)
    return method ? method.label : value
}

async function submitOrder() {
    if (!user.value.isLoggedIn) {
        $q.notify({
            type: 'warning',
            message: 'Для оформления заказа необходимо войти в систему',
            position: 'top'
        })
        router.push('/login')
        return
    }

    submitting.value = true

    try {
        // Simulate order processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Bug: order submission doesn't clear the cart

        $q.notify({
            type: 'positive',
            message: 'Заказ успешно оформлен! Номер заказа: #' + Math.floor(Math.random() * 100000),
            position: 'top',
            timeout: 5000
        })

        router.push('/profile')
    } catch {
        $q.notify({
            type: 'negative',
            message: 'Ошибка при оформлении заказа',
            position: 'top'
        })
    } finally {
        submitting.value = false
    }
}
</script>