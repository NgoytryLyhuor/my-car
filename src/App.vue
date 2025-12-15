<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-40">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-toyota-blue to-hybrid-blue rounded-lg flex items-center justify-center shadow-md">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl sm:text-2xl font-bold bg-gradient-to-r from-toyota-blue to-hybrid-blue bg-clip-text text-transparent">
                Prius 011 Caretaker
              </h1>
              <p class="text-xs text-gray-500 hidden sm:block">Maintenance Management System</p>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500">Current Mileage</div>
            <div class="text-lg font-semibold text-gray-700">{{ currentMileage.toLocaleString() }} km</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 text-white py-12 md:py-16">
      <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 via-emerald-900/80 to-blue-900/90"></div>
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div class="flex-1 text-center lg:text-left animate-fade-in-up">
            <div class="inline-block mb-3 px-4 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium border border-white/20">
              Welcome Back
            </div>
            <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              Hello, <span class="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">Lyhuor</span>
            </h2>
            <p class="text-lg md:text-xl text-blue-100 mb-6 max-w-2xl">
              Your Toyota Prius 2011 maintenance dashboard. Track services, monitor costs, and keep your hybrid running smoothly.
            </p>
            <div class="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div class="text-xs text-blue-200 mb-1">Total Services</div>
                <div class="text-2xl font-bold">{{ maintenanceItems.length }}</div>
              </div>
              <div class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div class="text-xs text-blue-200 mb-1">Active Alerts</div>
                <div class="text-2xl font-bold">{{ activeAlertsCount }}</div>
              </div>
            </div>
          </div>
          <div class="flex-1 flex justify-center lg:justify-end animate-fade-in-right">
            <div class="relative w-full max-w-md">
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-2xl blur-2xl transform rotate-6"></div>
              <div class="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-2xl">
                <div class="relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-blue-900/50 to-emerald-900/50">
                  <img 
                    src="https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80&auto=format&fit=crop" 
                    alt="Toyota Prius 2011" 
                    class="w-full h-full object-cover rounded-xl shadow-xl transition-transform duration-700 hover:scale-105"
                    @error="handleImageError"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
                </div>
                <div class="mt-4 flex items-center justify-between text-sm">
                  <span class="text-blue-200 font-medium">Toyota Prius</span>
                  <span class="text-emerald-300 font-semibold">2011 Model</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dashboard -->
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 -mt-8 relative z-20">
      <!-- Total Estimated Maintenance Value -->
      <div class="mb-8 animate-fade-in-up" style="animation-delay: 0.1s">
        <div class="bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200/50 backdrop-blur-sm relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div class="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <h3 class="text-lg font-semibold text-gray-800">Total Estimated Maintenance Value</h3>
              </div>
              <p class="text-sm text-gray-600">For items due soon or overdue</p>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                {{ totalMaintenanceValue }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Maintenance Cards Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <TransitionGroup name="card" tag="div" class="contents">
          <MaintenanceCard
            v-for="(item, index) in maintenanceItems"
            :key="item.id"
            :item="item"
            :current-mileage="currentMileage"
            :animation-delay="index * 0.1"
            @update-service="handleUpdateService"
          />
        </TransitionGroup>
      </div>
    </main>

    <!-- Footer -->
    <footer class="mt-16 py-8 bg-white/60 backdrop-blur-sm border-t border-gray-200/50">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p class="text-gray-600 text-sm font-medium">Built for Cambodia Road Conditions</p>
        <p class="text-gray-400 text-xs mt-2">Optimized for Toyota Prius 2011 Maintenance Tracking</p>
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

// Calculate active alerts count
const activeAlertsCount = computed(() => {
  return maintenanceItems.value.filter(item => {
    const status = getServiceStatus(item)
    return status === 'overdue' || status === 'due-soon'
  }).length
})

// Handle image error
const handleImageError = (event) => {
  // Fallback to a different image source if primary fails
  if (event.target.src.includes('unsplash')) {
    event.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop'
  } else {
    // Final fallback - show a styled placeholder
    event.target.style.display = 'none'
    const placeholder = event.target.parentElement
    if (placeholder) {
      placeholder.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-800 to-emerald-800 rounded-xl">
          <svg class="w-24 h-24 text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <p class="text-white/70 font-semibold text-lg">Toyota Prius 2011</p>
        </div>
      `
    }
  }
}

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
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}

.animate-fade-in-right {
  animation: fade-in-right 0.8s ease-out forwards;
}

.card-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.card-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.card-move {
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>

