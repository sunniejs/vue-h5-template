import Vue from 'vue'

Vue.directive('focus', {
  inserted: function(el) {
    // 获取焦点
    el.focus()
  }
})

Vue.directive('numberOnly', {
  inserted: function(el) {
    // 获取焦点
    el.handler = function() {
      el.value = el.value.replace(/[^\d]/g, '')
    }
    el.addEventListener('input', el.handler)
  }
})
Vue.directive('resetPage', {
  inserted: function(el) {
    // 监听键盘收起事件
    document.body.addEventListener('focusout', () => {
      if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        // 软键盘收起的事件处理
        setTimeout(() => {
          const scrollHeight =
            document.documentElement.scrollTop || document.body.scrollTop || 0
          window.scrollTo(0, Math.max(scrollHeight - 1, 0))
        }, 100)
      }
    })
  }
})
