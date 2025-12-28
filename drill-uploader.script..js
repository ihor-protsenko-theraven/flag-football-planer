const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// 1. НАЛАШТУВАННЯ
// Переконайся, що файл ключа лежить поруч із цим скриптом
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function uploadData() {
  try {
    console.log('📦 Зчитуємо файли даних...');

    // ОНОВЛЕНІ ШЛЯХИ ДО ФАЙЛІВ
    // Ми використовуємо path.join для правильного формування шляху незалежно від ОС
    const enPath = path.join(__dirname, 'src/assets/data/mock-drills-en.json');
    const uaPath = path.join(__dirname, 'src/assets/data/mock-drills-ua.json');

    // Перевірка чи існують файли перед читанням
    if (!fs.existsSync(enPath) || !fs.existsSync(uaPath)) {
      throw new Error(`❌ Не знайдено файли даних! Перевірте шлях: src/assets/data/`);
    }

    // Парсимо JSON
    const enDrills = JSON.parse(fs.readFileSync(enPath, 'utf8'));
    const uaDrills = JSON.parse(fs.readFileSync(uaPath, 'utf8'));

    console.log(`🇺🇸 Англійських записів: ${enDrills.length}`);
    console.log(`🇺🇦 Українських записів: ${uaDrills.length}`);

    if (enDrills.length !== uaDrills.length) {
      console.warn('⚠️ УВАГА: Кількість записів у файлах відрізняється!');
    }

    const BATCH_SIZE = 400;
    let batch = db.batch();
    let batchCount = 0;
    let totalUploaded = 0;

    console.log('🚀 Починаємо обробку та завантаження...');

    for (const enItem of enDrills) {
      const uaItem = uaDrills.find(item => item.id === enItem.id);

      if (!uaItem) {
        console.error(`❌ Не знайдено переклад для ID: ${enItem.id}. Пропускаємо.`);
        continue;
      }

      const docRef = db.collection('drills').doc(enItem.id);
      const nowISO = new Date().toISOString();

      const finalDoc = {
        // --- СПІЛЬНІ ПОЛЯ ---
        id: enItem.id,
        category: enItem.category,
        level: enItem.level,
        duration: enItem.duration,
        imageUrl: enItem.imageUrl,
        videoUrl: null,
        createdAt: nowISO,
        updatedAt: nowISO,

        // --- ПЕРЕКЛАДИ ---
        translations: {
          en: {
            name: enItem.name,
            description: enItem.description,
            instructions: enItem.instructions,
            coachingTips: enItem.coachingTips,
            equipment: enItem.equipment
          },
          uk: {
            name: uaItem.name,
            description: uaItem.description,
            instructions: uaItem.instructions,
            coachingTips: uaItem.coachingTips,
            equipment: uaItem.equipment
          }
        }
      };

      batch.set(docRef, finalDoc);
      batchCount++;

      if (batchCount >= BATCH_SIZE) {
        await batch.commit();
        totalUploaded += batchCount;
        console.log(`✅ Завантажено пакет: ${batchCount} документів. Всього: ${totalUploaded}`);
        batch = db.batch();
        batchCount = 0;
      }
    }

    if (batchCount > 0) {
      await batch.commit();
      totalUploaded += batchCount;
      console.log(`✅ Завантажено фінальний пакет: ${batchCount} документів.`);
    }

    console.log(`🎉 Успішно завершено! Всього завантажено: ${totalUploaded} дрілів.`);

  } catch (error) {
    console.error('🔥 Сталася помилка:', error.message);
  }
}

uploadData();
