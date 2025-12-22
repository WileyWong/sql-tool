# Vue.js Official Documentation

This is the official documentation repository for Vue.js 3, a progressive JavaScript framework for building user interfaces. Built with VitePress, the documentation site provides comprehensive guides, API references, and examples covering Vue 3's Composition API, Options API, reactivity system, component architecture, and TypeScript integration. The project serves as both a learning resource for developers new to Vue and a detailed reference for experienced users.

The documentation is structured into multiple sections including essential concepts (template syntax, reactivity, components), in-depth component guides (props, events, slots), scaling-up topics (SFC, routing, state management, SSR), best practices, and complete API references. It supports multiple language translations, includes interactive examples via Vue Playground integration, and features a sophisticated search powered by Algolia. The site is deployed at vuejs.org and maintained by the Vue core team and community contributors.

## Creating a Vue Application

Initialize and mount a Vue 3 application to the DOM.

```js
// main.js - Basic Vue app setup
import { createApp } from 'vue'
import App from './App.vue'

// Create application instance
const app = createApp(App)

// Mount to DOM element
app.mount('#app')

// Register global components before mounting
app.component('GlobalButton', {
  template: '<button><slot /></button>'
})

// Register global directives
app.directive('focus', {
  mounted(el) {
    el.focus()
  }
})

// Provide global data
app.provide('apiUrl', 'https://api.example.com')

// Configure app properties
app.config.errorHandler = (err) => {
  console.error('App error:', err)
}

app.mount('#app')
```

## Reactive State with ref()

Create reactive primitive values that automatically update the UI.

```js
// Counter.vue - Simple reactive counter component
<script setup>
import { ref } from 'vue'

// Create reactive reference
const count = ref(0)
const message = ref('Hello Vue!')

// Functions that modify reactive state
function increment() {
  count.value++  // Access via .value in JS
}

function reset() {
  count.value = 0
  message.value = 'Reset!'
}

// Computed value based on reactive state
import { computed } from 'vue'
const doubleCount = computed(() => count.value * 2)
</script>

<template>
  <!-- Refs auto-unwrap in templates -->
  <div>
    <p>{{ message }}</p>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">Increment</button>
    <button @click="reset">Reset</button>
  </div>
</template>
```

## Reactive Objects with reactive()

Create deeply reactive object proxies for complex state.

```js
// UserProfile.vue - Managing reactive object state
<script setup>
import { reactive, toRefs } from 'vue'

// Create reactive object
const state = reactive({
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    preferences: {
      theme: 'dark',
      notifications: true
    }
  },
  loading: false,
  error: null
})

// Nested properties are automatically reactive
function updateTheme(newTheme) {
  state.user.preferences.theme = newTheme
}

// Update entire nested object
function updateUser(userData) {
  Object.assign(state.user, userData)
}

// Destructure with reactivity preservation
const { user, loading } = toRefs(state)
</script>

<template>
  <div v-if="!loading">
    <h2>{{ state.user.name }}</h2>
    <p>{{ state.user.email }}</p>
    <p>Theme: {{ state.user.preferences.theme }}</p>
    <button @click="updateTheme('light')">Light Mode</button>
  </div>
</template>
```

## Computed Properties

Define cached derived state that updates when dependencies change.

```js
// ShoppingCart.vue - Computed properties for cart calculations
<script setup>
import { ref, computed } from 'vue'

const items = ref([
  { id: 1, name: 'Laptop', price: 999, quantity: 1 },
  { id: 2, name: 'Mouse', price: 29, quantity: 2 },
  { id: 3, name: 'Keyboard', price: 79, quantity: 1 }
])

// Read-only computed
const totalItems = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity, 0)
})

const subtotal = computed(() => {
  return items.value.reduce((sum, item) =>
    sum + (item.price * item.quantity), 0
  )
})

const tax = computed(() => subtotal.value * 0.1)
const total = computed(() => subtotal.value + tax.value)

// Writable computed
const discountCode = ref('')
const finalTotal = computed({
  get() {
    return discountCode.value === 'SAVE10'
      ? total.value * 0.9
      : total.value
  },
  set(value) {
    // Custom setter logic
    console.log('Setting total:', value)
  }
})
</script>

<template>
  <div>
    <p>Items: {{ totalItems }}</p>
    <p>Subtotal: ${{ subtotal.toFixed(2) }}</p>
    <p>Tax: ${{ tax.toFixed(2) }}</p>
    <p>Total: ${{ total.toFixed(2) }}</p>
    <input v-model="discountCode" placeholder="Discount code">
    <p>Final: ${{ finalTotal.toFixed(2) }}</p>
  </div>
</template>
```

