export const dep =
  '<span class="dep" style="font-weight: 300;">dental</span><span style="color:#009bdf; font-weight: 500; font-style: italic; margin-left: -0.1rem; padding-right: 0.14rem">eye</span><strong>pad</strong></span>'
export const dpg = `${dep}-magic-interface`
export default {
  path: 'path',
  file: 'file',
  errorMsg: {
    ocrScan: {
      noId: 'ID not recognized, please try again.\nIn case that error will stay, call doctorseyes Support '
    }
  },
  menu: {
    settings: 'Settings',
    update: 'Update is available'
  },
  components: {
    settings: {
      dccTargetDir: {
        btn: '“target directory” which is set in the dentaleyepad-control-center'
      },
      charly: {
        title: 'Solutio Charly - File Input',
        hint: ''
      },
      autostart: {
        title: `Start of ${dpg}`,
        label: `${dpg} starts with windows`
      }
    },
    buttons: {
      romexis: {
        label: 'Start Romexis import'
      }
    }
  }
}
