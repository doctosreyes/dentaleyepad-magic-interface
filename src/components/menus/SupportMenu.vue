<template>
    <q-menu>
      {{ version }}

      <q-list style="min-width: 30px">
        <q-item class="q-mt-sm" to="/tests">
          <q-item-section avatar>
            <q-icon name="test" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Test</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-mt-sm" to="/settings">
          <q-item-section avatar>
            <q-icon name="settings" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Settings</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-mt-sm" to="/input">
          <q-item-section avatar>
            <q-icon name="input" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Input</q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-mt-sm" to="/output">
          <q-item-section avatar>
            <q-icon name="output" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Output</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
</template>

<script setup>
import { version } from '../../../package.json'

</script>
