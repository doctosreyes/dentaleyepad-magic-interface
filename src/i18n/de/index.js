import { dpg } from '../en-US/index'

export default {
  path: 'Pfad',
  file: 'Datei',
  components: {
    settings: {
      charly: {
        title: 'Solutio Charly - Datei Input',
        hint: ''
      },
      autostart: {
        title: 'Bei Start von Windows ausführen',
        label: `Wenn diese Option aktiv ist, wird der ${dpg} bei jedem Start des PC auch gestartet`
      }
    },
    buttons: {
      romexis: {
        label: 'Romexis Import starten'
      }
    }
  }
}
