const fs = require('fs');
const path = require('path');

// File paths
const enFilePath = path.join(__dirname, 'src', 'assets', 'data', 'mock-drills-en.json');
const uaFilePath = path.join(__dirname, 'src', 'assets', 'data', 'mock-drills-ua.json');

function updateImageUrls(filePath) {
    console.log(`Processing ${filePath}...`);

    // Read the file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Update each drill's imageUrl
    data.forEach(drill => {
        drill.imageUrl = `assets/images/drills_images_preview/${drill.id}.jpg`;
    });

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf8');
    console.log(`✓ Updated ${data.length} drills in ${path.basename(filePath)}`);
}

// Update both files
updateImageUrls(enFilePath);
updateImageUrls(uaFilePath);

console.log('\n✅ All image URLs updated successfully!');
