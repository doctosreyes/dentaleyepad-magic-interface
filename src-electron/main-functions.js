import settings from 'app/src-electron/app/AppSettings'
import { mainWindow } from './app-when-ready'
import constants from '../constants.json'
import log from 'electron-log'
import { stat, readFileSync } from 'fs'
import path from 'path'
import { app } from 'electron'

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

function checkConnector () {
  settings.get('connector')
    .then((res) => {
      if (res === 'charly') {
        _connectorIsCharly()
      }
    })
    .catch(err => log.error(err))
}

function _connectorIsCharly () {
  settings.get('patientFile')
    .then((res) => {
      if (typeof res === 'undefined' || res === true) {
        if (typeof res === 'undefined') settings.setSync('patientFile', true)
        const pathPatientFile = path.join(settings.getSync('programDataPath'), 'patient.txt')

        const patientFileInterval = setInterval(() => {
          _readPatientFile(pathPatientFile)
        }, 1000)
        app.on('window-all-closed', () => {
          clearInterval(patientFileInterval)
        })
      }
    })
}

function _readPatientFile (pathPatientFile) {
  stat(pathPatientFile, (err, stats) => {
    if (err) {
      if (err.code !== 'ENOENT') log.error('readPatientFile: ' + err)
    } else {
      const patientFileData = settings.getSync('patientFileData')
      const fileTime = stats.ctime
      log.debug('types patientFileTime: ' + typeof patientFileData + ' fileTime: ' + typeof fileTime)
      log.debug(`TIMES: ${patientFileData.toString()} / ${fileTime.toString()}`)
      if (patientFileData.toString() !== fileTime.toString()) {
        log.debug('Charly PatientFile has changed')
        settings.setSync('patientFileData', fileTime.toString())
        const data = readFileSync(pathPatientFile, 'latin1')
        mainWindow.show()
        mainWindow.focus()
        mainWindow.webContents.send('args', process.env.DEV ? data : data)
      }
    }
  })
}

export {
  checkConnector,
  trayTranslations,
  toggleMainWindow,
  delay
}
