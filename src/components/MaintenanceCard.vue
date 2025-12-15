<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-md p-6 border-l-4 card-hover',
      statusClass
    ]"
  >
    <!-- Header with Name and Cost Badge -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-800 mb-1">{{ item.name }}</h3>
        <p class="text-sm text-gray-600">{{ item.action }}</p>
      </div>
      <div class="flex-shrink-0">
        <span class="inline-block px-4 py-2 bg-hybrid-green text-white rounded-full text-sm font-semibold shadow-sm">
          {{ item.estimatedCost }}
        </span>
      </div>
    </div>

    <!-- Details -->
    <div class="space-y-2 mb-4">
      <div class="flex items-start gap-2">
        <span class="text-gray-500 text-sm min-w-[100px]">Interval:</span>
        <span class="text-gray-700 text-sm">
          <span v-if="item.intervalKm">{{ item.intervalKm.toLocaleString() }} km</span>
          <span v-if="item.intervalKm && item.intervalMonths"> or </span>
          <span v-if="item.intervalMonths">{{ item.intervalMonths }} months</span>
        </span>
      </div>
      <div class="flex items-start gap-2">
        <span class="text-gray-500 text-sm min-w-[100px]">Risk:</span>
        <span class="text-gray-700 text-sm">{{ item.risk }}</span>
      </div>
    </div>

    <!-- Status Indicator -->
    <div class="mb-4">
      <div v-if="status === 'overdue'" class="flex items-center gap-2 text-red-600 font-semibold">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <span>OVERDUE - Service Required Immediately</span>
      </div>
      <div v-else-if="status === 'due-soon'" class="flex items-center gap-2 text-yellow-600 font-semibold">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>Due Soon - Schedule Service</span>
      </div>
      <div v-else-if="status === 'good'" class="flex items-center gap-2 text-green-600 font-semibold">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <span>All Good</span>
      </div>
      <div v-else class="flex items-center gap-2 text-gray-500 font-semibold">
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span>No Service Record</span>
      </div>
    </div>

    <!-- Last Service Info -->
    <div v-if="item.lastServiceDate || item.lastServiceKm" class="mb-4 p-3 bg-gray-50 rounded-lg">
      <p class="text-xs text-gray-600 mb-1">Last Service:</p>
      <div class="text-sm text-gray-700">
        <span v-if="item.lastServiceDate">
          {{ formatDate(item.lastServiceDate) }}
        </span>
        <span v-if="item.lastServiceDate && item.lastServiceKm"> • </span>
        <span v-if="item.lastServiceKm">
          {{ item.lastServiceKm.toLocaleString() }} km
        </span>
      </div>
    </div>

    <!-- Next Due Calculation -->
    <div v-if="nextDueInfo" class="mb-4 p-3 bg-blue-50 rounded-lg">
      <p class="text-xs text-blue-600 mb-1">Next Due:</p>
      <p class="text-sm font-semibold text-blue-700">{{ nextDueInfo }}</p>
    </div>

    <!-- Update Service Button -->
    <button
      @click="openModal"
      class="w-full py-3 px-4 bg-toyota-blue text-white rounded-lg font-semibold hover:bg-toyota-blue/90 transition-colors duration-200 active:scale-95 touch-manipulation"
    >
      Update Service
    </button>

    <!-- Service Update Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-800">Update Service</h3>
          <button
            @click="closeModal"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Service Date
            </label>
            <input
              v-model="serviceDate"
              type="date"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-toyota-blue focus:border-transparent text-lg"
              :max="today"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Current Mileage (km)
            </label>
            <input
              v-model.number="serviceMileage"
              type="number"
              min="0"
              step="1"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-toyota-blue focus:border-transparent text-lg"
              placeholder="Enter mileage"
            />
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="closeModal"
              class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              @click="saveService"
              class="flex-1 py-3 px-4 bg-toyota-blue text-white rounded-lg font-semibold hover:bg-toyota-blue/90 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  currentMileage: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update-service'])

const showModal = ref(false)
const serviceDate = ref('')
const serviceMileage = ref(null)

// Get today's date in YYYY-MM-DD format
const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

// Calculate service status
const status = computed(() => {
  const item = props.item
  if (!item.lastServiceDate && !item.lastServiceKm) {
    return 'unknown'
  }

  const now = new Date()
  const lastDate = item.lastServiceDate ? new Date(item.lastServiceDate) : null
  const lastKm = item.lastServiceKm || 0
  const currentKm = props.currentMileage || 0

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
})

// Status class for border color
const statusClass = computed(() => {
  if (status.value === 'overdue') return 'border-red-500'
  if (status.value === 'due-soon') return 'border-yellow-500'
  if (status.value === 'good') return 'border-green-500'
  return 'border-gray-300'
})

// Calculate next due information
const nextDueInfo = computed(() => {
  const item = props.item
  if (!item.lastServiceDate && !item.lastServiceKm) {
    return null
  }

  const lastDate = item.lastServiceDate ? new Date(item.lastServiceDate) : null
  const lastKm = item.lastServiceKm || 0
  const currentKm = props.currentMileage || 0

  const info = []

  // Next due by mileage
  if (item.intervalKm && lastKm) {
    const nextKm = lastKm + item.intervalKm
    const remainingKm = nextKm - currentKm
    if (remainingKm > 0) {
      info.push(`In ${remainingKm.toLocaleString()} km`)
    } else {
      info.push(`Overdue by ${Math.abs(remainingKm).toLocaleString()} km`)
    }
  }

  // Next due by months
  if (item.intervalMonths && lastDate) {
    const nextDate = new Date(lastDate)
    nextDate.setMonth(nextDate.getMonth() + item.intervalMonths)
    const now = new Date()
    const daysUntil = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))
    
    if (daysUntil > 0) {
      const monthsUntil = Math.floor(daysUntil / 30)
      const daysRemaining = daysUntil % 30
      if (monthsUntil > 0) {
        info.push(`In ${monthsUntil} month${monthsUntil > 1 ? 's' : ''}${daysRemaining > 0 ? ` ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}` : ''}`)
      } else {
        info.push(`In ${daysUntil} day${daysUntil > 1 ? 's' : ''}`)
      }
    } else {
      info.push(`Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) > 1 ? 's' : ''}`)
    }
  }

  return info.length > 0 ? info.join(' • ') : null
})

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Open modal with current values
const openModal = () => {
  serviceDate.value = props.item.lastServiceDate || today.value
  serviceMileage.value = props.item.lastServiceKm || props.currentMileage || null
  showModal.value = true
}

// Close modal
const closeModal = () => {
  showModal.value = false
}

// Save service
const saveService = () => {
  if (!serviceDate.value) {
    alert('Please select a service date')
    return
  }
  if (serviceMileage.value === null || serviceMileage.value < 0) {
    alert('Please enter a valid mileage')
    return
  }

  emit('update-service', props.item.id, {
    date: serviceDate.value,
    mileage: serviceMileage.value
  })

  closeModal()
}
</script>

<style scoped>
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.2s ease-out;
}

.touch-manipulation {
  touch-action: manipulation;
}
</style>

