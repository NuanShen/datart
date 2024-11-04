import CryptoJS from 'crypto-js';

/**
 * 密码加密方法
 * @param password 原始密码
 * @returns 加密后的密码
 */
export function encrypt(password: string): string {
  //从环境变量获取密钥
  let parse = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_SECRET_KEY);
  let encrypted = CryptoJS.AES.encrypt(password, parse, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv: parse,
  });
  return encrypted.toString();
}
