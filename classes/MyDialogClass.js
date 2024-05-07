import { Dialog } from 'quasar'
import log from 'electron-log'

export default class MyDialog {
  constructor (dialogObj) {
    this.tag = typeof dialogObj.tag === 'undefined' ? {} : dialogObj.tag
    this.title = dialogObj.title
    this.message = dialogObj.message
    this.action = typeof dialogObj.action === 'undefined' ? null : dialogObj.action
    this.cancel = typeof dialogObj.cancel === 'undefined' ? false : dialogObj.cancel
    this.persistent = typeof dialogObj.persistent === 'undefined' ? false : dialogObj.persistent
    this.html = typeof dialogObj.html === 'undefined' ? true : dialogObj.html
    this.funcOK = typeof dialogObj.funcOK === 'undefined' ? () => { log.debug(`Title: ${dialogObj.title} funkOK undefined`) } : dialogObj.funcOK
    this.funcCancel = typeof dialogObj.funcCancel === 'undefined' ? () => { log.debug(`Title: ${dialogObj.title} funcCancel undefined`) } : dialogObj.funcCancel
    this.funcDismiss = typeof dialogObj.funcDismiss === 'undefined' ? () => { log.debug(`Title: ${dialogObj.title} funcDismiss undefined`) } : dialogObj.funcDismiss
    this.createDialog()
  }

  createDialog () {
    Dialog.create({
      tag: this.tag,
      title: this.title,
      message: this.message,
      cancel: typeof this.cancel === 'undefined' ? false : this.cancel,
      persistent: typeof this.persistent === 'undefined' ? false : this.persistent,
      html: typeof this.html === 'undefined' ? false : this.html
    }).onOk(() => {
      if (this.action === 'app:relaunch') {
        window.pl.send('app:relaunch')
      }
      this.funcOK()
    }).onCancel(() => {
      this.funcCancel()
    }).onDismiss(() => { // I am triggered on both OK and Cancel
      this.funcDismiss()
    })
  }
}
