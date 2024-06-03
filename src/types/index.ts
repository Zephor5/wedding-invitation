/*
 * @Author: zephor5@https://github.com/zephor5
 * @Date: 2022-04-13 09:54:01
 * @LastEditTime: 2024-06-02 16:26:49
 * @LastEditors: Zephor5 zephor@qq.com
 * @Description:
 * @FilePath: \wedding-invitation\src\types\index.ts
 */

export type GlobalData = {
  openid: ''
  userInfo: {
    openid: string
    nickName: string
    avatarUrl: string
  }
  referrerInfo: AnyObject
  innerAudioContext: WechatMiniprogram.InnerAudioContext
  musicList: Array<{
    id: string
    url: string
  }>
  musicIndex: number
  animations: Array<
    // | `bounce`
    // | `flash`
    | `pulse`
    | `rubberBand`
    // | `shake`
    | `headShake`
    | `swing`
    | `tada`
    | `wobble`
    | `jello`
    // | `bounceIn`
    // | `bounceInDown`
    // | `bounceInLeft`
    // | `bounceInRight`
    // | `bounceInUp`
    // | `fadeIn`
    // | `fadeInDown`
    // | `fadeInDownBig`
    // | `fadeInLeft`
    // | `fadeInLeftBig`
    // | `fadeInRight`
    // | `fadeInRightBig`
    // | `fadeInUp`
    // | `fadeInUpBig`
    | `flipInX`
    | `flipInY`
    | `lightSpeedIn`
    // | `rotateIn`
    // | `rotateInDownLeft`
    // | `rotateInDownRight`
    // | `rotateInUpLeft`
    // | `rotateInUpRight`
    | `jackInTheBox`
    | `rollIn`
    | `zoomIn`
    | `zoomInDown`
    | `zoomInLeft`
    | `zoomInRight`
    | `zoomInUp`
    | `slideInDown`
    | `slideInLeft`
    | `slideInRight`
    | `slideInUp`
  // | `heartBeat`
  >
}
