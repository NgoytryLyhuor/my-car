<template>
  <div class="relative w-full">
    <!-- Car Image Slider -->
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 shadow-2xl">
      <!-- Main Image Container -->
      <div class="relative aspect-[4/3] overflow-hidden">
        <Transition name="fade" mode="out-in">
          <img
            :key="currentIndex"
            :src="images[currentIndex]"
            :alt="`Toyota Prius 2011 - View ${currentIndex + 1}`"
            class="w-full h-full object-cover"
            @error="handleImageError"
            loading="lazy"
          />
        </Transition>
        
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        <!-- Car Info Badge -->
        <div class="absolute bottom-4 left-4 right-4">
          <div class="bg-white/10 backdrop-blur-md rounded-xl px-4 py-3 border border-white/20">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-white font-bold text-lg mb-0.5">Toyota Prius</h3>
                <p class="text-gray-300 text-sm">2011 Model</p>
              </div>
              <div class="text-right">
                <div class="text-xs text-gray-400 mb-1">View</div>
                <div class="text-white font-bold text-lg">{{ currentIndex + 1 }}/{{ images.length }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Arrows -->
      <button
        @click="previousImage"
        class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 z-10"
        aria-label="Previous image"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        @click="nextImage"
        class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/20 transition-all border border-white/20 z-10"
        aria-label="Next image"
      >
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Dots Indicator -->
      <div class="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="currentIndex = index"
          :class="[
            'w-2 h-2 rounded-full transition-all duration-300',
            currentIndex === index 
              ? 'bg-white w-6' 
              : 'bg-white/40 hover:bg-white/60'
          ]"
          :aria-label="`Go to image ${index + 1}`"
        />
      </div>
    </div>

    <!-- Thumbnail Strip (Optional - for desktop) -->
    <div class="hidden md:flex gap-2 mt-3 overflow-x-auto pb-2">
      <button
        v-for="(image, index) in images"
        :key="index"
        @click="currentIndex = index"
        :class="[
          'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all',
          currentIndex === index 
            ? 'border-cyan-400 shadow-lg shadow-cyan-400/50' 
            : 'border-white/20 hover:border-white/40'
        ]"
      >
        <img
          :src="image"
          :alt="`Thumbnail ${index + 1}`"
          class="w-full h-full object-cover"
          @error="handleImageError"
        />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  }
})

const currentIndex = ref(0)
let autoPlayInterval = null

// Import local Prius images
import prius1 from '../images/prius-1.jpg'
import prius2 from '../images/prius-2.jpg'
import prius3 from '../images/prius-3.jpg'

// Prius 2011 images - using local images
const defaultImages = [
  prius1,
  prius2,
  prius3
]

const images = ref(props.images.length > 0 ? props.images : defaultImages)

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % images.value.length
}

const previousImage = () => {
  currentIndex.value = currentIndex.value === 0 ? images.value.length - 1 : currentIndex.value - 1
}

const handleImageError = (event) => {
  // Try fallback images
  const fallbackImages = [
    'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80&auto=format&fit=crop',
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/2011_Toyota_Prius_--_NHTSA.jpg/800px-2011_Toyota_Prius_--_NHTSA.jpg'
  ]
  
  const currentSrc = event.target.src
  const currentIndexInArray = images.value.findIndex(img => img === currentSrc)
  
  if (currentIndexInArray !== -1 && fallbackImages.length > 0) {
    images.value[currentIndexInArray] = fallbackImages[0]
    fallbackImages.shift()
  } else {
    // Final fallback - show placeholder
    event.target.style.display = 'none'
    const parent = event.target.parentElement
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-600">
          <svg class="w-16 h-16 text-white/50 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          <p class="text-white/70 font-semibold">Toyota Prius 2011</p>
        </div>
      `
    }
  }
}

// Auto-play (optional - can be disabled)
const startAutoPlay = () => {
  autoPlayInterval = setInterval(() => {
    nextImage()
  }, 5000) // Change image every 5 seconds
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => {
  // Start auto-play
  startAutoPlay()
})

onUnmounted(() => {
  stopAutoPlay()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: scale(1.05);
}

.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* Hide scrollbar for thumbnail strip */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

