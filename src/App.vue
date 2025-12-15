<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Language Toggle -->
    <div class="fixed top-4 right-4 z-50">
      <button
        @click="toggleLanguage"
        class="bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <span class="text-sm font-medium">{{ currentLang === 'en' ? '🇬🇧 EN' : '🇰🇭 KM' }}</span>
        <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.196 2.196l-.707.707M6 9H3m3 6H3m9-9h3m-3 9h3m-9-3v3m9-3v3" />
        </svg>
      </button>
    </div>

    <!-- Header -->
    <header class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ t('appName') }}</h1>
              <p class="text-sm text-gray-500">{{ t('currentMileage') }}: {{ currentMileage.toLocaleString() }} {{ t('km') }}</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-4xl md:text-5xl font-bold mb-3">
              {{ t('welcome') }}, <span class="text-yellow-300">Lyhuor</span>
            </h2>
            <p class="text-xl text-blue-100 mb-6">{{ t('subtitle') }}</p>
            <div class="flex gap-4 justify-center md:justify-start">
              <div class="bg-white/20 rounded-lg px-6 py-3 backdrop-blur-sm">
                <div class="text-sm opacity-90">{{ t('totalServices') }}</div>
                <div class="text-3xl font-bold">{{ maintenanceItems.length }}</div>
              </div>
              <div class="bg-white/20 rounded-lg px-6 py-3 backdrop-blur-sm">
                <div class="text-sm opacity-90">{{ t('alerts') }}</div>
                <div class="text-3xl font-bold">{{ activeAlertsCount }}</div>
              </div>
            </div>
          </div>
          <div class="flex-1 flex justify-center">
            <div class="relative">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/2011_Toyota_Prius_--_NHTSA.jpg/800px-2011_Toyota_Prius_--_NHTSA.jpg" 
                alt="Toyota Prius 2011" 
                class="w-full max-w-md rounded-2xl shadow-2xl"
                @error="handleImageError"
                loading="lazy"
              />
              <div class="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-lg px-4 py-2 shadow-lg">
                <p class="text-sm font-semibold text-gray-800">Toyota Prius 2011</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard -->
    <main class="container mx-auto px-4 py-8">
      <!-- Total Cost Card -->
      <div class="mb-8 bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 class="text-xl font-bold text-gray-800 mb-1">{{ t('totalCost') }}</h3>
            <p class="text-sm text-gray-600">{{ t('forDueItems') }}</p>
          </div>
          <div class="text-4xl font-bold text-blue-600">
            {{ totalMaintenanceValue }}
          </div>
        </div>
      </div>

      <!-- Maintenance Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MaintenanceCard
          v-for="(item, index) in maintenanceItems"
          :key="item.id"
          :item="item"
          :current-mileage="currentMileage"
          :lang="currentLang"
          :translations="translations[currentLang]"
          :animation-delay="index * 0.1"
          @update-service="handleUpdateService"
        />
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-12 py-6 bg-white border-t text-center">
      <p class="text-gray-600">{{ t('builtFor') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import MaintenanceCard from './components/MaintenanceCard.vue'
import { translations, maintenanceItemsData } from './utils/translations.js'

// Language
const currentLang = useStorage('prius-lang', 'en')
const t = (key) => translations[currentLang.value][key] || key

// Toggle language
const toggleLanguage = () => {
  currentLang.value = currentLang.value === 'en' ? 'km' : 'en'
}

// Current mileage
const currentMileage = useStorage('prius-current-mileage', 0)

// Maintenance items
const initialItems = maintenanceItemsData.en.map(item => ({
  ...item,
  lastServiceDate: null,
  lastServiceKm: null
}))

const maintenanceItems = useStorage('prius-maintenance-items', initialItems)

// Active alerts
const activeAlertsCount = computed(() => {
  return maintenanceItems.value.filter(item => {
    const status = getServiceStatus(item)
    return status === 'overdue' || status === 'due-soon'
  }).length
})

// Total maintenance value
const totalMaintenanceValue = computed(() => {
  let total = 0
  maintenanceItems.value.forEach(item => {
    const status = getServiceStatus(item)
    if (status === 'overdue' || status === 'due-soon') {
      const costMatch = item.estimatedCost.match(/\$(\d+)\s*-\s*\$(\d+)/)
      if (costMatch) {
        const min = parseInt(costMatch[1])
        const max = parseInt(costMatch[2])
        total += (min + max) / 2
      }
    }
  })
  return total > 0 ? `$${total.toFixed(0)} USD` : '$0 USD'
})

// Get service status
const getServiceStatus = (item) => {
  if (!item.lastServiceDate && !item.lastServiceKm) {
    return 'unknown'
  }

  const now = new Date()
  const lastDate = item.lastServiceDate ? new Date(item.lastServiceDate) : null
  const lastKm = item.lastServiceKm || 0
  const currentKm = currentMileage.value || 0

  let isOverdue = false
  let isDueSoon = false

  if (item.intervalKm && lastKm) {
    const kmSinceService = currentKm - lastKm
    if (kmSinceService >= item.intervalKm) {
      isOverdue = true
    } else if (kmSinceService >= item.intervalKm * 0.8) {
      isDueSoon = true
    }
  }

  if (item.intervalMonths && lastDate) {
    const monthsSinceService = (now - lastDate) / (1000 * 60 * 60 * 24 * 30)
    if (monthsSinceService >= item.intervalMonths) {
      isOverdue = true
    } else if (monthsSinceService >= item.intervalMonths * 0.8) {
      isDueSoon = true
    }
  }

  if (isOverdue) return 'overdue'
  if (isDueSoon) return 'due-soon'
  return 'good'
}

// Handle service update
const handleUpdateService = (itemId, serviceData) => {
  const item = maintenanceItems.value.find(i => i.id === itemId)
  if (item) {
    item.lastServiceDate = serviceData.date
    item.lastServiceKm = serviceData.mileage
    if (serviceData.mileage > currentMileage.value) {
      currentMileage.value = serviceData.mileage
    }
  }
}

// Handle image error
const handleImageError = (event) => {
  event.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop'
}

onMounted(() => {
  if (!maintenanceItems.value || maintenanceItems.value.length === 0) {
    maintenanceItems.value = initialItems
  }
})
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
