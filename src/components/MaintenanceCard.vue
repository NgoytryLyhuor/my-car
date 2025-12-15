<template>
  <div
    :class="[
      'maintenance-card bg-white rounded-2xl shadow-lg p-6 md:p-8 border-l-4 relative overflow-hidden group',
      statusClass,
      `card-delay-${animationDelay}`
    ]"
    :style="{ animationDelay: `${animationDelay}s` }"
  >
    <!-- Background gradient effect -->
    <div :class="[
      'absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 transition-opacity duration-500',
      statusGradient
    ]"></div>

    <!-- Header with Name and Cost Badge -->
    <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 relative z-10">
      <div class="flex-1">
        <div class="flex items-center gap-3 mb-2">
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110',
            statusIconBg
          ]">
            <svg v-if="status === 'overdue'" :class="['w-6 h-6', statusIconColor]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="status === 'due-soon'" :class="['w-6 h-6', statusIconColor]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <svg v-else-if="status === 'good'" :class="['w-6 h-6', statusIconColor]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            <svg v-else :class="['w-6 h-6', statusIconColor]" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 class="text-xl md:text-2xl font-bold text-gray-900 mb-1">{{ item.name }}</h3>
            <p class="text-sm text-gray-600">{{ item.action }}</p>
          </div>
        </div>
      </div>
      <div class="flex-shrink-0">
        <div class="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/30 transform transition-all duration-300 hover:scale-105">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.613 1.242.977 2 1.132V18a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 16.766 14 15.991 14 15c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 12.092V10.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.613-1.242-.977-2-1.132V6z" clip-rule="evenodd" />
          </svg>
          <span>{{ item.estimatedCost }}</span>
        </div>
      </div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 relative z-10">
      <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Interval</span>
        </div>
        <p class="text-sm font-semibold text-gray-800">
          <span v-if="item.intervalKm">{{ item.intervalKm.toLocaleString() }} km</span>
          <span v-if="item.intervalKm && item.intervalMonths"> or </span>
          <span v-if="item.intervalMonths">{{ item.intervalMonths }} months</span>
        </p>
      </div>
      <div class="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div class="flex items-center gap-2 mb-2">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Risk Level</span>
        </div>
        <p class="text-sm font-semibold text-gray-800">{{ item.risk }}</p>
      </div>
    </div>

    <!-- Status Badge -->
    <div class="mb-6 relative z-10">
      <div :class="[
        'inline-flex items-center gap-3 px-5 py-3 rounded-xl font-semibold text-sm shadow-md transition-all duration-300',
        statusBadgeClass
      ]">
        <svg v-if="status === 'overdue'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="status === 'due-soon'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="status === 'good'" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span>{{ statusText }}</span>
      </div>
    </div>

    <!-- Progress Bar (if service record exists) -->
    <div v-if="progressPercentage !== null" class="mb-6 relative z-10">
      <div class="flex items-center justify-between text-xs text-gray-600 mb-2">
        <span>Service Progress</span>
        <span class="font-semibold">{{ Math.round(progressPercentage) }}%</span>
      </div>
      <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          :class="[
            'h-full rounded-full transition-all duration-1000 ease-out',
            progressBarClass
          ]"
          :style="{ width: `${progressPercentage}%` }"
        ></div>
      </div>
    </div>

    <!-- Last Service Info -->
    <div v-if="item.lastServiceDate || item.lastServiceKm" class="mb-6 p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-100 relative z-10">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs font-semibold text-blue-700 uppercase tracking-wide">Last Service</p>
      </div>
      <div class="text-sm font-semibold text-gray-800">
        <span v-if="item.lastServiceDate" class="text-blue-700">
          {{ formatDate(item.lastServiceDate) }}
        </span>
        <span v-if="item.lastServiceDate && item.lastServiceKm" class="text-gray-400 mx-2">•</span>
        <span v-if="item.lastServiceKm" class="text-emerald-700">
          {{ item.lastServiceKm.toLocaleString() }} km
        </span>
      </div>
    </div>

    <!-- Next Due Calculation -->
    <div v-if="nextDueInfo" class="mb-6 p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 relative z-10">
      <div class="flex items-center gap-2 mb-2">
        <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xs font-semibold text-amber-700 uppercase tracking-wide">Next Due</p>
      </div>
      <p class="text-sm font-bold text-amber-900">{{ nextDueInfo }}</p>
    </div>

    <!-- Update Service Button -->
    <button
      @click="openModal"
      class="w-full py-4 px-6 bg-gradient-to-r from-toyota-blue to-hybrid-blue text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative z-10 group"
    >
      <span class="flex items-center justify-center gap-2">
        <svg class="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Update Service Record
      </span>
    </button>

    <!-- Service Update Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 transform transition-all duration-300">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-2xl font-bold text-gray-900">Update Service</h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Service Date
                </label>
                <input
                  v-model="serviceDate"
                  type="date"
                  class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-toyota-blue focus:border-toyota-blue transition-all duration-200 text-base"
                  :max="today"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Current Mileage (km)
                </label>
                <input
                  v-model.number="serviceMileage"
                  type="number"
                  min="0"
                  step="1"
                  class="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-toyota-blue focus:border-toyota-blue transition-all duration-200 text-base"
                  placeholder="Enter mileage"
                />
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  @click="closeModal"
                  class="flex-1 py-3.5 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 active:scale-95"
                >
                  Cancel
                </button>
                <button
                  @click="saveService"
                  class="flex-1 py-3.5 px-4 bg-gradient-to-r from-toyota-blue to-hybrid-blue text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-95"
                >
                  Save Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
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
  },
  animationDelay: {
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
  if (status.value === 'good') return 'border-emerald-500'
  return 'border-gray-300'
})