## Component Props

Pass data from parent to child components with type validation.

```js
// BlogPost.vue - Props with validation
<script setup>
import { computed } from 'vue'

// Define props with types and defaults
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  author: {
    type: Object,
    default: () => ({ name: 'Anonymous' })
  },
  tags: {
    type: Array,
    default: () => []
  },
  likes: {
    type: Number,
    default: 0,
    validator: (value) => value >= 0
  },
  published: {
    type: Boolean,
    default: false
  }
})

// Use props in computed
const isPopular = computed(() => props.likes > 100)
const excerpt = computed(() =>
  props.content.slice(0, 150) + '...'
)
</script>

<template>
  <article>
    <h2>{{ title }}</h2>
    <p class="author">By {{ author.name }}</p>
    <p>{{ excerpt }}</p>
    <div class="tags">
      <span v-for="tag in tags" :key="tag">{{ tag }}</span>
    </div>
    <p>Likes: {{ likes }} <span v-if="isPopular">🔥</span></p>
  </article>
</template>

<!-- Parent component usage -->
<BlogPost
  title="Getting Started with Vue 3"
  :content="articleContent"
  :author="{ name: 'Jane Smith' }"
  :tags="['vue', 'javascript', 'tutorial']"
  :likes="150"
  :published="true"
/>
```

## Component Events

Emit custom events from child to parent components.

```js
// CustomInput.vue - Emitting events
<script setup>
import { ref } from 'vue'

// Declare emitted events with validation
const emit = defineEmits({
  // No validation
  change: null,

  // With validation
  update: (value) => {
    if (typeof value !== 'string') {
      console.warn('update event payload must be string')
      return false
    }
    return true
  },

  // Multiple parameters
  submit: (value, isValid) => {
    return typeof value === 'string' && typeof isValid === 'boolean'
  }
})

const inputValue = ref('')

function handleInput(event) {
  inputValue.value = event.target.value
  emit('update', inputValue.value)
}

function handleSubmit() {
  const isValid = inputValue.value.length > 0
  emit('submit', inputValue.value, isValid)
}

function handleChange() {
  emit('change')
}
</script>

<template>
  <div>
    <input
      :value="inputValue"
      @input="handleInput"
      @change="handleChange"
    />
    <button @click="handleSubmit">Submit</button>
  </div>
</template>

<!-- Parent component usage -->
<script setup>
function handleUpdate(value) {
  console.log('Input updated:', value)
}

function handleSubmit(value, isValid) {
  if (isValid) {
    console.log('Form submitted:', value)
  }
}
</script>

<template>
  <CustomInput
    @update="handleUpdate"
    @submit="handleSubmit"
    @change="() => console.log('changed')"
  />
</template>
```

## v-model Component Binding

Create two-way data binding between parent and child components.

```js
// RatingInput.vue - Custom v-model implementation
<script setup>
import { computed } from 'vue'

// v-model uses 'modelValue' prop and 'update:modelValue' event
const props = defineProps({
  modelValue: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 5
  }
})

const emit = defineEmits(['update:modelValue'])

// Computed with getter/setter for v-model
const rating = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

function setRating(value) {
  rating.value = value
}
</script>

<template>
  <div class="rating">
    <button
      v-for="n in max"
      :key="n"
      :class="{ active: n <= rating }"
      @click="setRating(n)"
    >
      ⭐
    </button>
  </div>
</template>

<!-- Parent component usage -->
<script setup>
import { ref } from 'vue'

const userRating = ref(3)
</script>

<template>
  <div>
    <RatingInput v-model="userRating" :max="5" />
    <p>Your rating: {{ userRating }}</p>
  </div>
</template>

<!-- Multiple v-model bindings -->
<script setup>
// AdvancedForm.vue
const props = defineProps(['firstName', 'lastName'])
const emit = defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>

<!-- Parent usage with multiple v-models -->
<AdvancedForm
  v-model:first-name="user.first"
  v-model:last-name="user.last"
/>
```

