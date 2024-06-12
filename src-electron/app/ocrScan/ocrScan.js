import { app, globalShortcut, ipcMain } from 'electron'
import path from 'path'
import settings from '../AppSettings'
import log from 'electron-log'
import { mainWindow } from '../../app-when-ready'

const { ocrSpace } = require('ocr-space-api-wrapper')
const tempPath = app.getPath('temp')
const screenshotPath = path.join(tempPath, 'screenshot.png')
export default class OcrScan {
  constructor () {
    this.setShortcut()
    this.getPatientFileRectangles()
    this.getScreenshotResolution()
    this.getWindowName()
    this.scanResult = {}
    this.scanResultText = ''
    this.id = ''
    this.firstName = ''
    this.lastName = ''
    this.birhtdate = ''
    this.practiceId = '1'
    this.patientString = ''
  }

  listenToReloadOcrSettings () {
    ipcMain.on('reloadOcrSettings', () => {
      log.debug('ipcMain.on reloadOcrSettings')
      this.reloadOcrSettings()
    })
  }

  reloadOcrSettings () {
    this.setShortcut()
    this.getPatientFileRectangles()
    this.getScreenshotResolution()
    this.getWindowName()
    this.registerGlobalShortcut()
  }

  getPatientString () {
    // TODO control pateintSTring
    this.patientString = `patient_${this.id}_${this.lastName}_${this.firstName}_${this.birhtdate}_${this.practiceId}`
    return this.patientString
  }

  listenToScreenshotCaptured () {
    ipcMain.on('screenshotCaptured', () => {
      log.debug('ipcMain.on screenshotCaptured')
      this.scan(screenshotPath)
    })
  }

  setShortcut () {
    if (settings.hasSync('shortcuts.ocr')) {
      this.ocrShortcut = settings.getSync('shortcuts.ocr')
    } else {
      this.ocrShortcut = 'CmdOrCtrl+Shift+O'
      settings.set('shortcuts.ocr', this.ocrShortcut)
    }
    log.debug(`getShortcut  this.this.ocrShortcut: ${JSON.stringify(this.ocrShortcut)}`)
  }

  registerGlobalShortcut () {
    globalShortcut.register(this.ocrShortcut, () => {
      log.debug(`this.ocrShortcut: ${this.ocrShortcut}`)
      mainWindow.webContents.send('takeScreenshot', {
        screenshotResolution: this.screenshotResolution,
        windowName: this.windowName,
        rectangles: this.rectangles,
        crop: true,
        screenshotPath
      })
      mainWindow.show()
      mainWindow.webContents.send('showSpinner')
    })
  }

  getWindowName () {
    if (settings.hasSync('windowName')) {
      this.windowName = settings.getSync('windowName')
    } else {
      this.windowName = 'charly'
      settings.setSync('windowName', this.windowName)
    }
    log.debug(`getWindowName  this.windowName: ${JSON.stringify(this.windowName)}`)
  }

  getScreenshotResolution () {
    if (settings.hasSync('screenshotResolution')) {
      this.screenshotResolution = settings.getSync('screenshotResolution')
    } else {
      this.screenshotResolution = { width: 1920, height: 1080 }
      settings.setSync('screenshotResolution', this.screenshotResolution)
    }
    log.debug(`getScreenshotResolution  screenshotResolution: ${JSON.stringify(this.screenshotResolution)}`)
  }

  getPatientFileRectangles () {
    if (settings.hasSync('patientFileRectangles')) {
      this.rectangles = settings.getSync('patientFileRectangles')
    } else {
      this.rectangles = [{ x: 0, y: 2, width: 960, height: 30 }]
      settings.setSync('patientFileRectangles', this.rectangles)
    }
    log.debug(`getPatientFileRectangles rectangles: ${JSON.stringify(this.rectangles)}`)
  }

