const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. НАЛАШТУВАННЯ
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadPlays() {
  try {
    console.log('📦 Зчитуємо файл Plays...');

    // Шлях до файлу mock-plays.json
    const filePath = path.join(__dirname, 'src/assets/data/mock-plays.json');

    // Перевірка
    if (!fs.existsSync(filePath)) {
      throw new Error(`❌ Не знайдено файл! Перевірте шлях: ${filePath}`);
    }

    // Парсимо JSON
    const playsData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log(`🏈 Знайдено записів: ${playsData.length}`);

    const BATCH_SIZE = 400;
    let batch = db.batch();
    let batchCount = 0;
    let totalUploaded = 0;

    console.log('🚀 Починаємо завантаження в колекцію "plays"...');

    for (const item of playsData) {
      // Посилання на документ (використовуємо ID з JSON)
      const docRef = db.collection('plays').doc(item.id);
      const nowISO = new Date().toISOString();

      // Формуємо фінальний об'єкт
      // Твій JSON вже має правильну структуру, тому ми просто додаємо поля дат
      // та переконуємось, що videoUrl існує (навіть якщо null)
      const finalDoc = {
        ...item, // Копіюємо всі поля (id, category, translations, imageUrl, personnel, formation, complexity)
        videoUrl: item.videoUrl || null, // Додаємо, якщо немає в JSON
        createdAt: nowISO,
        updatedAt: nowISO
      };

      batch.set(docRef, finalDoc);
      batchCount++;

      // Логіка пакетного завантаження
      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        totalUploaded += batchCount;
        console.log(`✅ Завантажено пакет: ${batchCount}. Всього: ${totalUploaded}`);
        batch = db.batch();
        batchCount = 0;
      }
    }

    // Заливаємо залишок
    if (batchCount > 0) {
      await batch.commit();
      totalUploaded += batchCount;
      console.log(`✅ Завантажено фінальний пакет: ${batchCount}.`);
    }

    console.log(`🎉 Успішно завершено! Всього завантажено: ${totalUploaded} Plays.`);

  } catch (error) {
    console.error('🔥 Сталася помилка:', error.message);
  }
}

uploadPlays();
