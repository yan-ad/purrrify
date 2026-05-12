import MyModule from '../../../src/module'

export default defineNuxtConfig({
  modules: [MyModule],
  vite: {
    optimizeDeps: {
      rolldownOptions: {
        external: ['sanitize-html']
      }
    }
  }
})
