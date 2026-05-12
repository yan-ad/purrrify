import type { DirectiveBinding } from 'vue'
import * as sanitizeHtmlModule from 'sanitize-html'
import { defineNuxtPlugin } from '#app'
import { useRuntimeConfig } from '#imports'

const sanitizeHtml = (() => {
  if (typeof sanitizeHtmlModule.default === 'function') {
    return sanitizeHtmlModule.default
  }

  throw new TypeError('[purrrify] Failed to resolve sanitize-html export')
})()

export default defineNuxtPlugin(({ vueApp }) => {
  const {
    public: { purrrify }
  } = useRuntimeConfig()

  function sanitize(binding: DirectiveBinding) {
    if (binding.arg && purrrify?.profiles?.[binding.arg]) {
      return sanitizeHtml(binding.value, purrrify.profiles[binding.arg])
    }

    return sanitizeHtml(binding.value)
  }

  vueApp.directive('sanitize-html', {
    created(el, binding) {
      el.innerHTML = sanitize(binding)
    },
    updated(el, binding) {
      el.innerHTML = sanitize(binding)
    },
    getSSRProps(binding) {
      return {
        innerHTML: sanitize(binding)
      }
    }
  })
})
