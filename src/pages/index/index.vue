<!--
 * @Author: zephor5@https://github.com/zephor5
 * @Date: 2022-04-12 21:49:06
 * @LastEditTime: 2024-06-04 13:30:22
 * @LastEditors: Zephor5 zephor@qq.com
 * @Description:
 * @FilePath: \wedding-invitation-me\src\pages\index\index.vue
-->
<template>
  <div class="index">
    <image class="bg-image" :src="background" mode="aspectFill" />
    <div class="bg-swiper">
      <index-swiper :list="list" :info="info" :autoplay="autoplay"></index-swiper>
    </div>
    <div v-if="singlePage" class="single-page">
      <button class="single-page-btn" open-type="getUserInfo">👆点这儿撒花❀❀❀🎇🎇🎇</button>
    </div>
    <div>
      <div class="bg_music" v-if="isPlaying" @tap="audioPlay">
        <image src="../../static/images/music_icon.png" class="musicImg music_icon" />
        <image src="../../static/images/music_play.png" class="music_play pauseImg" />
      </div>
      <div class="bg_music" v-else @tap="audioPlay">
        <image src="../../static/images/music_icon.png" class="musicImg" />
        <image src="../../static/images/music_play.png" class="music_play playImg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import IndexSwiper from '@src/component/index-swiper.vue'
