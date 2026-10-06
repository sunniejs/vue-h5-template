const assert = require('node:assert/strict')
const { test } = require('node:test')

test('SSE parser handles UTF-8 and CRLF split across network chunks', async () => {
  const { parseSseStream } = await import('../src/services/ai/sse.js')
  const data = new TextEncoder().encode('data: {"type":"delta","delta":"你好"}\r\n\r\ndata: [DONE]\n\n')
  const stream = new ReadableStream({
    start(controller) {
      for (const byte of data) controller.enqueue(Uint8Array.of(byte))
      controller.close()
    }
  })
  const chunks = []
  for await (const event of parseSseStream(stream)) chunks.push(event)
  assert.deepEqual(chunks, [{ type: 'delta', delta: '你好' }, { type: 'done' }])
  assert.equal(stream.locked, false)
})

test('ending SSE iteration cancels and unlocks the unfinished stream', async () => {
  const { parseSseStream } = await import('../src/services/ai/sse.js')
  let cancelled = false
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new TextEncoder().encode('data: {"type":"delta","delta":"first"}\n\n'))
    },
    cancel() {
      cancelled = true
    }
  })
  for await (const event of parseSseStream(stream)) {
    assert.equal(event.delta, 'first')
    break
  }
  assert.equal(cancelled, true)
  assert.equal(stream.locked, false)
})

test('redirects and product images reject unexpected schemes and network-path URLs', async () => {
  const { getSafeRedirect } = await import('../src/utils/url.js')
  const { getSafeProductImage, parseProductId } = await import('../src/utils/product.js')
  assert.equal(getSafeRedirect('/shop/cart'), '/shop/cart')
  for (const url of ['//example.test/path', '/\\example.test', 'javascript:alert(1)']) {
    assert.equal(getSafeRedirect(url), '/home')
    assert.equal(getSafeProductImage(url), '/products/product-placeholder.svg')
  }
  assert.equal(getSafeProductImage('/products/mori-coffee.svg'), '/products/mori-coffee.svg')
  assert.equal(getSafeProductImage('https://example.test/coffee.png'), 'https://example.test/coffee.png')
  assert.equal(parseProductId('42'), 42)
  for (const id of ['0', '001', '1e3', '9007199254740993']) assert.equal(parseProductId(id), undefined)
})

test('cart caps quantity at stock and clears only selected lines', async () => {
  const { default: cart } = await import('../src/store/modules/cart.js')
  const state = cart.state()
  const first = { id: 1, stock: 3, priceCents: 499, status: 'on_sale' }
  const second = { id: 2, stock: 2, priceCents: 99, status: 'on_sale' }
  cart.mutations.add(state, { product: first, quantity: 2 })
  cart.mutations.add(state, { product: first, quantity: 2 })
  cart.mutations.add(state, { product: second, quantity: 1 })
  assert.equal(cart.getters.itemCount(state), 4)
  cart.mutations.toggle(state, 2)
  assert.equal(cart.getters.selectedTotal(state), 1497)
  cart.mutations.clearSelected(state)
  assert.deepEqual(
    state.lines.map(line => line.product.id),
    [2]
  )
})
