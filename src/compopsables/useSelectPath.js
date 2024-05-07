import { ref, onUnmounted } from 'vue'
import log from 'electron-log'

export default function useSelectPath () {
  const selectedPath = ref(null)

  const selectPath = (options) => {
    window.pl.send('showOpenDialog', options)
    window.pl.receive('selectedPath', (dirPath) => {
      if (!dirPath.canceled) {
        log.debug(`receive selectedPath: ${JSON.stringify(dirPath)}`)
        selectedPath.value = dirPath.filePaths
      } else {
        log.debug('selectPath was canceled')
      }
    })
  }

  onUnmounted(() => {
    window.pl.removeReceiveListener('selectedPath')
  })

  return {
    selectPath,
    selectedPath
  }
}
