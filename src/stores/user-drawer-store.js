import { defineStore } from 'pinia'

export const useUserDrawerStore = defineStore('userDrawer', {
  state: () => ({
    width: 200,
    open: false,
    qrCodeWidth: 154,
    qrCodeHeight: 260,
    supportDrawerOpen: false
  })
})
