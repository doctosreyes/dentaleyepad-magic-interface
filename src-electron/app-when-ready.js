import { BrowserWindow, nativeImage, Tray, Menu, app } from 'electron'
import path from 'path'
import { trayTranslations, toggleMainWindow, checkConnector } from './main-functions'
import { iconPath } from './electron-main'
import constants from '../constants.json'
import log from 'electron-log'
import settings from 'app/src-electron/app/AppSettings'
import autoUpdate from './app/autoUpdate'
import OcrScan from './app/ocrScan/ocrScan'

let mainWindow, appTray

autoUpdate()

// #region OCR
function activateOcrScan () {
  log.debug('Activate OCR-Scan')
  const ocrScan = new OcrScan()
  ocrScan.registerGlobalShortcut()
  ocrScan.listenToScreenshotCaptured()
  ocrScan.listenToReloadOcrSettings()
  log.debug(`OCR Scan active: ${ocrScan.patientString}`)
}

// #endregion OCR

function initSettings () {
  let language
  if (settings.hasSync('language')) {
    language = settings.getSync('language')
    log.debug(`language is: ${language}`)
  } else {
    language = app.getLocale()
    settings.setSync('language', language)
    log.debug(`language set to: ${language}`)
  }
  setAutoLaunch()
  checkConnector()
}

function createWindow () {
  const windowState = settings.getSync('windowState') || {
    x: undefined,
    y: undefined
  }

  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 150,
    height: 260,
    x: windowState.x,
    y: windowState.y,
    frame: false,
    useContentSize: true,
    webPreferences: {
      sandbox: false,
      contextIsolation: true,
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD)
    }
  })

  mainWindow.loadURL(process.env.APP_URL)

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    mainWindow.webContents.openDevTools()
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on('devtools-opened', () => {
      mainWindow.webContents.closeDevTools()
    })
  }

  mainWindow.on('move', () => {
    const { x, y } = mainWindow.getBounds()
    settings.set('windowState', { ...settings.getSync('windowState'), x, y })
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

function createTray () {
  log.debug('createTray')
  appTray = new Tray(nativeImage.createFromPath(iconPath))
  appTray.setToolTip(`${constants.app.title} by doctorseyes GmbH`)
  appTray.setTitle(constants.app.title)

  appTray.window = mainWindow
  const contextMenuMac = Menu.buildFromTemplate([
    { label: 'show window', click: toggleMainWindow },
    { label: trayTranslations().label, role: 'quit' }
  ])
  const contextMenuPC = Menu.buildFromTemplate([
    { label: trayTranslations().label, role: 'quit' }
  ])

  process.platform === 'darwin'
    ? appTray.setContextMenu(contextMenuMac)
    : appTray.setContextMenu(contextMenuPC)

  appTray.addListener('click', () => {
    toggleMainWindow()
  })
  appTray.on('double-click', () => toggleMainWindow())
  appTray.addListener('right-click', () => {
    appTray.popUpContextMenu()
  })
}

async function setAutoLaunch () {
  log.info('autoLaunch main ready')
  const AutoLaunch = require('auto-launch')
  const dpgAutoLauncher = new AutoLaunch({ name: constants.app.title })
  let autoLaunch
  try {
    const settingsHasAutoLaunch = await settings.has('autoLaunch')
    const autoLaunchIsEnabled = await dpgAutoLauncher.isEnabled()
    if (settingsHasAutoLaunch) {
      autoLaunch = await settings.get('autoLaunch')
      if (!autoLaunch) {
        // autoLaunch === false
        log.debug(`setting of autoLaunch = ${autoLaunch}`)
        if (autoLaunchIsEnabled) {
          log.debug(`dpgAutoLauncher.isEnabled(): ${autoLaunchIsEnabled}`)
          dpgAutoLauncher.disable()
          log.debug('dpgAutoLauncher.disabled')
        }
      } else {
        if (!autoLaunchIsEnabled) await dpgAutoLauncher.enable()
      }
    } else {
      // set to TRUE at first install
      log.info('autoLaunch not set - set setting to true')
      try {
        await dpgAutoLauncher.enable()
        await settings.set('autoLaunch', true)
      } catch (error) {
        log.error(error)
        throw Error(error)
      }
    }
    dpgAutoLauncher
      .isEnabled()
      .then((res) => log.debug(`autoLaunch enable: ${res}`))
  } catch (error) {
    log.error(error)
    throw Error(error)
  }
}

export { initSettings, createWindow, mainWindow, createTray, appTray, activateOcrScan }
