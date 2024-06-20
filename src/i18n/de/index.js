import { dpg } from '../en-US/index'

export default {
  path: 'Pfad',
  file: 'Datei',
  close: 'schließen',
  errorMsg: {
    ocrScan: {
      noId: 'ID wurde nicht erkannt, bitte nochmals versuchen.\nFalls dieser Fehler bestehen bleibt rufen Sie bitte den "doctorseyes support" an.'
    }
  },
  menu: {
    settings: 'Einstellungen',
    update: 'Update ist verfügbar.'
  },
  components: {
    settings: {
      dccTargetDir: {
        hint: 'Zielverzeichnis des control center.',
        btn: 'Wähle Zielverzeichnis',
        data: 'Einstellungen aus dem control center'
      },
      charly: {
        title: 'Solutio Charly - Datei Input',
        hint: ''
      },
      autostart: {
        title: 'Bei Start von Windows ausführen.',
        label: `Wenn diese Option aktiv ist, wird das ${dpg} bei jedem Start des PC auch gestartet.`
      }
    },
    buttons: {
      romexis: {
        label: 'Romexis Import starten'
      }
    }
  }
}
