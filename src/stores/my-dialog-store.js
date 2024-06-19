import { defineStore } from 'pinia'
import log from 'electron-log'
import MyDialog from '../components/MyDialog.vue'

export const useMyDialogStore = defineStore('myDialogStore', {
  state: () => ({
    msg: 'Message from DIALOG Store',
    onOkCallback: () => { log.debug('my-dialog-store onOK callback') }
  }),
  actions: {
    openMyDialog (quasar) {
      quasar.dialog({
        component: MyDialog,
        // props forwarded to your custom component
        componentProps: {
          text: this.msg
        }
      }).onOk(() => {
        this.onOkCallback()
        console.log('OK')
      }).onCancel(() => {
        console.log('Cancel')
      }).onDismiss(() => {
        console.log('Dismiss')
        window.pl.send('leaveFullScreen')
      })
    }
  }
})
