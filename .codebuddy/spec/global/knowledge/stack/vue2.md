# Vue.js 2 Framework

Vue.js 2 is a progressive JavaScript framework for building user interfaces. It provides a reactive, component-oriented view layer designed to be incrementally adoptable. The framework can scale from a simple library for enhancing static pages to a full-featured single-page application framework. Vue 2 focuses on the view layer only, making it easy to integrate with other libraries or existing projects.

The core system implements a reactive data model using getters/setters for dependency tracking, a virtual DOM implementation for efficient rendering, and a flexible component system. Vue 2 supports both Options API and Composition API (via compatibility layer), template compilation to render functions, directives for DOM manipulation, and a plugin system for extending functionality. The framework includes lifecycle hooks, computed properties, watchers, event handling, and both server-side and client-side rendering capabilities.

## Creating Vue Instances

Create a new Vue instance with component options

```javascript
// Basic Vue instance
const app = new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue!',
    count: 0,
    items: []
  },
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('')
    },
    itemCount() {
      return this.items.length
    }
  },
  methods: {
    increment() {
      this.count++
    },
    greet(name) {
      console.log(`Hello, ${name}!`)
    }
  },
  watch: {
    count(newValue, oldValue) {
      console.log(`Count changed from ${oldValue} to ${newValue}`)
    }
  },
  created() {
    console.log('Component created')
    this.items = ['item1', 'item2']
  },
  mounted() {
    console.log('Component mounted to DOM')
  }
})

// Access instance data
console.log(app.message) // "Hello Vue!"
app.increment()
console.log(app.count) // 1
```

## Component Registration

Register global and local components

```javascript
// Global component registration
Vue.component('my-button', {
  props: {
    label: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  template: '<button :disabled="disabled" @click="handleClick">{{ label }}</button>',
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
})

// Local component definition
const TodoItem = {
  props: ['todo'],
  template: `
    <li>
      <input type="checkbox" v-model="todo.completed">
      <span :class="{ done: todo.completed }">{{ todo.title }}</span>
    </li>
  `
}

// Using components
const app = new Vue({
  el: '#app',
  components: {
    'todo-item': TodoItem
  },
  data: {
    todos: [
      { id: 1, title: 'Learn Vue', completed: false },
      { id: 2, title: 'Build app', completed: false }
    ]
  },
  template: `
    <div>
      <todo-item
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
      />
      <my-button label="Add Todo" @click="addTodo" />
    </div>
  `,
  methods: {
    addTodo() {
      this.todos.push({ id: Date.now(), title: 'New todo', completed: false })
    }
  }
})
```

## Vue.extend

Create component constructors with inheritance

```javascript
// Create a reusable component constructor
const MyComponent = Vue.extend({
  data() {
    return {
      name: 'Vue Component',
      count: 0
    }
  },
  computed: {
    displayName() {
      return `${this.name} (${this.count})`
    }
  },
  methods: {
    increment() {
      this.count++
    }
  },
  template: '<div>{{ displayName }}</div>'
})

// Create instances from the constructor
const instance1 = new MyComponent().$mount('#app1')
const instance2 = new MyComponent({
  data() {
    return {
      name: 'Custom Instance',
      count: 10
    }
  }
}).$mount('#app2')

// Extend existing components
const ExtendedComponent = MyComponent.extend({
  data() {
    return {
      name: 'Extended Component',
      count: 5,
      extra: 'Additional data'
    }
  },
  methods: {
    increment() {
      this.count += 2 // Override parent method
    }
  }
})

const extendedInstance = new ExtendedComponent().$mount('#app3')
```

## Reactivity System - Vue.set / Vue.delete

Add or remove reactive properties dynamically

