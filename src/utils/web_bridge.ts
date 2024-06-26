window.callbackFromKotlin = function (jsonObject: any) {
  alert('callbackFromKotlin')
}

window.callbackFromSwift = function (jsonObject: any) {
  alert('callbackFromSwift')
}

function showActionSheet() {
  Android.showActionSheet(true)
}
