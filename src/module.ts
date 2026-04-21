import {
  defineNuxtModule,
  addPlugin,
  addTypeTemplate,
  createResolver
} from '@nuxt/kit'
import type { ModuleOptions } from './types'

export * from './types'

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'purrrify',
    configKey: 'purrrify'
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    if (options.profiles) {
      nuxt.options.runtimeConfig.public.purrrify = {
        profiles: options.profiles
      }
    }

    // Ensure Vite pre-bundles the CJS `sanitize-html` package into ESM
    // so `import sanitizeHtml from 'sanitize-html'` resolves correctly
    // in the browser. Without this, Vite serves the raw CJS file and
    // the client throws: "does not provide an export named 'default'".
    nuxt.options.vite ||= {}
    nuxt.options.vite.optimizeDeps ||= {}
    nuxt.options.vite.optimizeDeps.include ||= []
    if (!nuxt.options.vite.optimizeDeps.include.includes('sanitize-html')) {
      nuxt.options.vite.optimizeDeps.include.push('sanitize-html')
    }

    // Also transpile for SSR build to avoid the same CJS interop issue
    // when Nitro bundles the server entry.
    nuxt.options.build.transpile ||= []
    if (!nuxt.options.build.transpile.includes('sanitize-html')) {
      nuxt.options.build.transpile.push('sanitize-html')
    }

    addTypeTemplate({
      filename: 'types/purrrify.d.ts',
      getContents() {
        return `import type { ObjectDirective } from 'vue'
declare module 'vue' {
  interface GlobalDirectives {
    vSanitizeHtml: ObjectDirective<HTMLElement, string>
  }
}
export {}`
      }
    })

    addPlugin(resolver.resolve('./runtime/plugin'))
  }
})