## Watchers

React to reactive state changes with side effects.

```js
// SearchComponent.vue - Using watchers
<script setup>
import { ref, watch, watchEffect } from 'vue'

const searchQuery = ref('')
const searchResults = ref([])
const loading = ref(false)
const error = ref(null)

// Basic watcher
watch(searchQuery, (newQuery, oldQuery) => {
  console.log(`Query changed from "${oldQuery}" to "${newQuery}"`)
})

// Watcher with options
watch(
  searchQuery,
  async (newQuery) => {
    if (newQuery.length < 3) {
      searchResults.value = []
      return
    }

    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/api/search?q=${newQuery}`)
      searchResults.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  },
  {
    debounce: 300,  // Wait 300ms after last change
    immediate: false  // Don't run on mount
  }
)

// Watch multiple sources
const firstName = ref('')
const lastName = ref('')

watch(
  [firstName, lastName],
  ([newFirst, newLast], [oldFirst, oldLast]) => {
    console.log('Name changed:', newFirst, newLast)
  }
)

// Watch reactive object
const user = ref({ name: 'John', age: 30 })

watch(
  () => user.value.age,
  (newAge) => {
    console.log('Age changed to:', newAge)
  }
)

// Deep watcher for nested objects
const state = ref({
  user: { profile: { name: 'John' } }
})

watch(state, (newState) => {
  console.log('Deep change detected')
}, { deep: true })

// watchEffect - automatically tracks dependencies
watchEffect(() => {
  // Automatically re-runs when any reactive dependency changes
  console.log(`Searching for: ${searchQuery.value}`)
  document.title = `Search: ${searchQuery.value}`
})

// Cleanup with watchEffect
const stopWatcher = watchEffect((onCleanup) => {
  const timer = setTimeout(() => {
    console.log('Delayed effect')
  }, 1000)

  onCleanup(() => {
    clearTimeout(timer)
  })
})

// Manually stop watcher
// stopWatcher()
</script>

<template>
  <input v-model="searchQuery" placeholder="Search...">
  <div v-if="loading">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <ul v-else>
    <li v-for="result in searchResults" :key="result.id">
      {{ result.title }}
    </li>
  </ul>
</template>
```

## Lifecycle Hooks

Execute code at specific stages of component lifecycle.

```js
// DataFetcher.vue - Lifecycle hooks usage
<script setup>
import {
  ref,
  onMounted,
  onUpdated,
  onUnmounted,
  onBeforeMount,
  onBeforeUpdate,
  onBeforeUnmount,
  onErrorCaptured
} from 'vue'

const data = ref(null)
const updateCount = ref(0)
let intervalId = null

// Before component is mounted to DOM
onBeforeMount(() => {
  console.log('Component is about to be mounted')
})

// After component is mounted to DOM
onMounted(async () => {
  console.log('Component mounted, DOM is ready')

  // Fetch initial data
  try {
    const response = await fetch('/api/data')
    data.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch data:', error)
  }

  // Set up polling
  intervalId = setInterval(() => {
    console.log('Polling data...')
  }, 5000)

  // Access DOM elements
  const element = document.getElementById('my-element')
  if (element) {
    element.focus()
  }
})

// Before component updates
onBeforeUpdate(() => {
  console.log('Component is about to update')
})

// After component updates
onUpdated(() => {
  updateCount.value++
  console.log('Component updated, count:', updateCount.value)
})

// Before component unmounts
onBeforeUnmount(() => {
  console.log('Component is about to unmount')
})

// Cleanup when component unmounts
onUnmounted(() => {
  console.log('Component unmounted')

  // Clear intervals/timers
  if (intervalId) {
    clearInterval(intervalId)
  }

  // Remove event listeners
  window.removeEventListener('resize', handleResize)

  // Clean up subscriptions
  // unsubscribe()
})

// Error handling
onErrorCaptured((err, instance, info) => {
  console.error('Error captured:', err, info)
  // Return false to prevent error propagation
  return false
})

function handleResize() {
  console.log('Window resized')
}

// Register event listener
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
</script>

<template>
  <div id="my-element">
    <div v-if="data">{{ data.title }}</div>
    <div v-else>Loading...</div>
  </div>