import { onHide, onLoad, onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app'
import { GlobalData } from '@src/types'
import { showToast } from '@src/utils'
import { getResouces } from '@src/api/wedding-invitation'

const isPlaying = ref(false)
const list = ref([])
const info = ref({})
const autoplay = ref(false)
const singlePage = ref(false)

const instance = getCurrentInstance()
const globalData: GlobalData = instance.appContext.config.globalProperties.globalData
const innerAudioContext = globalData.innerAudioContext
const background = ref('')
const videoUrl = ref('')

onLoad(() => {
  innerAudioContext.onEnded(onEnded)
  innerAudioContext.onPlay(onPlay)
  innerAudioContext.onPause(onPause)

  const db = wx.cloud.database()
  const common = db.collection('common')
  common.get().then(res => {
    const data = res.data[0]
    background.value = data.background
    info.value = data.info
    videoUrl.value = data.videoUrl
    if (data.msgEnable) {
      uni.setTabBarItem({
        index: 4,
        pagePath: '/pages/message/index',
        iconPath: 'static/images/5-1.png',
        selectedIconPath: 'static/images/5-2.png',
        text: '留言评论'
      })
    }
  })

  getBannerList()
})

onShow(() => {
  // autoplay.value = true
  const opts = wx.getLaunchOptionsSync()
  console.log('onShow', opts)
  singlePage.value = opts?.scene === 1154
})

onHide(() => {
  autoplay.value = false
})

const audioPlay = () => {
  if (innerAudioContext.paused) {
    innerAudioContext.play()
    showToast('背景音乐已开启~')
  } else {
    innerAudioContext.pause()
    showToast('您已暂停音乐播放~')
  }
}
const onPlay = () => {
  isPlaying.value = true
}
const onPause = () => {
  isPlaying.value = false
}
const onEnded = () => {
  if (globalData.musicIndex >= globalData.musicList.length) {
    globalData.musicIndex = 0
  }
  globalData.innerAudioContext.src = globalData.musicList[globalData.musicIndex].url
  globalData.musicIndex += 1
}

const getBannerList = () => {
  if (import.meta.env.VITE_VUE_WECHAT_TCB === 'true') {
    const db = wx.cloud.database()
    const banner = db.collection('banner')
    banner.get().then(res => {
      let result = []
      let animations = ['fadeInLeft', 'slideInDown', 'rotateInDownRight', 'rollIn', 'jackInTheBox', 'flip']
      for (let i = 0; i < res.data.length; i++) {
        result.push({
          url: res.data[i].url,
          show: i === 0,
          class: animations[i]
        })
      }
      list.value = result
    })
  } else {
    getResouces('index-banner').then(res => {
      let result = []
      let animations = ['fadeInLeft', 'slideInDown', 'rotateInDownRight', 'rollIn', 'jackInTheBox', 'flip']
      for (let i = 0; i < res.data.bannerList.length; i++) {
        result.push({
          url: res.data.bannerList[i].url,
          show: i === 0,
          class: animations[i]
        })
      }
      list.value = result
    })
  }
}

onShareAppMessage(() => {
  return {
    title: 'WZH&LQ的婚礼邀请',
    path: '/pages/index/index',
    imageUrl: '../../static/images/share-5.4.jpg'
  }
})
onShareTimeline(() => {
  return {
    title: 'WZH&LQ的婚礼邀请',
    imageUrl: '../../static/images/share-5.4.jpg'
  }
})
</script>

<style lang="scss">
@-webkit-keyframes musicRotate {
  from {
    -webkit-transformb: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes musicRotate {
  from {
    -webkit-transformb: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-ms-keyframes musicRotate {
  from {
    -webkit-transformb: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-o-keyframes musicRotate {
  from {
    -webkit-transformb: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@keyframes musicRotate {
  from {
    -webkit-transformb: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}
@-webkit-keyframes musicStop {
  from {
    -webkit-transform: rotate(20deg);
  }
  to {
    -webkit-transform: rotate(0deg);
  }
}
@-moz-keyframes musicStop {
  from {
    -webkit-transform: rotate(20deg);
  }
  to {
    -webkit-transform: rotate(0deg);
  }
}
@-ms-keyframes musicStop {
  from {
    -webkit-transform: rotate(20deg);
  }
  to {
    -webkit-transform: rotate(0deg);
  }
}
@-o-keyframes musicStop {
  from {
    -webkit-transform: rotate(20deg);
  }
  to {
    -webkit-transform: rotate(0deg);
  }
}
@keyframes musicStop {
  from {
    -webkit-transform: rotate(20deg);
  }
  to {
    -webkit-transform: rotate(0deg);
  }
}
@-webkit-keyframes musicStart {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(20deg);
  }
}
@-moz-keyframes musicStart {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(20deg);
  }
}
@-ms-keyframes musicStart {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(20deg);
  }
}
@-o-keyframes musicStart {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(20deg);
  }
}
@keyframes musicStart {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(20deg);
  }
}
@-webkit-keyframes infoAnimation {
  0% {
    -webkit-transform: scale(1) translate(0, 0);
  }
  50% {
    -webkit-transform: scale(0.9) translate(5px, 5px);
  }
  100% {
    -webkit-transform: scale(1) translate(0, 0);
  }
}
@-moz-keyframes infoAnimation {
  0% {
    -webkit-transform: scale(1) translate(0, 0);
  }
  50% {
    -webkit-transform: scale(0.9) translate(5px, 5px);
  }
  100% {
    -webkit-transform: scale(1) translate(0, 0);
  }
}
@-ms-keyframes infoAnimation {
  0% {
    -webkit-transform: scale(1) translate(0, 0);
  }
  50% {
    -webkit-transform: scale(0.9) translate(5px, 5px);
  }
  100% {
    -webkit-transform: scale(1) translate(0, 0);
  }
}
@-o-keyframes infoAnimation {
  0% {
    -webkit-transform: scale(1) translate(0, 0);
  }
  50% {
    -webkit-transform: scale(0.9) translate(5px, 5px);
  }
  100% {
    -webkit-transform: scale(1) translate(0, 0);
  }
}
@keyframes infoAnimation {
  0% {
    -webkit-transform: scale(1) translate(0, 0);
  }
  50% {
    -webkit-transform: scale(0.9) translate(5px, 5px);
  }
  100% {
    -webkit-transform: scale(1) translate(0, 0);
  }
}
.index {
  height: 100%;
  position: relative;
  .img {
    width: 100%;
    height: 100%;
  }
  .bg-swiper {
    width: 100%;
    height: 100%;
  }
  .inv {
    position: absolute;
    top: 20rpx;
    left: 89rpx;
    width: 572rpx;
    height: 69rpx;
    z-index: 9;
  }
  .single-page {
    position: fixed;
    left: 26%;
    bottom: 10rpx;
    .single-page-btn {
      border-radius: 20rpx;
      font-size: 26rpx;
    }
  }
  .bg_music {
    position: fixed;
    right: 10rpx;
    top: 100rpx;
    width: 100rpx;
    z-index: 99;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    .musicImg {
      width: 60rpx;
      height: 60rpx;
    }
    .music_icon {
      animation: musicRotate 3s linear infinite;
    }
    .music_play {
      width: 28rpx;
      height: 60rpx;
      margin-left: -10rpx;
      transform-origin: top;
      -webkit-transform: rotate(20deg);
      transform: rotate(20deg);
    }
    .playImg {
      animation: musicStop 1s linear forwards;
    }
    .pauseImg {
      animation: musicStart 1s linear forwards;
    }
  }
}
</style>
