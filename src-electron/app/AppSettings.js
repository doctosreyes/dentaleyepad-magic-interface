import fs from 'fs'
import { app, remote, ipcMain } from 'electron'
import path from 'path'
import log from 'electron-log'

const settings = {
  programDataPath: path.resolve(process.env.ProgramData || 'C:\\ProgramData', typeof remote === 'undefined' ? app.getName() : remote.app.getName()),
  pathOfApp: typeof remote === 'undefined' ? path.resolve(app.getAppPath()) : path.resolve(remote.app.getAppPath()),
  appSettingsPath: null,
  dccTargetDir: '',
  paths: {

  },
  port: 9701,

  initOrResetAllAppSettings () {
    log.debug('initOrResetAllAppSettings')
    settings.paths = {
      programData: this.programDataPath,
      xnview: 'C:\\Program Files\\XnViewMP\\xnviewmp.exe'
    }

    this.writeSettingsFile()
  },

  loadSettings () {
    const settings = fs.readFileSync(this.appSettingsPath, 'utf-8')
    log.debug(`loadSettings settings: ${settings}`)
    const parsedSettings = JSON.parse(settings)

    // Aktualisiere die Einstellungen des Moduls
    Object.assign(this, parsedSettings)
  },

  deleteAll () {
    Object.assign(this, {})
    this.writeSettingsFile()
  },

  deleteSync (key) {
    log.debug(`Deleting setting for key: ${key}`)

    // Split the key into parts
    const keys = key.split('.')

    // Get the last key
    const lastKey = keys.pop()

    // Traverse the settings object based on the key parts
    let obj = this
    for (const k of keys) {
      obj = obj[k]
      if (typeof obj !== 'object') {
        // If any intermediate key does not exist or is not an object, stop traversal
        return
      }
    }

    // Delete the key from the object
    if (obj && Object.prototype.hasOwnProperty.call(obj, lastKey)) {
      delete obj[lastKey]
      this.writeSettingsFile()
      log.debug(`Setting for key ${key} deleted.`)

      // Check if the parent object is now empty and delete it recursively if it is
      let parentObj = this
      for (let i = 0; i < keys.length; i++) {
        const k = keys[i]
        if (Object.keys(parentObj[k]).length === 0) {
          delete parentObj[k]
          log.debug(`Empty parent object for key ${key} deleted.`)
        } else {
          // Stop recursion if the parent object is not empty
          break
        }
        parentObj = parentObj[k]
      }
    } else {
      log.debug(`Setting for key ${key} not found.`)
    }
  },

  has (key) {
    return new Promise((resolve, reject) => {
      this.get(key)
        .then(() => resolve(true))
        .catch(() => resolve(false))
    })
  },

  hasSync (key) {
    const hasSetting = this.getSync(key)
    return typeof hasSetting !== 'undefined'
  },

  setSync (key, value) {
    log.debug(`AppSettings -> set key: ${key}, value: ${value}`)
    // Split the key into parts
    const keys = key.split('.')

    // Get the last key
    const lastKey = keys.pop()

    // Traverse the settings object based on the key parts
    let obj = this
    for (const k of keys) {
      obj[k] = obj[k] || {}
      obj = obj[k]
    }

    // If the last key already exists and is an object, merge the new value with it
    if (Object.prototype.hasOwnProperty.call(obj, lastKey) && typeof obj[lastKey] === 'object' && typeof value === 'object') {
      Object.assign(obj[lastKey], value)
    } else {
      // Otherwise, set the value at the last key
      obj[lastKey] = value
    }

    this.writeSettingsFile()
    log.debug(`AppSettings -> ${key} is set`)
  },

  set (key, value) {
    return new Promise((resolve, reject) => {
      log.debug(`AppSettings -> set key: ${key}, value: ${value}`)
      // Split the key into parts
      const keys = key.split('.')

      // Get the last key
      const lastKey = keys.pop()

      // Traverse the settings object based on the key parts
      let obj = this
      for (const k of keys) {
        obj[k] = obj[k] || {}
        obj = obj[k]
      }

      // If the last key already exists and is an object, merge the new value with it
      if (Object.prototype.hasOwnProperty.call(obj, lastKey) && typeof obj[lastKey] === 'object' && typeof value === 'object') {
        Object.assign(obj[lastKey], value)
      } else {
        // Otherwise, set the value at the last key
        obj[lastKey] = value
      }
      try {
        this.writeSettingsFile()
        log.debug(`AppSettings -> ${key} is set`)
        resolve(true)
      } catch (error) {
        reject(error)
      }
    })
  },

  get (key) {
    return new Promise((resolve, reject) => {
      log.debug(`AppSettings -> get key: ${key}`)

      // Split the key into parts
      const keys = key.split('.')

      // Traverse the settings object based on the key parts
      let obj = this
      for (const k of keys) {
        obj = obj[k]
        if (typeof obj === 'undefined') {
          // Key not found
          reject('undefined')
        }
      }

      // Return the value
      log.debug(`AppSettings -> ${key} is ${JSON.stringify(obj)}`)
      resolve(obj)
    })
  },

  getSync (key) {
    log.debug(`AppSettings -> get key: ${key}`)

    // Split the key into parts
    const keys = key.split('.')

    // Traverse the settings object based on the key parts
    let obj = this
    for (const k of keys) {
      obj = obj[k]
      if (typeof obj === 'undefined') {
        // Key not found
        return undefined
      }
    }

    // Return the value
    log.debug(`AppSettings -> ${key} is ${JSON.stringify(obj)}`)
    return obj
  },

  writeSettingsFile () {
    try {
      fs.writeFileSync(this.appSettingsPath, JSON.stringify(this, null, 2))
      log.debug('AppSettings -> file has been written')
    } catch (error) {
      log.error(`Error at writing AppSettings file:\n${error}`)
    }
  },
  checkDirAndMake (dirPath) {
    const pathExists = fs.existsSync(dirPath)
    if (!pathExists) { // path does not exist
      log.debug(`${dirPath} NOT EXISTS`)
      // make path
      try {
        fs.mkdirSync(dirPath)
        log.debug(`${dirPath} EXISTS`)
      } catch (error) {
        log.error(error)
      }
    }
  }
} // #endregion SETTINGS OBJECT

if (!fs.existsSync(settings.programDataPath)) {
  fs.mkdir(settings.programDataPath, (err) => {
    if (err) {
      log.error(err)
    } else {
      log.info(`mkdir ${settings.programDataPath}: SUCCESS`)
    }
  })
} else { log.debug(`${settings.programDataPath}: EXISTS`) }

// #region MAIN LISTENERS
ipcMain.handle('hasSetting', (event, key) => {
  return settings.has(key)
    .then(result => {
      return result
    })
    .catch(err => log.error(err))
})

ipcMain.handle('getSettingValue', (event, key) => {
  return settings.getSync(key)
})

ipcMain.on('settingSet', async (ev, data) => {
  settings.setSync(`${data.key}`, data.value)
  log.debug(`settings.set key: ${data.key}, value: ${data.value}`)
})
// #endregion

settings.appSettingsPath = path.join(settings.programDataPath, 'AppSettings.json')
if (fs.existsSync(settings.appSettingsPath)) {
  log.debug('AppSettings -> FILE is EXISTING')
  settings.loadSettings()
} else {
  log.info('AppSettings -> FILE is NOT EXISTING')
  // settings.port = 9701
  settings.initOrResetAllAppSettings()
}

export default settings
