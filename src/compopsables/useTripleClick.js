import { ref } from 'vue'
import log from 'electron-log'

export default function useTripleClick (func) {
  const clickCount = ref(0)
  const clickTime = 1000
  let lastClickTime = 0

  const handleClick = () => {
    const currentTime = new Date().getTime()
    const timeDiff = currentTime - lastClickTime

    if (timeDiff <= clickTime) {
      clickCount.value++
      if (clickCount.value === 3) {
        log.debug(`triple click in ${clickTime} ms`)
        func()
        clickCount.value = 0
      }
    } else {
      clickCount.value = 1
    }
    lastClickTime = currentTime
  }

  return {
    handleClick
  }
}
