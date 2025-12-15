<template>
  <div
    :class="[
      'bg-white/5 backdrop-blur-md rounded-xl p-4 border transition-all duration-300',
      statusBorderClass,
      'hover:bg-white/10'
    ]"
  >
    <!-- Compact Header Row -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <div :class="[
            'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0',
            statusIconBg
          ]">
            <span class="text-xs">{{ statusEmoji }}</span>
          </div>
          <h3 class="text-base font-bold text-white truncate">
            {{ lang === 'km' ? item.nameKm : item.name }}
          </h3>
        </div>
        <p class="text-xs text-gray-400 truncate">
          {{ lang === 'km' ? item.actionKm : item.action }}
        </p>
      </div>
      <div class="ml-2 flex-shrink-0">
        <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 rounded-lg text-xs font-bold">
          {{ item.estimatedCost }}
        </div>
      </div>
    </div>

    <!-- Compact Info Row -->
    <div class="grid grid-cols-2 gap-2 mb-3">
      <div class="bg-black/20 rounded-lg p-2">
        <p class="text-[10px] text-gray-400 mb-0.5">{{ t('whenToChange') }}</p>
        <p class="text-xs font-semibold text-white">
          <span v-if="item.intervalKm">{{ item.intervalKm.toLocaleString() }} {{ t('km') }}</span>
          <span v-if="item.intervalKm && item.intervalMonths"> / </span>
          <span v-if="item.intervalMonths">{{ item.intervalMonths }}m</span>
        </p>
      </div>
      <div class="bg-red-500/10 rounded-lg p-2 border border-red-500/20">
        <p class="text-[10px] text-red-400 mb-0.5">{{ t('whatHappens') }}</p>
        <p class="text-xs font-semibold text-red-300 line-clamp-2">
          {{ lang === 'km' ? item.riskKm : item.risk }}
        </p>
      </div>
    </div>

    <!-- Status Badge - Compact -->
    <div class="mb-3">
      <div :class="[
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold',
        statusBadgeClass
      ]">
        <span>{{ statusEmoji }}</span>
        <span class="truncate">{{ statusText }}</span>
      </div>
    </div>

    <!-- Last Service & Next Due - Compact -->
    <div v-if="item.lastServiceDate || item.lastServiceKm" class="flex items-center gap-2 mb-3 text-xs">
      <div class="flex-1 bg-blue-500/10 rounded-lg px-2 py-1.5 border border-blue-500/20">
        <p class="text-[10px] text-blue-400 mb-0.5">{{ t('lastService') }}</p>
        <p class="text-xs font-semibold text-blue-300">
          <span v-if="item.lastServiceDate">{{ formatDateShort(item.lastServiceDate) }}</span>
          <span v-if="item.lastServiceDate && item.lastServiceKm"> • </span>
          <span v-if="item.lastServiceKm">{{ item.lastServiceKm.toLocaleString() }}k</span>
        </p>
      </div>
      <div v-if="nextDueInfo" class="flex-1 bg-yellow-500/10 rounded-lg px-2 py-1.5 border border-yellow-500/20">
        <p class="text-[10px] text-yellow-400 mb-0.5">{{ t('nextDue') }}</p>
        <p class="text-xs font-bold text-yellow-300 truncate">{{ nextDueShort }}</p>
      </div>
    </div>

    <!-- Learn More Toggle -->
    <button
      @click="showInfo = !showInfo"
      class="w-full mb-2 py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-gray-300 flex items-center justify-center gap-1.5 transition-colors border border-white/10"
    >
      <span>{{ t('learnMore') }}</span>
      <svg 
        class="w-3 h-3 transition-transform duration-200"
        :class="{ 'rotate-180': showInfo }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Info Section - Compact -->
    <Transition name="slide">
      <div v-if="showInfo" class="mb-2 bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
        <p class="text-xs text-gray-300 leading-relaxed">
          {{ t(item.infoKey) }}
        </p>
      </div>
    </Transition>

    <!-- Update Button - Compact -->
    <button
      @click="openModal"
      class="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg text-sm font-bold hover:from-blue-500 hover:to-cyan-500 transition-all active:scale-95 shadow-lg shadow-blue-500/30"
    >
      {{ t('updateService') }}
    </button>

    <!-- Service Update Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4"
          @click.self="closeModal"
        >
          <div class="bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/10">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-bold text-white">{{ t('updateServiceTitle') }}</h3>
              <button
                @click="closeModal"
                class="text-gray-400 hover:text-white p-1"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">
                  {{ t('serviceDate') }}
                </label>
                <input
                  v-model="serviceDate"
                  type="date"
                  class="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :max="today"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-300 mb-2">
                  {{ t('mileage') }}
                </label>
                <input
                  v-model.number="serviceMileage"
                  type="number"
                  min="0"
                  step="1"
                  class="w-full px-4 py-3 bg-black/40 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :placeholder="t('mileage')"
                />
              </div>

              <div class="flex gap-3 pt-2">
                <button
                  @click="closeModal"
                  class="flex-1 py-3 px-4 bg-white/10 text-gray-300 rounded-lg font-semibold hover:bg-white/20"
                >
                  {{ t('cancel') }}
                </button>
                <button
                  @click="saveService"
                  class="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-cyan-500"
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
  index: {
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

const statusBorderClass = computed(() => {
  if (status.value === 'overdue') return 'border-red-500/50'
  if (status.value === 'due-soon') return 'border-yellow-500/50'
  if (status.value === 'good') return 'border-green-500/50'
  return 'border-white/10'
})

const statusIconBg = computed(() => {
  if (status.value === 'overdue') return 'bg-red-500/20'
  if (status.value === 'due-soon') return 'bg-yellow-500/20'
  if (status.value === 'good') return 'bg-green-500/20'
  return 'bg-gray-500/20'
})

const statusEmoji = computed(() => {
  if (status.value === 'overdue') return '⚠️'
  if (status.value === 'due-soon') return '⏰'
  if (status.value === 'good') return '✓'
  return 'ℹ️'
})

const statusBadgeClass = computed(() => {
  if (status.value === 'overdue') return 'bg-red-500/20 text-red-300 border border-red-500/30'
  if (status.value === 'due-soon') return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
  if (status.value === 'good') return 'bg-green-500/20 text-green-300 border border-green-500/30'
  return 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
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
      info.push(`${props.lang === 'km' ? 'ហួស' : 'Over'} ${Math.abs(remainingKm).toLocaleString()} ${t('km')}`)
    }
  }

  if (item.intervalMonths && lastDate) {
    const nextDate = new Date(lastDate)
    nextDate.setMonth(nextDate.getMonth() + item.intervalMonths)
    const now = new Date()
    const daysUntil = Math.ceil((nextDate - now) / (1000 * 60 * 60 * 24))
    
    if (daysUntil > 0) {
      const monthsUntil = Math.floor(daysUntil / 30)
      if (monthsUntil > 0) {
        info.push(`${props.lang === 'km' ? 'ក្នុង' : 'In'} ${monthsUntil}${props.lang === 'km' ? 'ខែ' : 'm'}`)
      } else {
        info.push(`${props.lang === 'km' ? 'ក្នុង' : 'In'} ${daysUntil}${props.lang === 'km' ? 'ថ្ងៃ' : 'd'}`)
      }
    } else {
      info.push(`${props.lang === 'km' ? 'ហួស' : 'Over'} ${Math.abs(daysUntil)}${props.lang === 'km' ? 'ថ្ងៃ' : 'd'}`)
    }
  }

  return info.length > 0 ? info.join(' • ') : null
})

const nextDueShort = computed(() => {
  if (!nextDueInfo.value) return ''
  // Make it shorter for mobile
  return nextDueInfo.value.replace('In ', '').replace('Over ', '-').substring(0, 15)
})

const formatDateShort = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(props.lang === 'km' ? 'km-KH' : 'en-US', { 
    month: 'short', 
    day: 'numeric',
    year: '2-digit'
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
  max-height: 200px;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-5px);
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
  transform: translateY(20px);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
