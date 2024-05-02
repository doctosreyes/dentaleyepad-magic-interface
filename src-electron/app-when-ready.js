import { BrowserWindow, nativeImage, Tray, Menu, app } from 'electron'
import path from 'path'
import { trayTranslations, toggleMainWindow } from './main-functions'
import { iconPath } from './electron-main'
import constants from '../constants.json'
import log from 'electron-log'
import settings from 'app/src-electron/app/AppSettings'
import autoUpdate from './app/autoUpdate'

let mainWindow, appTray

autoUpdate()

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
}

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, 'icons/icon.png'), // tray icon
    width: 200,
    height: 250,
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

export { initSettings, createWindow, mainWindow, createTray, appTray }
