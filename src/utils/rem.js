/**
 * 为了适配rem
 * 可以在main.js中全局引入
 */
(function(window, document) {
  function resize() {
    var ww = window.innerWidth
    if (ww > window.screen.width) {
      window.requestAnimationFrame(resize)
    } else {
      if (ww > 750) {
        ww = 750
      }
      document.documentElement.style.fontSize = (ww * 100) / 750 + 'px'
    }
  }

  resize()

  window.addEventListener('resize', resize)
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      resize()
    }
  })
})(window, document)
