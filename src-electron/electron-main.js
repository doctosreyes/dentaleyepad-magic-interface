import { app } from 'electron'
import os from 'os'
import { initSettings, createTray, createWindow, mainWindow } from './app-when-ready'
import log from 'electron-log'
import path from 'path'

log.initialize()
log.info('process.env.DEV: ', process.env.DEV)

require('./ipc-main-handlers')

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

const iconPath = process.env.DEV ? path.join('public', 'favicon.ico') : path.join(path.resolve(__dirname), 'favicon.ico')

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (ev, args) => {
    mainWindow.webContents.send('args', args)
    mainWindow.show()
  })

  app.whenReady().then(() => {
    initSettings()
    createWindow()
    createTray()
  })

  app.on('window-all-closed', () => {
    if (platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (mainWindow === null) {
      createWindow()
    }
  })
}

export { iconPath }
