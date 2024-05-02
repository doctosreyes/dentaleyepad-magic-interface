import { contextBridge, ipcRenderer } from 'electron'
import log from 'electron-log'
import fs from 'fs'

contextBridge.exposeInMainWorld('pl', {
  processPlatform: process.platform,
  fsStat: fs.stat,
  fsReadFile: fs.readFile,
  send: (channel, data) => {
    log.debug(`preload send: ${channel} ${JSON.stringify(data)}`)
    ipcRenderer.send(channel, data)
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args))
  },
  deleteSetting: (channel) => {
    ipcRenderer.send('deleteSetting', channel)
  },
  removeReceiveListener: (channel) => {
    ipcRenderer.removeAllListeners(channel)
  },
  getSettingValue: async (key) => {
    try {
      return await ipcRenderer.invoke('getSettingValue', key)
    } catch (error) {
      log.error('Fehler beim Abrufen des Werts', error)
      throw error // Fehler weitergeben, um ihn in Ihrer QrCode.vue-Datei zu behandeln
    }
  },
  hasSetting: async (key) => {
    try {
      return await ipcRenderer.invoke('hasSetting', key)
    } catch (error) {
      log.error('Fehler beim Abrufen des Werts', error)
      throw error // Fehler weitergeben, um ihn in Ihrer QrCode.vue-Datei zu behandeln
    }
  }
})