</template>
```

## Provide/Inject Dependency Injection

Share data across component tree without prop drilling.

```js
// App.vue - Root component providing data
<script setup>
import { provide, ref, readonly } from 'vue'

// Provide reactive data
const theme = ref('dark')
const user = ref({
  id: 1,
  name: 'John Doe',
  role: 'admin'
})

// Provide with read-only wrapper
provide('theme', readonly(theme))

// Provide with methods to modify
provide('user', {
  data: readonly(user),
  updateName: (newName) => {
    user.value.name = newName
  },
  logout: () => {
    user.value = null
  }
})

// Provide non-reactive values
provide('apiUrl', 'https://api.example.com')
provide('config', {
  maxItems: 100,
  pageSize: 20
})

// Provide with Symbol keys (recommended for plugins)
import { InjectionKey } from 'vue'
const userKey = Symbol('user')
provide(userKey, user)
</script>

<template>
  <ChildComponent />
</template>

// ChildComponent.vue - Deep nested component consuming data
<script setup>
import { inject } from 'vue'

// Inject with default value
const theme = inject('theme', 'light')

// Inject object with methods
const userContext = inject('user')
const apiUrl = inject('apiUrl')

// Inject with type safety
const config = inject('config')

// Handle missing injection
const optionalData = inject('optional', null)
if (!optionalData) {
  console.warn('Optional data not provided')
}

// Use injected data and methods
function changeName() {
  userContext.updateName('Jane Doe')
}

function handleLogout() {
  userContext.logout()
}
</script>

<template>
  <div :class="theme">
    <p v-if="userContext.data">
      Hello, {{ userContext.data.name }}
    </p>
    <button @click="changeName">Change Name</button>
    <button @click="handleLogout">Logout</button>
  </div>
</template>

// Plugin example with provide/inject
// plugins/api.js
export default {
  install(app, options) {
    const apiClient = {
      baseUrl: options.baseUrl,
      async get(endpoint) {
        const response = await fetch(`${this.baseUrl}${endpoint}`)
        return response.json()
      },
      async post(endpoint, data) {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        return response.json()
      }
    }

    app.provide('api', apiClient)
  }
}

// main.js
import apiPlugin from './plugins/api'
app.use(apiPlugin, { baseUrl: 'https://api.example.com' })

// Component using plugin
const api = inject('api')
const data = await api.get('/users')
```

## Composables

Extract and reuse stateful logic across components.

```js
// composables/useFetch.js - Reusable fetch logic
import { ref, watch, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    error.value = null
    data.value = null

    try {
      // toValue() unwraps refs, getters, and returns plain values as-is
      const response = await fetch(toValue(url))
      if (!response.ok) throw new Error(response.statusText)
      data.value = await response.json()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  // Re-fetch when URL changes
  watch(() => toValue(url), fetchData, { immediate: true })

  return { data, error, loading, refetch: fetchData }
}

// composables/useMouse.js - Track mouse position
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.pageX
    y.value = event.pageY
  }

  onMounted(() => window.addEventListener('mousemove', update))
  onUnmounted(() => window.removeEventListener('mousemove', update))

  return { x, y }
}

// composables/useLocalStorage.js - Persistent state
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const value = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  function remove() {
    localStorage.removeItem(key)
    value.value = defaultValue
  }

  return { value, remove }
}

// Component.vue - Using composables
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from './composables/useFetch'
import { useMouse } from './composables/useMouse'
import { useLocalStorage } from './composables/useLocalStorage'

// Use fetch composable with reactive URL
const userId = ref(1)
const url = computed(() => `/api/users/${userId.value}`)
const { data: user, error, loading, refetch } = useFetch(url)

// Use mouse tracking
const { x, y } = useMouse()

// Use persistent storage
const { value: settings, remove: clearSettings } = useLocalStorage('app-settings', {
  theme: 'dark',
  language: 'en'
})

function updateTheme(newTheme) {
  settings.value.theme = newTheme
}
</script>

<template>
  <div>
    <!-- Mouse position -->
    <p>Mouse: {{ x }}, {{ y }}</p>

    <!-- User data -->
    <div v-if="loading">Loading user...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else-if="user">
      <h2>{{ user.name }}</h2>
      <button @click="refetch">Refresh</button>
    </div>

    <!-- Settings -->
    <p>Theme: {{ settings.theme }}</p>
    <button @click="updateTheme('light')">Light Mode</button>
    <button @click="clearSettings">Reset Settings</button>
  </div>
