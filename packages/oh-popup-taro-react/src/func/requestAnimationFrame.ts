import Taro from '@tarojs/taro'

export function requestAnimationFrame(cb: () => void) {
  var systemInfo = Taro.getSystemInfoSync()
  if (systemInfo.platform === 'devtools') {
    return setTimeout(function () {
      cb()
    }, 1000 / 30)
  }
  return Taro.createSelectorQuery()
    .selectViewport()
    .boundingClientRect()
    .exec(function () {
      cb()
    })
}
