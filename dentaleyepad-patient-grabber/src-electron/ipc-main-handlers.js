import { mainWindow } from './app-when-ready'
import { ipcMain } from 'electron'
import log from 'electron-log/main'

ipcMain.on('openQrCode', () => {
  log.debug('ipcMain on openQrCode START')
  mainWindow.webContents.send('openQrCode')
  log.debug('ipcMain on openQrCode after WebContent Send')
})
