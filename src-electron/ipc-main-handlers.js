import { mainWindow, appTray } from './app-when-ready'
import { ipcMain, app } from 'electron'
import log from 'electron-log/main'
import constants from '../constants.json'
import { trayTranslations, delay } from './main-functions'
import { iconPath } from './electron-main'

ipcMain.on('args', (ev, data) => {
  mainWindow.webContents.send('args', data)
  log.debug(`ipc-main-handlers send args: ${data}`)
})

ipcMain.on('showMainWindow', () => {
  mainWindow.show()
})

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

ipcMain.on('closeAppToTray', () => {
  log.debug('ipc-main-handlers closeAppToTray')
  mainWindow.hide()
  appTray.displayBalloon({
    icon: iconPath,
    title: constants.app.title,
    content: trayTranslations().content
  })
})

app.on('before-quit', () => {
  ipcMain.removeAllListeners('closeAppToTray')
  ipcMain.removeAllListeners('appRestart')
  ipcMain.removeAllListeners('showMainWindows')
  ipcMain.removeAllListeners('args')
})
