<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
    <!-- Language Toggle - Fixed Top Right -->
    <button
      @click="toggleLanguage"
      class="fixed top-3 right-3 z-50 bg-white/10 backdrop-blur-md rounded-full px-3 py-2 flex items-center gap-2 text-white text-xs font-medium hover:bg-white/20 transition-all border border-white/20"
    >
      <span>{{ currentLang === 'en' ? '🇬🇧 EN' : '🇰🇭 KM' }}</span>
    </button>

    <!-- Compact Header -->
    <header class="bg-black/40 backdrop-blur-sm border-b border-white/10 sticky top-0 z-40">
      <div class="px-4 py-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-lg font-bold text-white">{{ t('appName') }}</h1>
              <p class="text-xs text-gray-400">{{ currentMileage.toLocaleString() }} {{ t('km') }}</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-400">{{ t('alerts') }}</div>
            <div class="text-lg font-bold text-yellow-400">{{ activeAlertsCount }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section with Car Slider -->
    <section class="px-4 py-6">
      <div class="mb-4">
        <h2 class="text-2xl font-bold text-white mb-1">
          {{ t('welcome') }}, <span class="text-cyan-400">Lyhuor</span>
        </h2>
        <p class="text-sm text-gray-400">{{ t('subtitle') }}</p>
      </div>
      <CarSlider />
    </section>

    <!-- Total Cost Card - Compact -->
    <div class="px-4 mb-4">
      <div class="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-400 mb-1">{{ t('totalCost') }}</p>
            <p class="text-2xl font-bold text-white">{{ totalMaintenanceValue }}</p>
          </div>
          <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Maintenance Cards - Compact Grid -->
    <main class="px-4 pb-6 space-y-3">
      <MaintenanceCard
        v-for="(item, index) in maintenanceItems"
        :key="item.id"
        :item="item"
        :current-mileage="currentMileage"
        :lang="currentLang"
        :translations="translations[currentLang]"
        :index="index"
        @update-service="handleUpdateService"
      />
    </main>

    <!-- Compact Footer -->
    <footer class="px-4 py-4 text-center border-t border-white/10">
      <p class="text-xs text-gray-500">{{ t('builtFor') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import MaintenanceCard from './components/MaintenanceCard.vue'
import CarSlider from './components/CarSlider.vue'
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
  return total > 0 ? `$${total.toFixed(0)}` : '$0'
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


onMounted(() => {
  if (!maintenanceItems.value || maintenanceItems.value.length === 0) {
    maintenanceItems.value = initialItems
  }
})
</script>

<style scoped>
/* Smooth animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
