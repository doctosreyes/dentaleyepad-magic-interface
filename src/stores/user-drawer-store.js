import { defineStore } from 'pinia'

export const useUserDrawerStore = defineStore('userDrawer', {
  state: () => ({
    bounds: { width: 600, height: 375 },
    qrCodeBounds: { width: 154, height: 260 },
    width: 200,
    open: false,
    supportDrawerOpen: false
  })
})