// Status gradient
const statusGradient = computed(() => {
  if (status.value === 'overdue') return 'bg-red-400'
  if (status.value === 'due-soon') return 'bg-yellow-400'
  if (status.value === 'good') return 'bg-emerald-400'
  return 'bg-gray-400'
})


// Status icon background
const statusIconBg = computed(() => {
  if (status.value === 'overdue') return 'bg-red-100'
  if (status.value === 'due-soon') return 'bg-yellow-100'
  if (status.value === 'good') return 'bg-emerald-100'
  return 'bg-gray-100'
})

// Status icon color
const statusIconColor = computed(() => {
  if (status.value === 'overdue') return 'text-red-600'
  if (status.value === 'due-soon') return 'text-yellow-600'
  if (status.value === 'good') return 'text-emerald-600'
  return 'text-gray-600'
})

// Status badge class
const statusBadgeClass = computed(() => {
  if (status.value === 'overdue') return 'bg-red-50 text-red-700 border border-red-200'
  if (status.value === 'due-soon') return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
  if (status.value === 'good') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  return 'bg-gray-50 text-gray-700 border border-gray-200'
})

// Status text
const statusText = computed(() => {
  if (status.value === 'overdue') return '⚠️ OVERDUE - Service Required Immediately'
  if (status.value === 'due-soon') return '⏰ Due Soon - Schedule Service'
  if (status.value === 'good') return '✓ All Good - Service Up to Date'
  return 'ℹ️ No Service Record'
})

// Progress percentage
const progressPercentage = computed(() => {
  const item = props.item
  if (!item.lastServiceDate && !item.lastServiceKm) {
    return null
  }

  const lastKm = item.lastServiceKm || 0
  const currentKm = props.currentMileage || 0

  if (item.intervalKm && lastKm) {
    const kmSinceService = currentKm - lastKm
    const percentage = (kmSinceService / item.intervalKm) * 100
    return Math.min(percentage, 100)
  }

  if (item.intervalMonths && item.lastServiceDate) {
    const lastDate = new Date(item.lastServiceDate)
    const now = new Date()
    const monthsSinceService = (now - lastDate) / (1000 * 60 * 60 * 24 * 30)
    const percentage = (monthsSinceService / item.intervalMonths) * 100
    return Math.min(percentage, 100)
  }

  return null
})

// Progress bar class
const progressBarClass = computed(() => {
  if (status.value === 'overdue') return 'bg-gradient-to-r from-red-500 to-red-600'
  if (status.value === 'due-soon') return 'bg-gradient-to-r from-yellow-500 to-yellow-600'
  if (status.value === 'good') return 'bg-gradient-to-r from-emerald-500 to-emerald-600'
  return 'bg-gradient-to-r from-gray-400 to-gray-500'
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
.maintenance-card {
  animation: fade-in-up 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-enter-to > div,
.modal-leave-from > div {
  transform: scale(1) translateY(0);
  opacity: 1;
}
</style>

