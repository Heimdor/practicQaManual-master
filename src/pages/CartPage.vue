<template>
    <q-page class="q-pa-lg">
        <div class="row justify-center">
            <div class="col-12 col-md-8">
                <h4 class="q-mb-lg">Корзина покупок</h4>

                <div v-if="cart.length === 0" class="text-center q-mt-xl">
                    <q-icon name="shopping_cart" size="4rem" color="grey-5" />
                    <p class="text-h6 text-grey-6 q-mt-md">
                        Корзина пуста
                    </p>
                    <q-btn color="primary" label="Перейти к покупкам" @click="goToShop" class="q-mt-md" />
                </div>

                <div v-else>
                    <q-list bordered separator>
                        <q-item v-for="item in cart" :key="item.id" class="q-pa-md">
                            <q-item-section avatar>
                                <q-avatar size="80px" square>
                                    <img :src="item.image" />
                                </q-avatar>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-h6">{{ item.name }}</q-item-label>
                                <q-item-label caption>{{ item.category }}</q-item-label>
                                <q-item-label caption class="text-weight-bold">
                                    ${{ item.price }} за единицу
                                </q-item-label>
                                <!-- Bug: shows stock but doesn't validate against it -->
                                <q-item-label caption>
                                    Доступно: {{ item.stock }} шт.
                                </q-item-label>
                            </q-item-section>

                            <q-item-section side class="q-gutter-sm">
                                <div class="row items-center q-gutter-sm">
                                    <q-btn round dense icon="remove" size="sm" @click="decreaseQuantity(item)"
                                        :disable="item.quantity <= 1" />

                                    <q-input v-model.number="item.quantity" type="number" dense style="width: 80px"
                                        :min="1" @update:model-value="updateQuantity(item.id, $event)" />

                                    <q-btn round dense icon="add" size="sm" @click="increaseQuantity(item)" />
                                </div>

                                <div class="text-h6 text-weight-bold text-primary text-center">
                                    ${{ (item.price * item.quantity).toFixed(2) }}
                                </div>

                                <q-btn flat round icon="delete" color="negative" @click="removeItem(item.id)" />
                            </q-item-section>
                        </q-item>
                    </q-list>

                    <!-- Summary -->
                    <q-card class="q-mt-lg">
                        <q-card-section>
                            <div class="row items-center">
                                <div class="col">
                                    <div class="text-h5">Итого</div>
                                    <div class="text-caption text-grey-6">
                                        Товаров: {{ cartItemsCount }} шт.
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <div class="text-h4 text-weight-bold text-primary">
                                        ${{ cartTotal.toFixed(2) }}
                                    </div>
                                </div>
                            </div>
                        </q-card-section>

                        <q-card-actions align="around">
                            <q-btn flat color="grey-7" label="Продолжить покупки" @click="goToShop" />
                            <q-btn color="primary" label="Оформить заказ" icon="payment" @click="goToCheckout"
                                :disable="cart.length === 0" />
                        </q-card-actions>
                    </q-card>

                    <!-- Promo code section -->
                    <q-card class="q-mt-md">
                        <q-card-section>
                            <div class="text-h6 q-mb-md">Промокод</div>
                            <div class="row q-gutter-md">
                                <div class="col">
                                    <q-input v-model="promoCode" label="Введите промокод" placeholder="SAVE10" />
                                </div>
                                <div class="col-auto">
                                    <q-btn color="secondary" label="Применить" @click="applyPromoCode" />
                                </div>
                            </div>
                            <!-- Bug: promo code always shows as applied successfully -->
                            <div v-if="promoApplied" class="text-positive q-mt-sm">
                                <q-icon name="check" /> Промокод применен! Скидка 10%
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from 'stores/main'
import { useQuasar } from 'quasar'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const router = useRouter()
const store = useMainStore()
const { cart, cartItemsCount, cartTotal } = storeToRefs(store)

const promoCode = ref('')
const promoApplied = ref(false)

function goToShop() {
    router.push('/shop')
}

function goToCheckout() {
    router.push('/checkout')
}

function updateQuantity(productId, newQuantity) {
    // Bug: doesn't validate against stock
    store.updateCartQuantity(productId, newQuantity)
}

function increaseQuantity(item) {
    // Bug: allows adding more than available stock
    store.updateCartQuantity(item.id, item.quantity + 1)
}

function decreaseQuantity(item) {
    if (item.quantity > 1) {
        store.updateCartQuantity(item.id, item.quantity - 1)
    }
}

function removeItem(productId) {
    store.removeFromCart(productId)

    $q.notify({
        type: 'info',
        message: 'Товар удален из корзины',
        position: 'top'
    })
}

function applyPromoCode() {
    // Bug: any promo code is considered valid
    if (promoCode.value.trim()) {
        promoApplied.value = true

        $q.notify({
            type: 'positive',
            message: 'Промокод успешно применен!',
            position: 'top'
        })
    } else {
        $q.notify({
            type: 'warning',
            message: 'Введите промокод',
            position: 'top'
        })
    }
}
</script>