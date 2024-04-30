import { mainWindow, appTray } from './app-when-ready'
import { ipcMain, app } from 'electron'
import log from 'electron-log/main'
import constants from '../constants.json'
import { trayTranslations, delay } from './main-functions'
import { iconPath } from './electron-main'

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

ipcMain.on('openRemoteTool', (ev, remoteTool) => {
  const { execFile } = require('node:child_process')
  const exePath = process.env.DEV ? `./public/${remoteTool}` : `${remoteTool}`
  log.debug(`ipc-main-handlers openRemoteTool exePath: ${exePath}`)
  execFile(exePath, (err, stdout, stderr) => {
    if (err) {
      log.error(err)
    }
    log.error(stderr)
    log.info(`exec->Splashtop: ${remoteTool}`, stdout)
  })
})

app.on('before-quit', () => {
  ipcMain.removeAllListeners('closeAppToTray')
  ipcMain.removeAllListeners('appRestart')
  ipcMain.removeAllListeners('openRemoteTool')
})