```javascript
const app = new Vue({
  el: '#app',
  data: {
    user: {
      name: 'John',
      age: 30
    },
    items: ['a', 'b', 'c']
  },
  methods: {
    addEmail() {
      // Add new reactive property to existing object
      Vue.set(this.user, 'email', 'john@example.com')
      // Or use instance method: this.$set(this.user, 'email', 'john@example.com')
      console.log(this.user.email) // "john@example.com"
    },
    removeAge() {
      // Delete reactive property and trigger update
      Vue.delete(this.user, 'age')
      // Or use instance method: this.$delete(this.user, 'age')
      console.log(this.user.age) // undefined
    },
    updateArrayItem() {
      // Update array item by index (triggers reactivity)
      Vue.set(this.items, 1, 'updated')
      console.log(this.items) // ['a', 'updated', 'c']
    },
    removeArrayItem() {
      // Remove array item by index
      Vue.delete(this.items, 0)
      console.log(this.items) // ['updated', 'c']
    }
  }
})

// Direct usage without instance
const obj = { a: 1 }
Vue.set(obj, 'b', 2)
console.log(obj.b) // 2

const arr = [1, 2, 3]
Vue.set(arr, 0, 99)
console.log(arr) // [99, 2, 3]
```

## Vue.observable

Make an object reactive

```javascript
// Create reactive state outside Vue instances
const state = Vue.observable({
  count: 0,
  user: {
    name: 'Guest',
    loggedIn: false
  }
})

// Use in component
const Counter = {
  computed: {
    count() {
      return state.count
    },
    userName() {
      return state.user.name
    }
  },
  methods: {
    increment() {
      state.count++
    },
    login(name) {
      state.user.name = name
      state.user.loggedIn = true
    }
  },
  template: `
    <div>
      <p>Count: {{ count }}</p>
      <p>User: {{ userName }}</p>
      <button @click="increment">Increment</button>
      <button @click="login('John')">Login</button>
    </div>
  `
}

// Create simple store pattern
const store = {
  debug: true,
  state: Vue.observable({
    message: 'Hello',
    todos: []
  }),
  setMessageAction(newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  addTodoAction(todo) {
    if (this.debug) console.log('addTodoAction triggered with', todo)
    this.state.todos.push(todo)
  }
}

new Vue({
  el: '#app',
  computed: {
    message() {
      return store.state.message
    },
    todos() {
      return store.state.todos
    }
  },
  methods: {
    updateMessage(msg) {
      store.setMessageAction(msg)
    }
  }
})
```

## Vue.nextTick

Execute callback after DOM updates

```javascript
const app = new Vue({
  el: '#app',
  data: {
    message: 'Initial',
    items: [1, 2, 3]
  },
  methods: {
    async updateMessage() {
      this.message = 'Updated'

      // DOM not yet updated
      console.log(this.$el.textContent) // "Initial"

      // Wait for DOM update with callback
      Vue.nextTick(() => {
        console.log(this.$el.textContent) // "Updated"
      })

      // Or use instance method with callback
      this.$nextTick(() => {
        console.log('DOM updated')
      })

      // Or use with Promise
      await Vue.nextTick()
      console.log(this.$el.textContent) // "Updated"

      // Or use await with instance method
      await this.$nextTick()
      const height = this.$el.offsetHeight
      console.log('Element height:', height)
    },
    addItems() {
      this.items.push(4, 5, 6)

      // Access updated DOM
      this.$nextTick(() => {
        const listItems = this.$el.querySelectorAll('li')
        console.log('Total items:', listItems.length) // 6
      })
    }
  }
})

// Standalone usage
Vue.nextTick()
  .then(() => {
    console.log('DOM updated')
  })
  .catch(err => {
    console.error('Error:', err)
  })
```

## Plugin System - Vue.use

Install Vue plugins

```javascript
// Define a plugin
const MyPlugin = {
  install(Vue, options) {
    // Add global method or property
    Vue.myGlobalMethod = function () {
      console.log('Global method called')
    }

    // Add global asset
    Vue.directive('my-directive', {
      bind(el, binding) {
        el.style.color = binding.value
      }
    })

    // Add instance method
    Vue.prototype.$myMethod = function (text) {
      console.log('Instance method:', text)
    }

    // Add mixin
    Vue.mixin({
      created() {
        const myOption = this.$options.myOption
        if (myOption) {
          console.log('Custom option:', myOption)
        }
      }
    })

    // Use plugin options
    if (options && options.prefix) {
      Vue.prototype.$prefix = options.prefix
    }
  }
}

// Install plugin
Vue.use(MyPlugin, {
  prefix: 'APP_'
})

// Plugin is only installed once (duplicate calls ignored)
Vue.use(MyPlugin) // Ignored

// Use plugin features
Vue.myGlobalMethod() // "Global method called"

new Vue({
  el: '#app',
  myOption: 'custom value',
  mounted() {
    this.$myMethod('Hello') // "Instance method: Hello"
    console.log(this.$prefix) // "APP_"
  },
  template: '<div v-my-directive="\'red\'">Styled text</div>'
})

// Function-based plugin
function SimplePlugin(Vue, options) {
  Vue.prototype.$greeting = options.greeting || 'Hello'
}

Vue.use(SimplePlugin, { greeting: 'Hi' })
```

