import { fileURLToPath } from 'node:url'
import { describe, it, expect } from 'vitest'
import { setup, $fetch } from '@nuxt/test-utils/e2e'

describe('dependency optimization', async () => {
  await setup({
    rootDir: fileURLToPath(new URL('./fixtures/externalized-sanitize', import.meta.url))
  })

  it('works when sanitize-html is configured as optimizeDeps external', async () => {
    const html = await $fetch('/')
    expect(html).toContain('<p>Hello</p>')
    expect(html).not.toContain('alert(1)')
  })
})
