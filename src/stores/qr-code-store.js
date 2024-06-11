import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useQrCodeStore = defineStore('qrCodeStore', () => {
  const qr = ref('')

  return { qr }
})