## Mixins

Reuse component logic across multiple components

```javascript
// Define a mixin
const loggerMixin = {
  data() {
    return {
      logEnabled: true
    }
  },
  methods: {
    log(message) {
      if (this.logEnabled) {
        console.log(`[${this.$options.name}]`, message)
      }
    }
  },
  created() {
    this.log('Component created')
  }
}

const fetchMixin = {
  data() {
    return {
      loading: false,
      error: null
    }
  },
  methods: {
    async fetch(url) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(url)
        const data = await response.json()
        this.loading = false
        return data
      } catch (err) {
        this.error = err.message
        this.loading = false
        throw err
      }
    }
  }
}

// Use mixins in component
const UserComponent = {
  name: 'UserComponent',
  mixins: [loggerMixin, fetchMixin],
  data() {
    return {
      user: null
    }
  },
  async created() {
    this.log('Fetching user data')
    try {
      this.user = await this.fetch('https://api.example.com/user')
      this.log('User data loaded')
    } catch (err) {
      this.log(`Error: ${this.error}`)
    }
  }
}

// Global mixin (affects all components)
Vue.mixin({
  created() {
    console.log('Global mixin: component created')
  }
})

const app = new Vue({
  el: '#app',
  components: {
    'user-component': UserComponent
  }
})
```

## Directives

Create custom directives for DOM manipulation

```javascript
// Register global directive
Vue.directive('focus', {
  inserted(el) {
    el.focus()
  }
})

Vue.directive('color', {
  bind(el, binding) {
    el.style.color = binding.value
  },
  update(el, binding) {
    el.style.color = binding.value
  }
})

// Directive with all hooks
Vue.directive('tooltip', {
  bind(el, binding, vnode) {
    // Called once when directive is first bound
    console.log('Directive bound')
  },
  inserted(el, binding, vnode) {
    // Called when element is inserted into parent
    const tooltip = document.createElement('div')
    tooltip.className = 'tooltip'
    tooltip.textContent = binding.value
    tooltip.style.display = 'none'
    el.tooltipElement = tooltip
    document.body.appendChild(tooltip)

    el.addEventListener('mouseenter', () => {
      const rect = el.getBoundingClientRect()
      tooltip.style.left = rect.left + 'px'
      tooltip.style.top = (rect.top - 30) + 'px'
      tooltip.style.display = 'block'
    })

    el.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none'
    })
  },
  update(el, binding) {
    // Called when component updates
    if (el.tooltipElement) {
      el.tooltipElement.textContent = binding.value
    }
  },
  unbind(el) {
    // Called when directive is unbound
    if (el.tooltipElement) {
      el.tooltipElement.remove()
    }
  }
})

// Local directive
const app = new Vue({
  el: '#app',
  directives: {
    highlight: {
      bind(el, binding) {
        el.style.backgroundColor = binding.arg || 'yellow'
      }
    }
  },
  template: `
    <div>
      <input v-focus>
      <p v-color="'red'">Red text</p>
      <span v-tooltip="'Helpful tooltip'">Hover me</span>
      <div v-highlight:blue>Highlighted text</div>
    </div>
  `
})
```

## Filters

Transform data for display in templates

