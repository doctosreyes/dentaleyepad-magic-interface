import { defineStore } from 'pinia'

export const useUserDrawerStore = defineStore('userDrawer', {
  state: () => ({
    width: 200,
    open: false
  })
})
