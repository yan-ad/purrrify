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

    // Transpile for SSR build to avoid CJS interop issues
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