```javascript
// Register global filters
Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('currency', function (value, symbol = '$') {
  return `${symbol}${parseFloat(value).toFixed(2)}`
})

Vue.filter('truncate', function (value, length = 10) {
  if (!value) return ''
  if (value.length <= length) return value
  return value.substring(0, length) + '...'
})

Vue.filter('formatDate', function (value) {
  if (!value) return ''
  const date = new Date(value)
  return date.toLocaleDateString()
})

// Use filters in templates and chaining
const app = new Vue({
  el: '#app',
  data: {
    message: 'hello world',
    price: 99.999,
    longText: 'This is a very long text that needs truncation',
    timestamp: '2023-12-25T10:30:00Z'
  },
  filters: {
    // Local filter
    reverse(value) {
      return value.split('').reverse().join('')
    }
  },
  template: `
    <div>
      <p>{{ message | capitalize }}</p>
      <p>{{ price | currency }}</p>
      <p>{{ price | currency('€') }}</p>
      <p>{{ longText | truncate(20) }}</p>
      <p>{{ timestamp | formatDate }}</p>
      <p>{{ message | capitalize | reverse }}</p>
    </div>
  `
})

// Filters in v-bind
const app2 = new Vue({
  el: '#app2',
  data: {
    rawId: 'SOME-ID-123'
  },
  template: `
    <div :id="rawId | lowercase">
      Content
    </div>
  `,
  filters: {
    lowercase(value) {
      return value.toLowerCase()
    }
  }
})
```

## Watchers

React to data changes

```javascript
const app = new Vue({
  el: '#app',
  data: {
    question: '',
    answer: 'Waiting for your question...',
    search: '',
    user: {
      name: 'John',
      profile: {
        email: 'john@example.com'
      }
    },
    items: [1, 2, 3]
  },
  watch: {
    // Simple watcher
    question(newQuestion, oldQuestion) {
      this.answer = 'Thinking...'
      this.debouncedGetAnswer()
    },

    // Deep watcher for objects
    user: {
      handler(newUser, oldUser) {
        console.log('User changed:', newUser)
      },
      deep: true
    },

    // Immediate execution
    search: {
      handler(val) {
        console.log('Search:', val)
      },
      immediate: true
    },

    // Watch nested property with string path
    'user.profile.email': function (newEmail) {
      console.log('Email changed to:', newEmail)
    },

    // Array of handlers
    items: [
      function handler1(val) {
        console.log('Handler 1:', val.length)
      },
      {
        handler: function handler2(val) {
          console.log('Handler 2:', val)
        },
        deep: true
      }
    ]
  },
  methods: {
    debouncedGetAnswer() {
      setTimeout(() => {
        this.answer = `Answer to: ${this.question}`
      }, 500)
    }
  },
  created() {
    // Programmatic watcher
    const unwatch = this.$watch('question', function (newVal, oldVal) {
      console.log(`Question changed from "${oldVal}" to "${newVal}"`)
    })

    // Unwatch when needed
    // unwatch()

    // Watch with options
    this.$watch('user', function (newVal) {
      console.log('User deep watch:', newVal)
    }, {
      deep: true,
      immediate: true
    })
  }
})
```

## Computed Properties

Cached reactive derived state

```javascript
const app = new Vue({
  el: '#app',
  data: {
    firstName: 'John',
    lastName: 'Doe',
    items: [
      { id: 1, text: 'Apple', price: 1.5, quantity: 2 },
      { id: 2, text: 'Banana', price: 0.8, quantity: 5 },
      { id: 3, text: 'Orange', price: 2.0, quantity: 3 }
    ],
    searchQuery: ''
  },
  computed: {
    // Basic computed property
    fullName() {
      return `${this.firstName} ${this.lastName}`
    },

    // Computed with getter and setter
    fullNameEditable: {
      get() {
        return `${this.firstName} ${this.lastName}`
      },
      set(newValue) {
        const names = newValue.split(' ')
        this.firstName = names[0]
        this.lastName = names[names.length - 1]
      }
    },

    // Computed property using other computed
    greeting() {
      return `Hello, ${this.fullName}!`
    },

    // Complex computation
    totalPrice() {
      return this.items.reduce((total, item) => {
        return total + (item.price * item.quantity)
      }, 0).toFixed(2)
    },

    // Filtered data
    filteredItems() {
      if (!this.searchQuery) return this.items
      return this.items.filter(item =>
        item.text.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },

    // Computed with dependency
    itemCount() {
      return this.filteredItems.length
    }
  },
  methods: {
    updateName() {
      this.fullNameEditable = 'Jane Smith'
      console.log(this.firstName) // "Jane"
      console.log(this.lastName) // "Smith"
    }
  }
})

// Computed properties are cached based on dependencies
console.log(app.fullName) // Computed once
console.log(app.fullName) // Returns cached value
app.firstName = 'Jane' // Invalidates cache
console.log(app.fullName) // Recomputes
```

