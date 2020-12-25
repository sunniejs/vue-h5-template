/**
 * localStorage操作
 * @type {{get(*=, *=): *, save(*=, *=): void, clear(): void, remove(*=): void}}
 */
const db = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
  },
  get(key, defaultValue = {}) {
    return JSON.parse(localStorage.getItem(key)) || defaultValue
  },
  remove(key) {
    localStorage.removeItem(key)
  },
  clear() {
    localStorage.clear()
  }
}

export default db
