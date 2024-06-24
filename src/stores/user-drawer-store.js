import { defineStore } from 'pinia'

export const useUserDrawerStore = defineStore('userDrawer', {
  state: () => ({
    bounds: { width: 700, height: 420 },
    qrCodeBounds: { width: 154, height: 260 },
    width: 200,
    open: false,
    supportDrawerOpen: false
  })
})
