<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>{{ props.text }}</q-card-section>
      <q-card-actions align="center">
        <q-btn rounded unelevated style="width: 80px; background-color: #0090d7" label="OK" @click="onOKClick" />
        <q-btn rounded unelevated style="width: 80px; background-color: #0090d7" label="Cancel" @click="onCancelClick" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { useDialogPluginComponent } from 'quasar'
import log from 'electron-log'

// #region DIALOG
defineEmits([
  ...useDialogPluginComponent.emits
])

const props = defineProps({
  text: String
})
log.debug(`props text: ${props.text}`)

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()
// dialogRef      - Vue ref to be applied to QDialog
// onDialogHide   - Function to be used as handler for @hide on QDialog
// onDialogOK     - Function to call to settle dialog with "ok" outcome
//                    example: onDialogOK() - no payload
//                    example: onDialogOK({ /*...*/ }) - with payload
// onDialogCancel - Function to call to settle dialog with "cancel" outcome

// this is part of our example (so not required)
function onOKClick () {
  // on OK, it is REQUIRED to
  // call onDialogOK (with optional payload)

  onDialogOK()
}

function onCancelClick () {
  onDialogCancel()
}

</script>
