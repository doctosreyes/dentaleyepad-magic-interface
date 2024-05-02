import log from 'electron-log'
import { autoUpdater } from 'electron-updater'
import { mainWindow } from '../app-when-ready'
import { app, Notification, ipcMain } from 'electron'
import path from 'path'
import AppSettings from './AppSettings'

let note

function sendStatusToWindow (text) {
  log.info(text)
  mainWindow.webContents.send('update:status', text)
}

app.on('before-quit', () => {
  ipcMain.removeAllListeners('update:check')
  ipcMain.removeAllListeners('update:make')
})

app.on('ready', () => {
  app.setAppUserModelId('dentaleyepad-media-manager')
  note = new Notification({
    title: 'dentaleyepad-media-manager',
    body: 'UPDATE',
    silent: 'true',
    timeoutType: 'default',
    icon: process.env.DEV ? './favicon.ico' : path.join('favicon.ico')
  })

  ipcMain.on('update:check', () => {
    autoUpdate()
  })

  ipcMain.on('update:make', () => {
    autoUpdater.downloadUpdate()
  })
})

// ~~~~~~   AUTOUPDATE   ~~~~~~
export default function autoUpdate () {
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'info'
  autoUpdater.autoDownload = false
  log.info('Funktion autoUpdate gestartet ...')
  autoUpdater
    .checkForUpdates()
    .then(res => {
      res = JSON.parse(res)
      log.info('updateCheckandNotify - ', res)
      sendStatusToWindow('updateCheckandNotify - ' + res)
    })
    .catch(err => log.error('autoupdate.js: ' + err))

  // ~~~~~~   EVENTS AUTOUPDATE   ~~~~~~
  autoUpdater.on('update-available', (ev, info) => {
    note.on('click', () => {
      log.info('Notification clicked')
      mainWindow.webContents.send('update:show')
      mainWindow.show()
    })
    note.show()
    sendStatusToWindow('update:available')
    AppSettings.setSync('updateAvailable', true)
  })

  autoUpdater.on('error', (ev, err) => {
    sendStatusToWindow('Error in auto-updater.' + err)
  })

  autoUpdater.on('download-progress', progressObj => {
    let logMessage = 'Download speed: ' + progressObj.bytesPerSecond + ' bps'
    logMessage =
      logMessage +
      ' (' +
      progressObj.transferred +
      '/' +
      progressObj.total +
      ')'
    mainWindow.webContents.send('update:downloadProgress', progressObj.percent)
    sendStatusToWindow(logMessage)
  })

  autoUpdater.on('update-downloaded', (ev, info) => {
    sendStatusToWindow('update-downloaded')
    mainWindow.webContents.send('showUpdateInMenu')
    AppSettings.deleteSync('updateAvailable')
    process.env.PROD ? setTimeout(() => {
      autoUpdater.quitAndInstall()
    }, 1000)
      : console.log('Installation des Updates findet im DEV Mode nicht statt')
  })
}
// END   ~~~~~~   AUTOUPDATE   ~~~~~~
