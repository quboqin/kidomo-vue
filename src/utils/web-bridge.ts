import type { App } from 'vue'

import { systemInfoStore, useTaskStore } from '@/stores'

window.callbackFromKotlin = function (jsonObject: any) {
  alert(`callbackFromKotlin: ${JSON.stringify(jsonObject)}`)
}

window.callbackFromSwift = function (jsonObject: any) {
  alert(`callbackFromSwift:${JSON.stringify(jsonObject)}`)
}

window.nativeImageData = function (jsonObject: any) {
  const image = jsonObject.image
  const taskStore = useTaskStore()
  taskStore.updateTaskImage(jsonObject.taskId, image)
}

window.nativeLocationData = function (jsonObject: any) {
  const latitude = jsonObject.latitude
  const longitude = jsonObject.longitude
  const taskStore = useTaskStore()
  taskStore.updateTaskLocation(jsonObject.taskId, latitude, longitude)
}

class WebBridge {
  callNativeFunction(jsonObject: any): void {
    const sysInfoStore = systemInfoStore()
    const os = sysInfoStore.getOperatingSystem()
    if (!jsonObject.callback) {
      jsonObject['callback'] = os === 'Android' ? 'callbackFromKotlin' : 'callbackFromSwift'
    }
    if (os === 'Android') {
      Android.callFromJavascript(JSON.stringify(jsonObject))
    } else if (os === 'iOS' && window.webkit) {
      window.webkit.messageHandlers.Callback.postMessage(jsonObject)
    }
  }

  setHeader() {
    const header = {
      action: 'set_header',
      auth: {
        BladeAuth: 'bladeAuth_xxx',
        Authorization: 'authorization_xxx'
      }
    }
    this.callNativeFunction(header)
  }

  // Plugin installation method
  static install(app: App) {
    // Create an instance of WebBridge
    const webBridge = new WebBridge()

    // Make WebBridge instance available to the whole app
    app.config.globalProperties.$webBridge = webBridge

    // Optionally, provide the WebBridge instance through provide/inject mechanism
    // app.provide('webBridge', webBridge)

    app.config.globalProperties.$callNativeFunction = webBridge.callNativeFunction.bind(webBridge)

    webBridge.setHeader()
  }
}

export default WebBridge
