/*
 * @Author: Zephor5 zephor@qq.com
 * @Date: 2024-06-02 10:31:33
 * @LastEditors: Zephor5 zephor@qq.com
 * @LastEditTime: 2024-06-02 13:48:39
 * @FilePath: \wedding-invitation\src\static\functions\isUserGreeted\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const openid = wxContext.OPENID
  // openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID

  const res = await db.collection('user').where({ _openid: openid }).get()
  console.log(res)
  return {
    data: res.data?.length ? { ...res.data[0], openid } : null
  }
}