</template>
```

## Template Directives

Use built-in directives for declarative DOM manipulation.

```vue
<!-- Conditional rendering -->
<div v-if="type === 'A'">Type A</div>
<div v-else-if="type === 'B'">Type B</div>
<div v-else>Not A or B</div>

<!-- Show/hide with CSS -->
<div v-show="isVisible">Toggle visibility</div>

<!-- List rendering -->
<ul>
  <li v-for="(item, index) in items" :key="item.id">
    {{ index }}: {{ item.name }}
  </li>
</ul>

<!-- Iterate over object -->
<ul>
  <li v-for="(value, key, index) in object" :key="key">
    {{ index }}. {{ key }}: {{ value }}
  </li>
</ul>

<!-- Event handling -->
<button @click="handleClick">Click me</button>
<button @click="count++">Increment</button>
<button @click.prevent="submit">Submit</button>
<button @click.stop="handleClick">Stop propagation</button>
<input @keyup.enter="submit">
<input @keyup.ctrl.enter="submit">

<!-- Two-way binding -->
<input v-model="text">
<input v-model.number="age" type="number">
<input v-model.trim="message">
<textarea v-model="description"></textarea>
<input type="checkbox" v-model="checked">
<select v-model="selected">
  <option value="a">A</option>
  <option value="b">B</option>
</select>

<!-- Attribute binding -->
<div :id="dynamicId"></div>
<div :class="{ active: isActive, 'text-danger': hasError }"></div>
<div :class="[activeClass, errorClass]"></div>
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
<button :disabled="isDisabled">Submit</button>

<!-- Bind all attributes -->
<div v-bind="objectOfAttrs"></div>

<!-- Slots -->
<template v-slot:header>
  <h1>Header content</h1>
</template>
<template #footer="{ message }">
  <p>{{ message }}</p>
</template>

<!-- Dynamic directive arguments -->
<button @[eventName]="handler">Dynamic event</button>
<div :[attributeName]="value">Dynamic attribute</div>

<!-- v-once for static content -->
<span v-once>This will never change: {{ staticMessage }}</span>

<!-- v-html for raw HTML (use with caution) -->
<div v-html="rawHtml"></div>

<!-- v-text -->
<span v-text="message"></span>

<!-- v-pre to skip compilation -->
<span v-pre>{{ this will not be compiled }}</span>

<!-- v-cloak to hide until ready -->
<div v-cloak>{{ message }}</div>

<!-- v-memo for performance optimization (Vue 3.2+) -->
<div v-memo="[valueA, valueB]">
  <!-- Only re-renders when valueA or valueB changes -->
</div>
```

## Async Components

Lazy load components for code splitting and performance.

```js
// Router.vue - Async component loading
<script setup>
import { ref, defineAsyncComponent } from 'vue'

// Basic async component
const AsyncModal = defineAsyncComponent(() =>
  import('./components/Modal.vue')
)

// With loading and error states
const AsyncChart = defineAsyncComponent({
  loader: () => import('./components/Chart.vue'),

  loadingComponent: {
    template: '<div>Loading chart...</div>'
  },

  errorComponent: {
    template: '<div>Failed to load chart</div>'
  },

  delay: 200,  // Delay before showing loading component
  timeout: 3000  // Timeout for loading
})

// Conditional async loading
const showHeavyComponent = ref(false)
const HeavyComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
)

// Suspense wrapper for async components
import { Suspense } from 'vue'
</script>

<template>
  <!-- Simple async component -->
  <AsyncModal v-if="showModal" />

  <!-- Async with error handling -->
  <AsyncChart :data="chartData" />

  <!-- With Suspense -->
  <Suspense>
    <!-- Component with async setup() -->
    <template #default>
      <AsyncDashboard />
    </template>

    <!-- Loading state -->
    <template #fallback>
      <div>Loading dashboard...</div>
    </template>
  </Suspense>

  <!-- Conditional loading -->
  <button @click="showHeavyComponent = true">
    Load Heavy Component
  </button>
  <HeavyComponent v-if="showHeavyComponent" />
</template>

