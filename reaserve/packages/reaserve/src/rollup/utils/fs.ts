import * as nodeFs from 'fs'
import * as nodePath from 'path'

export const createDirSyncRecursive = (dir: string): void => {
  nodeFs.mkdirSync(nodePath.resolve(dir), { recursive: true })
}

export const copySyncRecursive = (src: string, dest: string): void => {
  const stat = nodeFs.statSync(src)
  if (stat.isDirectory()) {
    const files = nodeFs.readdirSync(src)
    for (let i = files.length; i-- > 0;) {
      copySyncRecursive(nodePath.join(src, files[i]), nodePath.join(dest, files[i]))
    }
  } else {
    createDirSyncRecursive(nodePath.dirname(dest))
    if (nodeFs.existsSync(dest)) nodeFs.unlinkSync(dest)
    nodeFs.copyFileSync(src, dest)
  }
}
