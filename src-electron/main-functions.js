import settings from 'app/src-electron/app/AppSettings'
import { mainWindow } from './app-when-ready'
import constants from '../constants.json'
import log from 'electron-log'
import { stat, readFile } from 'fs'
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
      label = `${constants.app.title} beenden`
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
      settings.has('patientFileData')
        .then((res) => {
          if (res) {
            settings.get('patientFileData')
              .then((patientFileData) => {
                const fileTime = stats.ctime
                // log.debug('types patientFileTime: ' + typeof patientFileData + ' fileTime: ' + typeof fileTime)
                log.debug(`TIMES: ${patientFileData} / ${fileTime.toString()}`)
                if (patientFileData !== fileTime.toString()) {
                  log.debug('Charly PatientFile has changed')
                  settings.set('patientFileData', fileTime.toString()).catch(err => log.error(err))
                  readFile(pathPatientFile, 'latin1', (err, data) => {
                    if (err) {
                      log.error(err)
                    } else {
                      const sanitize = require('sanitize-filename')
                      mainWindow.show()
                      mainWindow.focus()
                      data = data.split('|')
                      const practiceId = data[0]
                      const patientId = data[1]
                      let lastName = data[2]
                      lastName = sanitize(lastName)
                      let firstName = data[3]
                      firstName = sanitize(firstName)
                      let birthDay = data[4]
                      if (birthDay.indexOf('.') > -1) {
                        const birthArr = birthDay.split('.')
                        birthDay = `${birthArr[2]}${birthArr[1]}${birthArr[0]}`
                      }
                      data = `${practiceId}|${patientId}|${lastName}|${firstName}|${birthDay}`
                      log.debug(`BIRTHDAY: ${birthDay}`)
                      mainWindow.webContents.send('args', process.env.DEV ? data : data)
                    }
                  })
                }
              })
              .catch(err => log.error(err))
          } else {
            const dateTime = new Date().toString()
            settings.set('patientFileData', dateTime)
              .then(() => { _readPatientFile() })
          }
        })
    }
  })
}

export {
  checkConnector,
  trayTranslations,
  toggleMainWindow,
  delay
}
