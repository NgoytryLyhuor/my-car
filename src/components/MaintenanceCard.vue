<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-md p-6 border-l-4 transition-all duration-300 hover:shadow-lg',
      statusClass
    ]"
    :style="{ animationDelay: `${animationDelay}s` }"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <h3 class="text-xl font-bold text-gray-900 mb-1">
          {{ lang === 'km' ? item.nameKm : item.name }}
        </h3>
        <p class="text-sm text-gray-600">
          {{ lang === 'km' ? item.actionKm : item.action }}
        </p>
      </div>
      <div class="bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-sm">
        {{ item.estimatedCost }}
      </div>
    </div>

    <!-- Status Badge -->
    <div class="mb-4">
      <div :class="[
        'inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm',
        statusBadgeClass
      ]">
        <span v-if="status === 'overdue'">⚠️</span>
        <span v-else-if="status === 'due-soon'">⏰</span>
        <span v-else-if="status === 'good'">✓</span>
        <span v-else>ℹ️</span>
        <span>{{ statusText }}</span>
      </div>
    </div>

    <!-- Details -->
    <div class="space-y-3 mb-4">
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="text-xs text-gray-500 mb-1 font-semibold">{{ t('whenToChange') }}</div>
        <div class="text-sm font-semibold text-gray-800">
          <span v-if="item.intervalKm">{{ item.intervalKm.toLocaleString() }} {{ t('km') }}</span>
          <span v-if="item.intervalKm && item.intervalMonths"> {{ lang === 'km' ? 'ឬ' : 'or' }} </span>
          <span v-if="item.intervalMonths">{{ item.intervalMonths }} {{ lang === 'km' ? 'ខែ' : 'months' }}</span>
        </div>
      </div>
      
      <div class="bg-red-50 rounded-lg p-3">
        <div class="text-xs text-red-600 mb-1 font-semibold">{{ t('whatHappens') }}</div>
        <div class="text-sm font-semibold text-red-700">
          {{ lang === 'km' ? item.riskKm : item.risk }}
        </div>
      </div>
    </div>

    <!-- Last Service -->
    <div v-if="item.lastServiceDate || item.lastServiceKm" class="mb-4 bg-blue-50 rounded-lg p-3">
      <div class="text-xs text-blue-600 mb-1 font-semibold">{{ t('lastService') }}</div>
      <div class="text-sm font-semibold text-gray-800">
        <span v-if="item.lastServiceDate">{{ formatDate(item.lastServiceDate) }}</span>
        <span v-if="item.lastServiceDate && item.lastServiceKm"> • </span>
        <span v-if="item.lastServiceKm">{{ item.lastServiceKm.toLocaleString() }} {{ t('km') }}</span>
      </div>
    </div>

    <!-- Next Due -->
    <div v-if="nextDueInfo" class="mb-4 bg-yellow-50 rounded-lg p-3">
      <div class="text-xs text-yellow-600 mb-1 font-semibold">{{ t('nextDue') }}</div>
      <div class="text-sm font-bold text-yellow-800">{{ nextDueInfo }}</div>
    </div>

    <!-- Learn More Button -->
    <button
      @click="showInfo = !showInfo"
      class="w-full mb-3 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
    >
      <span>{{ t('learnMore') }}</span>
      <svg 
        class="w-5 h-5 transition-transform duration-300"
        :class="{ 'rotate-180': showInfo }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Info Section -->
    <Transition name="slide">
      <div v-if="showInfo" class="mb-4 bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p class="text-sm text-gray-700 leading-relaxed">
          {{ t(item.infoKey) }}
        </p>
      </div>
    </Transition>

    <!-- Update Service Button -->
    <button
      @click="openModal"
      class="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
    >
      {{ t('updateService') }}
    </button>

    <!-- Service Update Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          @click.self="closeModal"
        >
          <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold text-gray-900">{{ t('updateServiceTitle') }}</h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-gray-600"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('serviceDate') }}
                </label>
                <input
                  v-model="serviceDate"
                  type="date"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :max="today"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  {{ t('mileage') }}
                </label>
                <input
                  v-model.number="serviceMileage"
                  type="number"
                  min="0"
                  step="1"
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="t('mileage')"
                />
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  @click="closeModal"
                  class="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                >
                  {{ t('cancel') }}
                </button>
                <button
                  @click="saveService"
                  class="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                >
                  {{ t('save') }}
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
  lang: {
    type: String,
    default: 'en'
  },
  translations: {
    type: Object,
    required: true
  },
  animationDelay: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update-service'])

