<template>
    <q-page class="q-pa-lg">
        <div class="row q-col-gutter-lg">
            <!-- Filters -->
            <div class="col-12 col-md-3">
                <q-card>
                    <q-card-section>
                        <h6>Фильтры</h6>

                        <q-select v-model="selectedCategory" :options="categoryOptions" label="Категория" clearable
                            emit-value map-options class="q-mb-md" />

                        <q-range v-model="priceRange" :min="0" :max="2000" :step="50" label label-always
                            class="q-mb-md" />

                        <q-toggle v-model="inStockOnly" label="Только в наличии" />
                    </q-card-section>
                </q-card>
            </div>

            <!-- Products -->
            <div class="col-12 col-md-9">
                <div class="row q-mb-md">
                    <div class="col">
                        <h4 class="q-my-none">Каталог товаров</h4>
                    </div>
                    <div class="col-auto">
                        <q-btn-toggle v-model="viewMode" :options="[
                            { label: 'Сетка', value: 'grid', icon: 'grid_view' },
                            { label: 'Список', value: 'list', icon: 'view_list' }
                        ]" />
                    </div>
                </div>

                <div v-if="viewMode === 'grid'" class="row q-col-gutter-md">
                    <div v-for="product in filteredProducts" :key="product.id" class="col-12 col-sm-6 col-md-4">
                        <q-card class="product-card">
                            <q-img :src="product.image" style="height: 200px" class="bg-grey-3">
                                <div v-if="product.stock === 0" class="absolute-top-right q-ma-sm">
                                    <q-chip color="negative" text-color="white" size="sm">
                                        Нет в наличии
                                    </q-chip>
                                </div>
                            </q-img>

                            <q-card-section>
                                <div class="text-h6">{{ product.name }}</div>
                                <div class="text-subtitle2 text-grey-7">{{ product.category }}</div>
                                <div class="text-h5 text-weight-bold text-primary q-mt-sm">
                                    ${{ product.price }}
                                </div>
                                <div class="text-caption text-grey-6">
                                    В наличии: {{ product.stock }} шт.
                                </div>
                            </q-card-section>

                            <q-card-actions align="around">
                                <q-btn color="primary" label="В корзину" icon="add_shopping_cart"
                                    @click="addToCart(product)" :disable="product.stock === 0" />
                                <!-- Bug: Quick buy button doesn't check stock -->
                                <q-btn flat color="secondary" label="Купить сейчас" @click="quickBuy(product)" />
                            </q-card-actions>
                        </q-card>
                    </div>
                </div>

                <!-- List view -->
                <div v-else>
                    <q-list bordered separator>
                        <q-item v-for="product in filteredProducts" :key="product.id" class="q-pa-md">
                            <q-item-section avatar>
                                <q-avatar size="80px" square>
                                    <img :src="product.image" />
                                </q-avatar>
                            </q-item-section>

                            <q-item-section>
                                <q-item-label class="text-h6">{{ product.name }}</q-item-label>
                                <q-item-label caption>{{ product.category }}</q-item-label>
                                <q-item-label caption>В наличии: {{ product.stock }} шт.</q-item-label>
                            </q-item-section>

                            <q-item-section side>
                                <div class="text-h5 text-weight-bold text-primary q-mb-sm">
                                    ${{ product.price }}
                                </div>
                                <q-btn color="primary" label="В корзину" size="sm" @click="addToCart(product)"
                                    :disable="product.stock === 0" />
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>

                <!-- No products -->
                <div v-if="filteredProducts.length === 0" class="text-center q-mt-xl">
                    <q-icon name="search_off" size="4rem" color="grey-5" />
                    <p class="text-h6 text-grey-6 q-mt-md">
                        Товары не найдены
                    </p>
                </div>
            </div>
        </div>
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
const { products } = storeToRefs(store)

const selectedCategory = ref(null)
const priceRange = ref({ min: 0, max: 2000 })
const inStockOnly = ref(false)
const viewMode = ref('grid')

const categoryOptions = [
    { label: 'Электроника', value: 'electronics' },
    { label: 'Обувь', value: 'shoes' }
]

const filteredProducts = computed(() => {
    let result = products.value

    if (selectedCategory.value) {
        result = result.filter(p => p.category === selectedCategory.value)
    }

    result = result.filter(p =>
        p.price >= priceRange.value.min && p.price <= priceRange.value.max
    )

    if (inStockOnly.value) {
        result = result.filter(p => p.stock > 0)
    }

    return result
})

function addToCart(product) {
    // Bug: allows adding out of stock items to cart
    store.addToCart(product)

    $q.notify({
        type: 'positive',
        message: `${product.name} добавлен в корзину`,
        position: 'top'
    })
}

function quickBuy(product) {
    // Bug: quick buy doesn't check stock or authentication
    store.addToCart(product)
    router.push('/checkout')
}
</script>

<style scoped>
.product-card {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.product-card .q-card-section {
    flex: 1;
}
</style>