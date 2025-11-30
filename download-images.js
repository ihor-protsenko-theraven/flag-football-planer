const fs = require('fs');
const https = require('https');
const path = require('path');

const images = [
    { id: 'drill_001', url: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=400&h=300&fit=crop' },
    { id: 'drill_002', url: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400&h=300&fit=crop' },
    { id: 'drill_003', url: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&h=300&fit=crop' },
    { id: 'drill_004', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop' },
    { id: 'drill_005', url: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop' },
    { id: 'drill_006', url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&h=300&fit=crop' },
    { id: 'drill_007', url: 'https://images.unsplash.com/photo-1546608235-3310a2494cdf?w=400&h=300&fit=crop' },
    { id: 'drill_008', url: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=300&fit=crop' }
];

const targetDir = path.join(__dirname, 'src', 'assets', 'images', 'drills_images_preview');

if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

images.forEach(img => {
    const filePath = path.join(targetDir, `${img.id}.jpg`);
    const file = fs.createWriteStream(filePath);

    https.get(img.url, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${img.id}.jpg`);
        });
    }).on('error', err => {
        fs.unlink(filePath, () => { }); // Delete the file async. (But we don't check the result)
        console.error(`Error downloading ${img.id}.jpg: ${err.message}`);
    });
});
