<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-2xl md:text-3xl font-bold text-toyota-blue">
          🚗 Prius 011 Caretaker
        </h1>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-hybrid-blue to-hybrid-green text-white py-8 md:py-12">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row items-center gap-6">
          <div class="flex-1 text-center md:text-left">
            <h2 class="text-3xl md:text-4xl font-bold mb-2">Hello, Lyhuor</h2>
            <p class="text-lg md:text-xl opacity-90">Your Toyota Prius 2011 Maintenance Dashboard</p>
          </div>
          <div class="flex-1 flex justify-center">
            <div class="w-48 h-32 md:w-64 md:h-40 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
              <span class="text-6xl md:text-8xl">🚙</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard -->
    <main class="container mx-auto px-4 py-8">
      <!-- Total Estimated Maintenance Value -->
      <div class="mb-8">
        <div class="bg-white rounded-xl shadow-md p-6 border-l-4 border-toyota-green">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 class="text-lg font-semibold text-gray-700 mb-1">Total Estimated Maintenance Value</h3>
              <p class="text-sm text-gray-500">For items due soon or overdue</p>
            </div>
            <div class="text-3xl md:text-4xl font-bold text-toyota-green">
              {{ totalMaintenanceValue }}
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <TransitionGroup name="card" tag="div" class="contents">
          <MaintenanceCard
            v-for="item in maintenanceItems"
            :key="item.id"
            :item="item"
            :current-mileage="currentMileage"
            @update-service="handleUpdateService"
          />
        </TransitionGroup>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-12 py-6 bg-white border-t border-gray-200">
      <div class="container mx-auto px-4 text-center">
        <p class="text-gray-600 text-sm">Built for Cambodia Road Conditions</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStorage } from '@vueuse/core'
import MaintenanceCard from './components/MaintenanceCard.vue'

// User name
const userName = 'Lyhuor'

// Current mileage - stored in localStorage
const currentMileage = useStorage('prius-current-mileage', 0)

// Initial maintenance items data
const initialMaintenanceItems = [
  {
    id: 1,
    name: 'Engine Oil',
    action: 'Change Oil (0W-20) & Filter',
    intervalKm: 8000,
    intervalMonths: null,
    risk: 'Engine wear/High fuel consumption',
    estimatedCost: '$80 - $125 USD',
    lastServiceDate: null,
    lastServiceKm: null
  },
  {
    id: 2,
    name: 'Inverter Coolant',
    action: 'Flush & Change (Toyota SLLC Pink)',
    intervalKm: 80000,
    intervalMonths: 60,
    risk: 'Inverter overheating (Critical)',
    estimatedCost: '$300 - $400 USD',
    lastServiceDate: null,
    lastServiceKm: null
  },
  {
    id: 3,
    name: 'EGR System',
    action: 'Clean EGR Valve & Cooler',
    intervalKm: 100000,
    intervalMonths: null,
    risk: 'Head Gasket Failure',
    estimatedCost: '$50 - $100 USD',
    lastServiceDate: null,
    lastServiceKm: null
  },
  {
    id: 4,
    name: 'Cabin Air Filter',
    action: 'Replace Filter',
    intervalKm: null,
    intervalMonths: 9,
    risk: 'Bad smell/Weak AC',
    estimatedCost: '$10 - $20 USD',
    lastServiceDate: null,
    lastServiceKm: null
  }
]

// Maintenance items - stored in localStorage
const maintenanceItems = useStorage('prius-maintenance-items', initialMaintenanceItems)

// Calculate total maintenance value for overdue/due soon items
const totalMaintenanceValue = computed(() => {
  let total = 0
  maintenanceItems.value.forEach(item => {
    const status = getServiceStatus(item)
    if (status === 'overdue' || status === 'due-soon') {
      // Extract numeric range from cost string (e.g., "$80 - $125 USD" -> average)
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

// Get service status for an item
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

  // Check by mileage
  if (item.intervalKm && lastKm) {
    const kmSinceService = currentKm - lastKm
    if (kmSinceService >= item.intervalKm) {
      isOverdue = true
    } else if (kmSinceService >= item.intervalKm * 0.8) {
      isDueSoon = true
    }
  }

  // Check by months
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
    // Update current mileage if the new mileage is higher
    if (serviceData.mileage > currentMileage.value) {
      currentMileage.value = serviceData.mileage
    }
  }
}

onMounted(() => {
  // Ensure maintenance items are initialized
  if (!maintenanceItems.value || maintenanceItems.value.length === 0) {
    maintenanceItems.value = initialMaintenanceItems
  }
})
</script>

<style scoped>
.card-enter-active,
.card-leave-active {
  transition: all 0.3s ease;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>

