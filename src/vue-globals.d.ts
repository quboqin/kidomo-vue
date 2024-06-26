// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ComponentCustomProperties } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $globalLogger: (message: string) => void
  }
}

declare global {
  interface Window {
    callbackFromSwift: (jsonObject: any) => void
    callbackFromKotlin: (jsonObject: any) => void
    nativeImageData: (jsonObject: any) => void
    nativeLocationData: (jsonObject: any) => void
    webkit: any
  }
  const Android: any
}
