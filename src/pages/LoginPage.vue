<template>
    <q-page class="flex flex-center">
        <q-card style="width: 400px; max-width: 90vw">
            <q-card-section>
                <div class="text-h5 text-center q-mb-md">
                    {{ isLogin ? 'Вход в систему' : 'Регистрация' }}
                </div>
            </q-card-section>

            <q-card-section>
                <q-form @submit="submitForm" class="q-gutter-md">
                    <q-input v-if="!isLogin" v-model="form.name" label="Имя" required
                        :rules="[val => !!val || 'Поле обязательно']" />

                    <q-input v-model="form.email" type="email" label="Email" required :rules="[
                        val => !!val || 'Поле обязательно',
                        val => isValidEmail(val) || 'Неверный формат email'
                    ]" />

                    <q-input v-model="form.password" :type="showPassword ? 'text' : 'password'" label="Пароль" required
                        :rules="[
                            val => !!val || 'Поле обязательно',
                            val => val.length >= 6 || 'Пароль должен содержать минимум 6 символов'
                        ]">
                        <template v-slot:append>
                            <q-icon :name="showPassword ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                @click="showPassword = !showPassword" />
                        </template>
                    </q-input>

                    <q-input v-if="!isLogin" v-model="form.phone" label="Телефон" mask="# (###) ###-##-##"
                        placeholder="+7 (___) ___-__-__" />

                    <div class="q-mt-md">
                        <q-btn type="submit" color="primary" :label="isLogin ? 'Войти' : 'Зарегистрироваться'"
                            class="full-width" :loading="loading" />
                    </div>

                    <div class="text-center q-mt-md">
                        <q-btn flat :label="isLogin ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите'"
                            @click="toggleMode" />
                    </div>
                </q-form>
            </q-card-section>

            <!-- Demo credentials -->
            <q-card-section class="bg-grey-1">
                <div class="text-caption text-grey-7">
                    <strong>Демо данные для входа:</strong><br>
                    Email: admin@test.com<br>
                    Пароль: password
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useMainStore } from 'stores/main'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const store = useMainStore()

const isLogin = ref(true)
const showPassword = ref(false)
const loading = ref(false)

const form = reactive({
    name: '',
    email: '',
    password: '',
    phone: ''
})

function toggleMode() {
    isLogin.value = !isLogin.value
    // Clear form when switching modes
    Object.assign(form, {
        name: '',
        email: '',
        password: '',
        phone: ''
    })
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

async function submitForm() {
    loading.value = true

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    try {
        if (isLogin.value) {
            // Login logic
            // Bug: accepts any email/password combination as valid
            if (form.email && form.password) {
                const userData = {
                    name: form.email === 'admin@test.com' ? 'Администратор' : 'Пользователь',
                    email: form.email,
                    phone: '+7 (999) 123-45-67'
                }

                store.login(userData)

                $q.notify({
                    type: 'positive',
                    message: 'Успешный вход в систему!',
                    position: 'top'
                })

                router.push('/')
            }
        } else {
            // Registration logic
            // Bug: doesn't check if email already exists
            const userData = {
                name: form.name,
                email: form.email,
                phone: form.phone || '+7 (999) 000-00-00'
            }

            store.login(userData)

            $q.notify({
                type: 'positive',
                message: 'Регистрация успешна!',
                position: 'top'
            })

            router.push('/')
        }
    } catch {
        $q.notify({
            type: 'negative',
            message: 'Произошла ошибка. Попробуйте снова.',
            position: 'top'
        })
    } finally {
        loading.value = false
    }
}
</script>