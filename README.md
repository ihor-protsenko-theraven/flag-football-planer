# Flag Football Planner 🏈

A comprehensive web application for planning and managing flag football training sessions. Built with Angular 21 and featuring bilingual support (English/Ukrainian).

![Angular](https://img.shields.io/badge/Angular-21-red)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

## 🌟 Features

- **Drill Catalog**: Browse 75+ pre-configured drills with filtering by category and level
- **Training Builder**: Create custom training sessions with drag-and-drop functionality
- **Bilingual Support**: Full internationalization with English and Ukrainian languages
- **Language-Aware Data**: Drill content automatically switches based on selected language
- **PDF Export**: Generate professional training plans
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Premium design with smooth animations and intuitive navigation

## 📋 Drill Categories

- **Passing**: Throwing and catching drills
- **Defense**: Defensive positioning and techniques
- **Offense**: Offensive plays and strategies
- **Conditioning**: Fitness and agility training
- **Warm-up**: Pre-practice routines
- **Flag Pulling**: Flag removal techniques and drills

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ihor-protsenko-theraven/flag-football-planer.git
   cd flag-football-planer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run unit tests
- `npm run watch` - Build and watch for changes

### Project Structure

```
src/
├── app/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components (catalog, builder, etc.)
│   ├── services/        # Business logic and data services
│   └── models/          # TypeScript interfaces and types
├── assets/
│   ├── data/           # Mock data (drills, trainings)
│   ├── i18n/           # Translation files (en.json, uk.json)
│   └── images/         # Image assets
└── styles.css          # Global styles
```

## 🌐 Internationalization

The app uses `@ngx-translate` for i18n support:

- **English** (`en`): Default language
- **Ukrainian** (`uk`): Full translation available

### Adding Translations

1. Update translation files in `src/assets/i18n/`
2. Use the `translate` pipe in templates: `{{ 'KEY' | translate }}`
3. Use `TranslateService` in components for dynamic translations

## 📦 Deployment

### Deploy to GitHub Pages

1. **Ensure repository is public** (required for free GitHub Pages)

2. **Deploy using Angular CLI**
   ```bash
   npx ng deploy --base-href=/flag-football-planer/
   ```

3. **Configure GitHub Pages**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` / `(root)`
   - Save

4. **Access your site**
   Your app will be available at: `https://[username].github.io/flag-football-planer/`

### Manual Deployment

```bash
# Build for production
npm run build

# The output will be in dist/flag-football-planer/
# Deploy these files to your hosting provider
```

## 🎨 Customization

### Adding Drill Images

Replace placeholder images in `src/assets/images/drills_images_preview/`:

1. Add images named `drill_001.jpg` through `drill_075.jpg`
2. Recommended size: 400x300px
3. Format: JPG or PNG

### Updating Mock Data

Edit drill data in:
- `src/assets/data/mock-drills-en.json` (English)
- `src/assets/data/mock-drills-ua.json` (Ukrainian)

### Styling

- Global styles: `src/styles.css`
- TailwindCSS configuration: `tailwind.config.js`
- Component-specific styles: Inline in component files

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Key Technologies

- **Angular 21**: Modern web framework
- **TypeScript 5.9**: Type-safe development
- **TailwindCSS 3.4**: Utility-first CSS framework
- **Angular CDK**: Drag-and-drop functionality
- **ngx-translate**: Internationalization
- **pdfmake**: PDF generation
- **RxJS**: Reactive programming

## 🔧 Troubleshooting

### Translation files not loading

Ensure `angular.json` has correct asset configuration:
```json
"assets": [
  {
    "glob": "**/*",
    "input": "src/assets",
    "output": "assets"
  }
]
```

### Images not displaying

1. Check that images exist in `src/assets/images/drills_images_preview/`
2. Run `node create-placeholders.js` to generate placeholder images
3. Verify image paths in mock data files

### GitHub Pages 404 Error

1. Ensure repository is **public**
2. Check that `gh-pages` branch exists
3. Verify GitHub Pages is configured to use `gh-pages` branch
4. Wait 1-2 minutes for deployment to complete

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ for flag football coaches and players**
