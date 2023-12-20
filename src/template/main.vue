<script setup>
// import App from './App.vue'
import Vant from 'vant'
import { getCurrentInstance } from 'vue'

let installed = false
function setupVant() {
  if (installed) return
  const instance = getCurrentInstance()
  instance.appContext.app.use(Vant)
  installed = true
}
setupVant()
</script>

<template>
  Hello World
</template>