const showModal = ref(false)
const showInfo = ref(false)
const serviceDate = ref('')
const serviceMileage = ref(null)

const t = (key) => props.translations[key] || key

const today = computed(() => {
  const date = new Date()
  return date.toISOString().split('T')[0]
})

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
})

const statusClass = computed(() => {
  if (status.value === 'overdue') return 'border-red-500'
  if (status.value === 'due-soon') return 'border-yellow-500'
  if (status.value === 'good') return 'border-green-500'
  return 'border-gray-300'
})

const statusBadgeClass = computed(() => {
  if (status.value === 'overdue') return 'bg-red-100 text-red-700'
  if (status.value === 'due-soon') return 'bg-yellow-100 text-yellow-700'
  if (status.value === 'good') return 'bg-green-100 text-green-700'
  return 'bg-gray-100 text-gray-700'
})

const statusText = computed(() => {
  if (status.value === 'overdue') return t('overdue')
  if (status.value === 'due-soon') return t('dueSoon')
  if (status.value === 'good') return t('allGood')
  return t('noRecord')
})

const nextDueInfo = computed(() => {
  const item = props.item
  if (!item.lastServiceDate && !item.lastServiceKm) {
    return null
  }

  const lastDate = item.lastServiceDate ? new Date(item.lastServiceDate) : null
  const lastKm = item.lastServiceKm || 0
  const currentKm = props.currentMileage || 0

  const info = []

  if (item.intervalKm && lastKm) {
    const nextKm = lastKm + item.intervalKm
    const remainingKm = nextKm - currentKm
    if (remainingKm > 0) {
      info.push(`${props.lang === 'km' ? 'ក្នុង' : 'In'} ${remainingKm.toLocaleString()} ${t('km')}`)
    } else {
      info.push(`${props.lang === 'km' ? 'ហួសពេល' : 'Overdue by'} ${Math.abs(remainingKm).toLocaleString()} ${t('km')}`)
    }
  }

  if (item.intervalMonths && lastDate) {
    const nextDate = new Date(lastDate)
    nextDate.setMonth(nextDate.getMonth() + item.intervalMonths)
    const now = new Date()
    const daysUntil = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))
    
    if (daysUntil > 0) {
      const monthsUntil = Math.floor(daysUntil / 30)
      const daysRemaining = daysUntil % 30
      if (monthsUntil > 0) {
        info.push(`${props.lang === 'km' ? 'ក្នុង' : 'In'} ${monthsUntil} ${props.lang === 'km' ? 'ខែ' : 'month' + (monthsUntil > 1 ? 's' : '')}${daysRemaining > 0 ? ` ${daysRemaining} ${props.lang === 'km' ? 'ថ្ងៃ' : 'day' + (daysRemaining > 1 ? 's' : '')}` : ''}`)
      } else {
        info.push(`${props.lang === 'km' ? 'ក្នុង' : 'In'} ${daysUntil} ${props.lang === 'km' ? 'ថ្ងៃ' : 'day' + (daysUntil > 1 ? 's' : '')}`)
      }
    } else {
      info.push(`${props.lang === 'km' ? 'ហួសពេល' : 'Overdue by'} ${Math.abs(daysUntil)} ${props.lang === 'km' ? 'ថ្ងៃ' : 'day' + (Math.abs(daysUntil) > 1 ? 's' : '')}`)
    }
  }

  return info.length > 0 ? info.join(' • ') : null
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(props.lang === 'km' ? 'km-KH' : 'en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  })
}

const openModal = () => {
  serviceDate.value = props.item.lastServiceDate || today.value
  serviceMileage.value = props.item.lastServiceKm || props.currentMileage || null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveService = () => {
  if (!serviceDate.value) {
    alert(props.lang === 'km' ? 'សូមជ្រើសរើសកាលបរិច្ឆេទ' : 'Please select a service date')
    return
  }
  if (serviceMileage.value === null || serviceMileage.value < 0) {
    alert(props.lang === 'km' ? 'សូមបញ្ចូលចម្ងាយត្រឹមត្រូវ' : 'Please enter a valid mileage')
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
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.9) translateY(20px);
}
</style>