// AsyncDashboard.vue - Component with async setup
<script setup>
const data = await fetch('/api/dashboard').then(r => r.json())
// Top-level await is supported in Suspense
</script>

<template>
  <div>{{ data.title }}</div>
</template>
```

## VitePress Configuration

Configure documentation site build and deployment settings.

```ts
// .vitepress/config.ts - VitePress configuration
import { defineConfigWithTheme } from 'vitepress'
import type { Config as ThemeConfig } from '@vue/theme'

export default defineConfigWithTheme<ThemeConfig>({
  // Site metadata
  lang: 'en-US',
  title: 'Vue.js',
  description: 'Vue.js - The Progressive JavaScript Framework',

  // Source directory
  srcDir: 'src',
  srcExclude: ['tutorial/**/description.md'],

  // Site URL for sitemap
  sitemap: {
    hostname: 'https://vuejs.org'
  },

  // HTML head tags
  head: [
    ['meta', { name: 'theme-color', content: '#3c8772' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['link', { rel: 'icon', href: '/logo.svg' }]
  ],

  // Theme configuration
  themeConfig: {
    // Navigation menu
    nav: [
      {
        text: 'Docs',
        items: [
          { text: 'Guide', link: '/guide/introduction' },
          { text: 'API', link: '/api/' }
        ]
      }
    ],

    // Sidebar navigation
    sidebar: {
      '/guide/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: 'Quick Start', link: '/guide/quick-start' }
          ]
        }
      ]
    },

    // Search with Algolia
    algolia: {
      indexName: 'vuejs',
      appId: 'ML0LEBN7FQ',
      apiKey: 'your-api-key',
      searchParameters: {
        facetFilters: ['version:v3']
      }
    },

    // Social links
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/' }
    ],

    // Edit link
    editLink: {
      repo: 'vuejs/docs',
      text: 'Edit this page on GitHub'
    },

    // Footer
    footer: {
      license: {
        text: 'MIT License',
        link: 'https://opensource.org/licenses/MIT'
      },
      copyright: 'Copyright © 2014-2024 Evan You'
    }
  },

  // Markdown configuration
  markdown: {
    theme: 'github-dark',
    config(md) {
      md.use(customPlugin)
    }
  },

  // Vite configuration
  vite: {
    define: {
      __VUE_OPTIONS_API__: false
    },
    server: {
      host: true,
      fs: {
        allow: ['../..']
      }
    },
    build: {
      chunkSizeWarningLimit: Infinity
    }
  }
})
```

## Building and Development

Build and serve the documentation site locally or in production.

```bash
# Install dependencies with pnpm (required)
pnpm install

# Start development server with hot reload
pnpm run dev
# Starts at http://localhost:5173

# Build for production
pnpm run build
# Outputs to .vitepress/dist

# Preview production build locally
pnpm run preview

# Type checking without emitting files
pnpm run type

# Enable corepack for pnpm (required for Node.js 18+)
corepack enable

# Deployment to Netlify
# netlify.toml configuration
[build]
  command = "pnpm run build"
  publish = ".vitepress/dist"

# Deployment to Vercel
# vercel.json configuration
{
  "buildCommand": "pnpm run build",
  "outputDirectory": ".vitepress/dist"
}
```

## Summary and Integration Patterns

The Vue.js documentation showcases comprehensive implementation patterns for building modern web applications with Vue 3. The repository demonstrates the Composition API as the primary approach with `<script setup>` syntax for concise component authoring, while maintaining Options API documentation for compatibility. Key patterns include reactive state management with `ref()` and `reactive()`, computed properties for derived state, watchers for side effects, and component communication through props, events, and provide/inject. The documentation emphasizes TypeScript integration, composables for logic reuse, and lifecycle hooks for component lifecycle management.

Integration patterns include building applications from single-page apps to server-side rendered sites, with guides covering routing (Vue Router), state management (Pinia), testing strategies, and production deployment. The VitePress-based documentation system itself serves as a reference implementation, showing how to structure large-scale Vue projects with proper code splitting via async components, performance optimization techniques, and internationalization support. The build system leverages Vite for fast development and optimized production builds, with comprehensive CI/CD examples for Netlify and Vercel deployments. The documentation supports both learning paths (tutorials, examples) and API reference lookups, making it valuable for developers at all experience levels working with Vue 3's progressive framework approach.
