export const dep =
  '<span class="dep" style="font-weight: 300;">dental</span><span style="color:#009bdf; font-weight: 500; font-style: italic; margin-left: -0.1rem; padding-right: 0.14rem">eye</span><strong>pad</strong></span>'
export const dpg = `${dep}-patient-grabber`
export default {
  path: 'path',
  file: 'file',
  components: {
    settings: {
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
