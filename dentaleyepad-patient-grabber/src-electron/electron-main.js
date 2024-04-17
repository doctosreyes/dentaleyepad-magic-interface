import { app } from 'electron'
import os from 'os'
import { createWindow, mainWindow } from './app-when-ready'

// needed in case process is undefined under Linux
const platform = process.platform || os.platform()

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
