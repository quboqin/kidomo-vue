import fs from 'fs/promises'
import path from 'path'

const copyDir = async (src, dest) => {
  await fs.mkdir(dest, { recursive: true })
  let entries = await fs.readdir(src, { withFileTypes: true })

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name)
    let destPath = path.join(dest, entry.name)

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

const srcDir = path.resolve('./dist')
const iOSDestDir = path.resolve('../kidomo-ios/kidomo/dist')

console.time('copy to iOS time')
copyDir(srcDir, iOSDestDir)
  .then(() => console.log('Copy completed.'))
  .catch((err) => console.error('Error copying files:', err))
  .finally(() => console.timeEnd('copy to iOS time'))

const androidDestDir = path.resolve('../kidomo-android/app/src/main/assets/dist')

console.time('copy to android time')
copyDir(srcDir, androidDestDir)
  .then(() => console.log('Copy completed.'))
  .catch((err) => console.error('Error copying files:', err))
  .finally(() => console.timeEnd('copy to android time'))
