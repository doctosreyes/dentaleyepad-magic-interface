import { contextBridge, ipcRenderer } from 'electron'
import log from 'electron-log/main'

contextBridge.exposeInMainWorld('pl', {
  send: (channel, data) => {
    log.debug(`preload send: ${channel} ${data}`)
    ipcRenderer.send(channel, data)
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  },
  removeReceiveListener: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  }
})
