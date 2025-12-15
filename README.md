# Prius 011 Caretaker - Digital Maintenance Dashboard

A modern, mobile-first web application for tracking maintenance schedules and costs for a Toyota Prius 2011.

## Features

- 🚗 **Maintenance Tracking**: Track 4 key maintenance items (Engine Oil, Inverter Coolant, EGR System, Cabin Air Filter)
- 💰 **Cost Estimation**: Display estimated costs for each service
- 📅 **Service Logging**: Record service dates and mileage with localStorage persistence
- 🎨 **Status Indicators**: Visual status (Green/Yellow/Red) based on service due dates
- 📱 **Mobile-First Design**: Optimized for touch devices with large, friendly buttons
- 🎯 **Dynamic Calculations**: Automatic "Next Due" calculations based on intervals

## Tech Stack

- **Vue.js 3** (Composition API)
- **Tailwind CSS** (for styling)
- **VueUse** (for localStorage management)
- **Vite** (build tool)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
my-car/
├── src/
│   ├── components/
│   │   └── MaintenanceCard.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Usage

1. **View Maintenance Items**: The dashboard displays all 4 maintenance items with their intervals and estimated costs.

2. **Update Service**: Click "Update Service" on any card to log when a service was performed. Enter the service date and current mileage.

3. **Monitor Status**: 
   - 🟢 **Green**: Service is up to date
   - 🟡 **Yellow**: Service is due soon (80% of interval reached)
   - 🔴 **Red**: Service is overdue

4. **Track Total Cost**: The dashboard shows the total estimated maintenance value for all items that are due soon or overdue.

## Data Persistence

All service records and current mileage are automatically saved to browser localStorage and persist across page refreshes.

## Customization

- Edit `src/App.vue` to modify maintenance items or add new ones
- Customize colors in `tailwind.config.js`
- Adjust styling in `src/style.css`

---

Built for Cambodia Road Conditions 🛣️

