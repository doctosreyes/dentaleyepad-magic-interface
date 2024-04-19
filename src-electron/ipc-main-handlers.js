import { mainWindow, appTray } from './app-when-ready'
import { ipcMain, app } from 'electron'
import log from 'electron-log/main'
import constants from '../constants.json'
import { trayTranslations, delay } from './main-functions'
import { iconPath } from './electron-main'
import settings from 'electron-settings'

ipcMain.on('appRestart', async () => {
  log.debug('app restart initiated')
  if (process.env.DEV) {
    log.debug('RESTART')
  } else {
    try {
      app.relaunch()
      await delay(500)
      app.quit()
    } catch (error) {
      log.error(error)
    }
  }
})

ipcMain.on('settingSet', async (ev, data) => {
  try {
    await settings.set(`${data.key}`, data.value)
    log.debug(`settings.set key: ${data.key}, value: ${data.value}`)
  } catch (error) {
    console.error(`settings.set key: ${data.key}, value: ${data.value}`, error)
    throw error // Fehler weitergeben, um ihn in der QrCode.vue-Datei zu behandeln
  }
})

ipcMain.on('openQrCode', () => {
  log.debug('ipcMain on openQrCode START')
  mainWindow.webContents.send('openQrCode')
  log.debug('ipcMain on openQrCode after WebContent Send')
})

ipcMain.on('closeAppToTray', () => {
  log.debug('ipc-main-handlers closeAppToTray')
  mainWindow.hide()
  appTray.displayBalloon({
    icon: iconPath,
    title: constants.app.title,
    content: trayTranslations().content
  })
})

ipcMain.handle('getSettingValue', (event, key) => {
  return settings.get(key)
})