## Template Compiler

Compile templates to render functions

```javascript
// Compile template string to render functions
const compiled = Vue.compile('<div><p>{{ message }}</p></div>')

console.log(compiled.render)
// function() { with(this){return _c('div',[_c('p',[_v(_s(message))])])} }

console.log(compiled.staticRenderFns)
// []

// Use compiled render function
const app = new Vue({
  data: {
    message: 'Hello Vue!'
  },
  render: compiled.render,
  staticRenderFns: compiled.staticRenderFns
}).$mount('#app')

// Compile complex template
const complexTemplate = `
  <div id="app">
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    <button @click="addItem">Add</button>
  </div>
`

const { render, staticRenderFns } = Vue.compile(complexTemplate)

new Vue({
  data: {
    title: 'My List',
    items: [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' }
    ]
  },
  methods: {
    addItem() {
      this.items.push({
        id: this.items.length + 1,
        name: `Item ${this.items.length + 1}`
      })
    }
  },
  render,
  staticRenderFns
}).$mount('#app')
```

## Render Functions

Create VNodes programmatically with createElement

```javascript
// Basic render function
Vue.component('anchored-heading', {
  props: {
    level: {
      type: Number,
      required: true
    }
  },
  render(createElement) {
    return createElement(
      'h' + this.level,
      this.$slots.default
    )
  }
})

// Full createElement API
Vue.component('custom-button', {
  props: ['type', 'disabled'],
  render(createElement) {
    return createElement(
      'button',
      {
        class: {
          'btn': true,
          'btn-primary': this.type === 'primary',
          'btn-disabled': this.disabled
        },
        attrs: {
          type: 'button',
          disabled: this.disabled
        },
        style: {
          fontSize: '14px'
        },
        on: {
          click: this.handleClick
        }
      },
      [
        createElement('span', 'Button Text'),
        this.$slots.default
      ]
    )
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  }
})

// Complex render function with conditionals
Vue.component('smart-list', {
  props: {
    items: Array,
    emptyText: String
  },
  render(h) {
    if (!this.items || this.items.length === 0) {
      return h('p', { class: 'empty' }, this.emptyText || 'No items')
    }

    return h('ul', { class: 'list' }, [
      this.items.map((item, index) => {
        return h('li', {
          key: item.id || index,
          class: { active: item.active },
          on: {
            click: () => this.$emit('item-click', item)
          }
        }, [
          h('span', item.text)
        ])
      })
    ])
  }
})

// Using JSX (requires babel-plugin-transform-vue-jsx)
Vue.component('jsx-component', {
  props: ['value'],
  render() {
    return (
      <div class="wrapper">
        <input
          value={this.value}
          onInput={e => this.$emit('input', e.target.value)}
        />
      </div>
    )
  }
})
```

## Event Handling

Component events and custom event system

