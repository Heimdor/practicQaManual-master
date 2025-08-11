<template>
  <div class="about-container">
    <q-card class="about-card">
      <q-card-section>
        <div class="about-title">Здравствуйте, дорогой друг!</div>
        <div class="about-subtitle">
          Это сайт для проверки и развития твоих навыков в тестировании ПО.<br />
          Здесь ты сможешь найти баги, проверить гипотезы и потренироваться на реальных сценариях.
        </div>

        <q-separator spaced />

        <div class="section-title">Тестовые данные</div>
        <ul class="test-data-list">
          <li><strong>Email для входа:</strong> <span class="highlight">admin@test.com</span></li>
          <li>
            <strong>Пароль:</strong> <span class="highlight">любой пароль от 6 символов</span>
          </li>
          <li><strong>Промокод:</strong> <span class="highlight">любой текст (Баг или фича?)</span></li>
        </ul>

        <q-separator spaced />

        <div class="section-title">Что протестировать</div>
        <div class="checklist-section">
          <div class="checklist-title">Основные функции:</div>
          <ul class="checklist">
            <li>Регистрация и вход в систему</li>
            <li>Просмотр каталога товаров</li>
            <li>Добавление товаров в корзину</li>
            <li>Оформление заказа</li>
            <li>Поиск и бронирование отелей</li>
            <li>Управление профилем</li>
            <li>Работа с бронированиями</li>
          </ul>
          <div class="checklist-title">На что обратить внимание:</div>
          <ul class="checklist">
            <li>Валидация форм</li>
            <li>Обработка ошибок</li>
            <li>Корректность расчетов</li>
            <li>Состояние данных</li>
            <li>UX/UI элементы</li>
          </ul>
        </div>

        <q-separator spaced />

        <div class="note">
          <q-icon name="bug_report" color="red" size="24px" class="note-icon" />
          <span>
            <strong>Примечание:</strong> В приложении намеренно содержатся баги для тестирования.<br />
            Твоя задача — найти и задокументировать их!
          </span>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
export default {
  name: 'AboutPage',
}
</script>

<style scoped>
.about-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 70vh;
  background: linear-gradient(135deg, #e3f2fd 0%, #f5f7fa 100%);
  padding: 48px 0;
}

.about-card {
  max-width: 650px;
  width: 100%;
  box-shadow: 0 6px 32px rgba(25, 118, 210, 0.1);
  border-radius: 18px;
  background: #fff;
  padding: 0 8px;
}

.about-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1976d2;
  margin-bottom: 10px;
  text-align: center;
  letter-spacing: 1px;
}

.about-subtitle {
  font-size: 1.18rem;
  color: #444;
  text-align: center;
  margin-bottom: 18px;
  line-height: 1.6;
}

.section-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #1565c0;
  margin-top: 18px;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.test-data-list {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.test-data-list li {
  margin-bottom: 6px;
  font-size: 1.05rem;
}

.highlight {
  background: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-family: 'Fira Mono', monospace;
}

.checklist-section {
  margin-bottom: 10px;
}

.checklist-title {
  font-weight: 600;
  color: #1976d2;
  margin-top: 10px;
  margin-bottom: 4px;
}

.checklist {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.checklist li {
  position: relative;
  padding-left: 28px;
  margin-bottom: 7px;
  font-size: 1rem;
}

.checklist li::before {
  content: '✔';
  color: #43a047;
  position: absolute;
  left: 0;
  font-size: 1.1em;
  top: 0;
}

.note {
  display: flex;
  align-items: flex-start;
  background: #fff3e0;
  color: #e65100;
  border-left: 5px solid #ff9800;
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 18px;
  font-size: 1.04rem;
}

.note-icon {
  margin-right: 10px;
  margin-top: 2px;
}
</style>
