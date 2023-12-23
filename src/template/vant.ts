import { getCurrentInstance } from 'vue'
import Vant from 'vant'

let installed = false
await loadStyle()

export function setupVant() {
  if (installed) return
  const instance = getCurrentInstance()
  instance.appContext.app.use(Vant)
  installed = true
}

function loadStyle() {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = '#STYLE#'
    link.addEventListener('load', resolve)
    link.addEventListener('error', reject)
    document.body.append(link)
  })
}