```javascript
// Define child component
Vue.component('counter-button', {
  props: {
    initialCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      count: this.initialCount
    }
  },
  methods: {
    increment() {
      this.count++
      // Emit event to parent
      this.$emit('increment', this.count)
    },
    decrement() {
      this.count--
      this.$emit('decrement', this.count)
    },
    reset() {
      this.count = 0
      // Emit multiple events
      this.$emit('reset')
      this.$emit('change', this.count)
    }
  },
  template: `
    <div>
      <button @click="decrement">-</button>
      <span>{{ count }}</span>
      <button @click="increment">+</button>
      <button @click="reset">Reset</button>
    </div>
  `
})

// Parent component
const app = new Vue({
  el: '#app',
  data: {
    total: 0,
    message: ''
  },
  methods: {
    onIncrement(value) {
      this.total = value
      this.message = `Incremented to ${value}`
    },
    onDecrement(value) {
      this.total = value
      this.message = `Decremented to ${value}`
    },
    onReset() {
      this.message = 'Counter reset'
    },
    onChange(value) {
      console.log('Counter changed:', value)
    }
  },
  template: `
    <div>
      <counter-button
        :initial-count="5"
        @increment="onIncrement"
        @decrement="onDecrement"
        @reset="onReset"
        @change="onChange"
      />
      <p>Total: {{ total }}</p>
      <p>{{ message }}</p>
    </div>
  `
})

// Custom events using $on, $once, $off
const eventBus = new Vue()

// Emit events
eventBus.$emit('user-login', { id: 1, name: 'John' })

// Listen to events
eventBus.$on('user-login', user => {
  console.log('User logged in:', user)
})

// Listen once
eventBus.$once('app-ready', () => {
  console.log('App is ready')
})

// Remove listener
const callback = data => console.log(data)
eventBus.$on('custom-event', callback)
eventBus.$off('custom-event', callback)
```

## Configuration

Global configuration options

```javascript
// Development vs Production
Vue.config.productionTip = false // Disable production tip
Vue.config.devtools = true // Enable Vue devtools
Vue.config.performance = true // Enable performance tracking

// Error handling
Vue.config.errorHandler = function (err, vm, info) {
  console.error('Vue Error:', err)
  console.error('Component:', vm)
  console.error('Info:', info)
  // Send to error tracking service
  // trackError(err, { component: vm.$options.name, info })
}

// Warning handler (development only)
Vue.config.warnHandler = function (msg, vm, trace) {
  console.warn('Vue Warning:', msg)
  console.warn('Trace:', trace)
}

// Custom element detection
Vue.config.ignoredElements = [
  'my-custom-web-component',
  /^ion-/ // RegExp for all ion- elements
]

// Key codes for v-on
Vue.config.keyCodes = {
  f1: 112,
  'media-play-pause': 179,
  down: [40, 34]
}

// Custom merge strategies
Vue.config.optionMergeStrategies.customOption = function (parentVal, childVal) {
  return childVal === undefined ? parentVal : childVal
}

// Silent mode (suppress warnings/logs)
Vue.config.silent = false

// Async component loading
Vue.config.async = true

// Example usage in component
const app = new Vue({
  el: '#app',
  customOption: 'custom value',
  mounted() {
    // Use custom key code
    // <input @keyup.media-play-pause="onPlayPause">
  },
  template: `
    <div>
      <input @keyup.f1="showHelp">
      <my-custom-web-component></my-custom-web-component>
    </div>
  `,
  methods: {
    showHelp() {
      console.log('F1 pressed')
    }
  }
})
```

## Lifecycle Hooks

Component lifecycle management

