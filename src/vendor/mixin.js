const nativePage = Page
Page = options => {
  const mixins = options.mixins
  if (Array.isArray(mixins)) {
    Reflect.deleteProperty(options, 'mixins')
    merge(mixins, options)
  }
  nativePage(options)
}

// 原生Page属性
const properties = ['data', 'onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap']

// 合并mixins属性到Page的options中
function merge(mixins, options) {
  mixins.reverse().forEach(mixin => {
    if (Object.prototype.toString.call(mixin).slice(8, -1) === 'Object') {
      for (let [key, value] of Object.entries(mixin)) {
        if (key === 'data') {
          options.data = Object.assign({}, value, options.data)
        } else if (properties.includes(key)) {
          let native = options[key]
          options[key] = function (...args) {
            value.call(this, ...args)
            return native && native.call(this, ...args)
          }
        } else {
          options = Object.assign({}, mixin, options)
        }
      }
    }
  })
}