<template>
  <div>
    <ManagerProvider :manager="popupManager" />
    <h1>Hello World</h1>
    <button @click="openSayHi">Open Say Hi</button>
  </div>
</template>

<script lang="ts" setup>
import { popupManager } from './shared/provider'
import { ManagerProvider } from 'oh-popup-vue'
import { openSayHi } from './popups/sayhi/open'
</script>