```javascript
const LifecycleDemo = {
  name: 'LifecycleDemo',
  props: ['userId'],
  data() {
    return {
      user: null,
      message: 'Initial'
    }
  },
  // Creation phase
  beforeCreate() {
    // Called before instance is initialized
    // No access to data, computed, methods
    console.log('beforeCreate: instance initializing')
  },
  created() {
    // Instance created, data reactive, computed/methods available
    // No access to DOM ($el not available)
    console.log('created: instance created')
    this.fetchUser()
  },
  // Mounting phase
  beforeMount() {
    // Called before mounting begins
    // Template compiled, not yet rendered
    console.log('beforeMount: about to mount')
  },
  mounted() {
    // Component mounted to DOM, $el available
    console.log('mounted: component in DOM')
    console.log('Element:', this.$el)
    // Good place for: DOM manipulation, third-party library init
    this.initThirdPartyLib()
  },
  // Update phase
  beforeUpdate() {
    // Called when data changes, before DOM re-render
    console.log('beforeUpdate: data changed')
    console.log('Old DOM:', this.$el.textContent)
  },
  updated() {
    // Called after DOM re-render
    console.log('updated: DOM updated')
    console.log('New DOM:', this.$el.textContent)
    // Avoid changing state here (can cause infinite loop)
  },
  // Keep-alive specific
  activated() {
    // Called when kept-alive component is activated
    console.log('activated: component activated')
    this.refreshData()
  },
  deactivated() {
    // Called when kept-alive component is deactivated
    console.log('deactivated: component deactivated')
    this.pausePolling()
  },
  // Destruction phase
  beforeDestroy() {
    // Called before component destruction
    console.log('beforeDestroy: about to destroy')
    // Clean up: timers, subscriptions, event listeners
    this.cleanup()
  },
  destroyed() {
    // Component destroyed, all directives unbound
    console.log('destroyed: component destroyed')
  },
  // Error handling
  errorCaptured(err, vm, info) {
    // Capture errors from child components
    console.error('Error captured:', err, info)
    return false // Prevent error propagation
  },
  methods: {
    async fetchUser() {
      const response = await fetch(`/api/users/${this.userId}`)
      this.user = await response.json()
    },
    initThirdPartyLib() {
      // Initialize third-party library
    },
    refreshData() {
      // Refresh data when activated
    },
    pausePolling() {
      // Pause polling when deactivated
    },
    cleanup() {
      // Clean up resources
    }
  }
}

const app = new Vue({
  el: '#app',
  components: {
    'lifecycle-demo': LifecycleDemo
  },
  template: '<lifecycle-demo :user-id="123" />'
})
```

## Slots

Content distribution system

```javascript
// Basic slot usage
Vue.component('alert-box', {
  template: `
    <div class="alert">
      <strong>Alert!</strong>
      <slot></slot>
    </div>
  `
})

// Named slots
Vue.component('layout', {
  template: `
    <div class="layout">
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>
  `
})

// Scoped slots
Vue.component('todo-list', {
  props: ['todos'],
  template: `
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <slot name="todo" :todo="todo" :index="index">
          {{ todo.text }}
        </slot>
      </li>
    </ul>
  `
})

// Using components with slots
const app = new Vue({
  el: '#app',
  data: {
    todos: [
      { id: 1, text: 'Learn Vue', completed: false },
      { id: 2, text: 'Build app', completed: true }
    ]
  },
  template: `
    <div>
      <alert-box>
        Something bad happened!
      </alert-box>

      <layout>
        <template v-slot:header>
          <h1>Page Title</h1>
        </template>

        <p>Main content goes here</p>

        <template v-slot:footer>
          <p>Footer content</p>
        </template>
      </layout>

      <todo-list :todos="todos">
        <template v-slot:todo="{ todo }">
          <span :class="{ done: todo.completed }">
            {{ todo.text }}
          </span>
        </template>
      </todo-list>
    </div>
  `
})

// Slot with fallback content
Vue.component('submit-button', {
  template: `
    <button type="submit">
      <slot>Submit</slot>
    </button>
  `
})

// Dynamic slot names
Vue.component('dynamic-slots', {
  template: `
    <div>
      <slot :name="dynamicSlotName"></slot>
    </div>
  `,
  data() {
    return {
      dynamicSlotName: 'header'
    }
  }
})
```

## Vue Summary

Vue.js 2 serves as a progressive framework that bridges the gap between simple DOM manipulation libraries and full-featured SPA frameworks. Its reactive system automatically tracks dependencies and updates the view when data changes, while the virtual DOM ensures efficient rendering. The component system promotes reusability and maintainability, with props for parent-to-child communication and events for child-to-parent messaging. Vue's template syntax provides an intuitive declarative way to bind data to the DOM, though render functions offer programmatic control when needed.

The framework's ecosystem includes official libraries like Vue Router for routing, Vuex for state management, and Vue Server Renderer for SSR capabilities. Vue 2's Options API provides a structured way to organize component logic through data, computed properties, methods, and lifecycle hooks. The plugin system allows extending functionality globally, while directives enable custom DOM manipulation. With features like mixins for code reuse, filters for text formatting, watchers for reactive side effects, and a flexible slot system for content distribution, Vue 2 provides comprehensive tools for building modern web applications ranging from simple widgets to complex single-page applications.
