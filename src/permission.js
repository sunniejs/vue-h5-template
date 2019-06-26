import router from './router'

router.beforeEach(async(to, from, next) => {
  next()
})
router.afterEach(() => {})
