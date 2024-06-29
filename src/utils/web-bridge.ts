import type { App } from 'vue'

import { osInfoStore, useTaskStore, OSType } from '@/stores'

window.callbackFromKotlin = function (jsonObject: any) {
  console.log(`callbackFromKotlin: ${JSON.stringify(jsonObject)}`)
}

window.callbackFromSwift = function (jsonObject: any) {
  console.log(`callbackFromSwift:${JSON.stringify(jsonObject)}`)
}

window.nativeImageData = async function (jsonObject: any) {
  const image = jsonObject.image
  const taskStore = useTaskStore()
  await taskStore.updateTaskImage(jsonObject.taskId, image)
}

window.nativeLocationData = async function (jsonObject: any) {
  const latitude = jsonObject.latitude
  const longitude = jsonObject.longitude
  const taskStore = useTaskStore()
  await taskStore.updateTaskLocation(jsonObject.taskId, latitude, longitude)
}

class webBridge {
  static callNativeFunction(jsonObject: any): void {
    const sysInfoStore = osInfoStore()
    const os = sysInfoStore.getOperatingSystem()
    if (!jsonObject.callback) {
      jsonObject['callback'] = os === OSType.Android ? 'callbackFromKotlin' : 'callbackFromSwift'
    }
    if (os === OSType.Android) {
      Android.callFromJavascript(JSON.stringify(jsonObject))
    } else if (os === OSType.iOS && window.webkit) {
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
    webBridge.callNativeFunction(header)
  }

  static install(app: App) {
    const _webBridge = new webBridge()

    app.config.globalProperties.$webBridge = _webBridge

    // Optionally, provide the WebBridge instance through provide/inject mechanism
    // app.provide('webBridge', webBridge)

    app.config.globalProperties.$callNativeFunction = webBridge.callNativeFunction.bind(webBridge)

    _webBridge.setHeader()
  }
}

export default webBridge
