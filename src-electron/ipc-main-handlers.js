import { mainWindow, appTray } from './app-when-ready'
import { ipcMain, app, dialog } from 'electron'
import log from 'electron-log/main'
import constants from '../constants.json'
import { trayTranslations, delay } from './main-functions'
import { iconPath } from './electron-main'

ipcMain.on('args', (ev, data) => {
  mainWindow.webContents.send('args', data)
  log.debug(`ipc-main-handlers send args: ${data}`)
})

ipcMain.on('setBounds', (ev, data) => {
  mainWindow.setBounds(data)
})

ipcMain.on('showMainWindow', () => {
  mainWindow.show()
  mainWindow.focus()
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

ipcMain.on('showOpenDialog', (ev, options) => {
  log.debug(`ipc-main-handlers -> showOpenDialog options: ${JSON.stringify(options)}`)
  dialog.showOpenDialog(options)
    .then((result) => {
      mainWindow.webContents.send('selectedPath', result)
      log.debug(`ipc-main-handlers -> showOpenDialog result: ${JSON.stringify(result)}`)
    })
    .catch(err => log.error(err))
})

app.on('before-quit', () => {
  ipcMain.removeAllListeners('closeAppToTray')
  ipcMain.removeAllListeners('appRestart')
  ipcMain.removeAllListeners('showMainWindows')
  ipcMain.removeAllListeners('args')
})
