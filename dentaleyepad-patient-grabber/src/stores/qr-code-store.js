import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useQrCodeStore = defineStore('qrCodeStore', () => {
  const qr = ref('')

  function setQrCode (results) {
    let id = results[0].data.text
    id = id.replace(/\n/, '')
    let firstName = results[1].data.text
    firstName = firstName.replace(/\n/, '')
    let lastName = results[2].data.text
    lastName = lastName.replace(/\n/, '')

    const qrCode = `0|${id}|${lastName}|${firstName}`
    console.log(qrCode)
    qr.value = qrCode
  }

  return { qr, setQrCode }
})