  async scan (screenshotPath) {
    try { // TODO add apiKey
      this.scanResult = await ocrSpace(screenshotPath, { apiKey: '', ocrUrl: 'https://apipro2.ocr.space/parse/image', language: 'ger', OCREngine: 2, isTable: true, filetype: 'png' })
      log.debug(this.scanResult)
      this.scanResultText = this.scanResult.ParsedResults[0].ParsedText
      log.info(this.scanResultText)
      const recognizedID = this.getIdOfScan()
      if (recognizedID) {
        this.getWholeName()
        this.getPatientString()
        mainWindow.webContents.send('patientString', this.patientString)
      }
      // Using your personal API key + base64 image + custom language
      // const res3 = await ocrSpace('data:image/png;base64...', { apiKey: '<API_KEY_HERE>', language: 'ita' });
    } catch (error) {
      log.error(error)
    }
  }

  getIdOfScan () {
    this.indexOfOpenBrace = this.scanResultText.indexOf('(')
    const indexOfCloseBrace = this.scanResultText.indexOf(')')
    log.debug(`ID results: ${this.indexOfOpenBrace}, ${indexOfCloseBrace}`)
    if (this.indexOfOpenBrace === -1 || indexOfCloseBrace === -1) {
      mainWindow.webContents.send('patientFileNoID', 'ID not recognized')
      return false
    }
    this.id = this.scanResultText.substring(this.indexOfOpenBrace + 1, indexOfCloseBrace)
    log.debug(`this.id: ${this.id}`)
    return true
  }

  getWholeName () {
    let charsToTrim = -1
    let indexOfNameBreak = this.scanResultText.indexOf('...')
    if (indexOfNameBreak === -1) indexOfNameBreak = this.scanResultText.indexOf('---')
    if (charsToTrim === -1 && indexOfNameBreak > -1) charsToTrim = 3

    if (indexOfNameBreak === -1) indexOfNameBreak = this.scanResultText.indexOf('--')
    if (indexOfNameBreak === -1) indexOfNameBreak = this.scanResultText.indexOf('..')
    if (indexOfNameBreak === -1) indexOfNameBreak = this.scanResultText.indexOf('••')
    if (charsToTrim === -1 && indexOfNameBreak > -1) charsToTrim = 2

    if (indexOfNameBreak === -1) indexOfNameBreak = this.scanResultText.lastIndexOf('\t', this.indexOfOpenBrace)
    if (charsToTrim === -1 && indexOfNameBreak > -1) charsToTrim = 1

    log.debug(`indexOfNameBreak: ${indexOfNameBreak}`)

    let names
    if (indexOfNameBreak > -1) {
      names = this.scanResultText.substring(indexOfNameBreak + charsToTrim, this.indexOfOpenBrace)
    } else {
      log.info('NAMES NOT RECOGNIZED')
      mainWindow.webContents.send('patientFileNoID', `NAMES NOT RECOGNIZED: ${this.scanResultText}`)
      return
    }

    log.debug(`names: ${names}`)
    let namesArr
    names.indexOf(',') > -1 ? namesArr = names.split(',') : namesArr = names.split('.')
    if (typeof namesArr[1] !== 'undefined') {
      this.firstName = namesArr[1].trim()
      log.debug(`1 after TRIM this.firstName: ${this.firstName}`)
    }
    if (typeof namesArr[0] !== 'undefined') {
      this.lastName = namesArr[0].trim()
      log.debug(`1 after TRIM this.lastName: ${this.lastName}`)
    }

    /* if (indexOfNameBreak === -1) {
      this.lastName = this.lastName.slice(-20)
    } */
    // this.lastName = this.removeSpecialChars(this.lastName)
    this.lastName = this.lastName.trim()
    log.debug(`this.firstName: ${this.firstName}, this.lastName: ${this.lastName}`)
  }

  removeSpecialChars (inputString) {
    // Use a regular expression to replace all special characters with an empty string
    return inputString.replace(/[^\w\s-]/gi, '')
  }
}

ipcMain.on('registerShortcut', (ev, data) => {
  log.debug(`registerShortcut: ${data}`)
  const ocrScan = new OcrScan()
  ocrScan.registerGlobalShortcut()
})