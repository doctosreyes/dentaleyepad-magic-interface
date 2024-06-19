import { mainWindow, appTray } from './app-when-ready'
import { ipcMain, app, dialog, shell } from 'electron'
import log from 'electron-log/main'
import constants from '../constants.json'
import { trayTranslations, delay } from './main-functions'
import { iconPath } from './electron-main'
import path from 'path'
import settings from './app/AppSettings'

ipcMain.on('args', (ev, data) => { // get by comand
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

ipcMain.on('startRomexisLoaderBat', (ev) => {
  settings.get('dccTargetDir')
    .then((res) => {
      const loaderPath = path.join(res, 'Romexis', 'romexisLoader.bat')
      shell.openPath(loaderPath)
        .then((response) => {
          if (response) {
            log.error(`Error opening shortcut: ${response}`)
          } else {
            log.debug(`${loaderPath} opened successfully.`)
            mainWindow.hide()
          }
        })
    })
})

ipcMain.handle('executeCmd', async (ev, cmd) => {
  const { exec } = require('child_process')
  return new Promise((resolve, reject) => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject({ error: err.message, stderr })
      } else {
        resolve(stdout)
      }
    })
  })
})

ipcMain.handle('getBounds', async () => {
  log.debug('ipcMain.handle getBounds')
  return new Promise((resolve, reject) => {
    resolve(mainWindow.getBounds())
  })
})

ipcMain.on('checkDirAndMake', (ev, dir) => {
  mainWindow.setAlwaysOnTop(true)
  log.debug(`AppSettings checkDirAndMake ${dir}`)
  return settings.checkDirAndMake(dir)
})

ipcMain.on('takeScreenshot', (ev, data) => {
  log.debug(`IpcMain.ON TAKE SCREENSHOT: ${JSON.stringify(data)}`)
  mainWindow.webContents.send('takeScreenshot', data)
})

ipcMain.on('MainLayoutDialog', (ev, data) => {
  log.debug(`IpcMain.ON MainLayoutDialog: ${JSON.stringify(data)}`)
  mainWindow.webContents.send('MainLayoutDialog', data)
})

ipcMain.on('leaveFullScreen', (ev, data) => {
  log.debug(`IpcMain.ON leaveFullScreen: ${JSON.stringify(data)}`)
  mainWindow.fullScreen = false
})

app.on('before-quit', () => {
  ipcMain.removeAllListeners('startRomexisLoaderBat')
  ipcMain.removeAllListeners('closeAppToTray')
  ipcMain.removeAllListeners('appRestart')
  ipcMain.removeAllListeners('showMainWindows')
  ipcMain.removeAllListeners('args')
  ipcMain.removeAllListeners('MainLayoutDialog')
  ipcMain.removeAllListeners('takeScreenshot')
  ipcMain.removeAllListeners('leaveFullScreen')
})
