<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          GraphQL JMESPath Playground
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page padding>
        <Playground />
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script lang="ts" setup>
import Playground from './components/Playground.vue'
import { useQuasar } from 'quasar'
useQuasar().dark.set(window.matchMedia('(prefers-color-scheme: dark)').matches)


</script>