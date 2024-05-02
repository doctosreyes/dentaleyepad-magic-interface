import settings from 'app/src-electron/app/AppSettings'
import { mainWindow } from './app-when-ready'
import constants from '../constants.json'
import log from 'electron-log'

function trayTranslations () {
  let content = ''
  let label = ''
  let language = ''

  // set language
  if (settings.hasSync('language')) {
    language = settings.getSync('language')
  }

  log.debug(`trayTranslations language = ${language}`)

  switch (language) {
    case 'de':
      content = 'Die Anwendung läuft im Tray weiter'
      label = 'dentaleyepad-patient-grabber beenden'
      break

    default:
      content = 'app runs in tray'
      label = `quit ${constants.app.title}`
      break
  }
  return { label, content }
}

function toggleMainWindow () {
  if (mainWindow.isVisible()) {
    mainWindow.hide()
  } else {
    mainWindow.show()
  }
}

function delay (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export {
  trayTranslations,
  toggleMainWindow,
  delay
}
