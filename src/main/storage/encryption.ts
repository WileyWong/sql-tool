import CryptoJS from 'crypto-js'
import { networkInterfaces } from 'os'

/**
 * 获取本机 MAC 地址作为加密密钥的一部分
 */
function getMacAddress(): string {
  const nets = networkInterfaces()
  for (const name of Object.keys(nets)) {
    const netList = nets[name]
    if (!netList) continue
    for (const net of netList) {
      // 跳过内部接口和非 IPv4 地址
      if (!net.internal && net.family === 'IPv4' && net.mac !== '00:00:00:00:00:00') {
        return net.mac
      }
    }
  }
  // 如果没有找到 MAC 地址，使用默认值
  return 'sql-tool-default-key'
}

/**
 * 生成加密密钥
 */
function getEncryptionKey(): string {
  const mac = getMacAddress()
  // 使用 MAC 地址 + 固定盐值生成密钥
  return CryptoJS.SHA256(mac + 'sql-tool-salt').toString()
}

/**
 * AES 加密
 */
export function encrypt(data: string): string {
  const key = getEncryptionKey()
  return CryptoJS.AES.encrypt(data, key).toString()
}

/**
 * AES 解密
 */
export function decrypt(encryptedData: string): string {
  const key = getEncryptionKey()
  const bytes = CryptoJS.AES.decrypt(encryptedData, key)
  return bytes.toString(CryptoJS.enc.Utf8)
}
