<!--
 * @Author: zephor5@https://github.com/zephor5
 * @Date: 2022-04-13 09:21:48
 * @LastEditTime: 2024-06-02 13:56:28
 * @LastEditors: Zephor5 zephor@qq.com
 * @Description:
 * @FilePath: \wedding-invitation-me\src\pages\greet\index.vue
-->
<template>
  <div class="greet">
    <image class="head" src="../../static/images/heart-animation.gif" />
    <scroll-view scroll-y class="image-box" enable-flex>
      <div class="image-item" v-for="(user, index) in userList" :key="index">
        <!-- <view
          class="cu-avatar round lg"
          :style="{
            'background-image': `url(${user.avatarUrl})`
          }"
        ></view> -->
        <image class="cu-avatar round lg" :src="user.avatarUrl" />
        <p>{{ user.nickName }}</p>
      </div>
    </scroll-view>
    <p class="count">已收到{{ userList.length }}位好友送来的祝福</p>
    <div class="bottom">
      <button class="left" lang="zh_CN" open-type="getUserInfo" @getuserinfo="sendGreet">送上祝福</button>
      <button class="right" open-type="share">分享喜悦</button>
    </div>
  </div>

  <view class="cu-modal" :class="showModal ? 'show' : ''">
    <view class="cu-dialog">
      <view class="cu-bar bg-white justify-end">
        <view class="content">怎么称呼您？</view>
        <view class="action" @tap="hideModal">
          <text class="cuIcon-close text-red"></text>
        </view>
      </view>
      <view class="padding-sm">
        <form>
          <view class="cu-form-group margin-top">
            <view class="title">头像</view>

            <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
              <image class="cu-avatar round lg" :src="avatarUrl || avatarHolder" />
            </button>
          </view>
          <view class="cu-form-group margin-top">
            <view class="title">昵称</view>
            <input type="nickname" placeholder="请选择或输入昵称" @blur="onInput" v-model="nickname" />
          </view>
        </form>
      </view>
      <view class="cu-bar bg-white justify-end">
        <view class="action">
          <button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
          <button class="cu-btn bg-green margin-left" @tap="onConfirm">确定</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onShow, onShareAppMessage } from '@dcloudio/uni-app'
import { GlobalData } from '@src/types'
import { showToast } from '@src/utils'
import { getCurrentInstance, onMounted, ref } from 'vue'

const greeted = ref(false)
const userList = ref([])
const instance = getCurrentInstance()
const globalData: GlobalData = instance.appContext.config.globalProperties.globalData
const showModal = ref(false)
const avatarHolder = ref('cloud://wedding-3g05k4yzd513e5bb.7765-wedding-3g05k4yzd513e5bb-1258796497/avatar.svg')
const avatarUrl = ref('')
const nickname = ref(null)

// onMounted(() => {
//   getUserList()
// })

onShow(() => {
  console.log('greet onShow')
  getUserList()
  isUserGreeted()
})

const onInput = e => {
  nickname.value = e.detail.value
}

const hideModal = e => {
  showModal.value = false
}

const onConfirm = async () => {
  if (!nickname.value) {
    showToast('请选择或输入昵称~')
    return
  }

  if (!avatarUrl.value) {
    showToast('请选择或上传头像~')
    return
  }
  showModal.value = false

  if (!globalData.openid) {
    const userRes = await wx.cloud.callFunction({
      name: 'user',
      data: {}
    })
    console.log('userRes:', userRes)
    globalData.openid = (userRes.result as AnyObject).openid
  }
  const openid = globalData.openid

  const fileRes = await wx.cloud.uploadFile({
    cloudPath: `${openid}.jpg`, // 上传至云端的路径
    filePath: avatarUrl.value // 小程序临时文件路径
  })
  console.log('fileRes:', fileRes)
  addUser({
    nickName: nickname.value,
    avatarUrl: fileRes.fileID
  })
}

const sendGreet = e => {
  console.log(e)
  // if (e.target.errMsg === 'getUserInfo:ok') {
  //   avatarUrl.value = e.detail.userInfo.avatarUrl
  //   userInfo.value = e.detail.userInfo
  // }
  if (greeted.value) {
    showToast('您已经送过祝福了~')
  } else {
    avatarHolder.value = e.detail.userInfo.avatarUrl
    showModal.value = true
  }
}

const addUser = userInfo => {
  if (import.meta.env.VITE_VUE_WECHAT_TCB === 'true') {
    const db = wx.cloud.database()
    const user = db.collection('user')
    user
      .add({
        data: {
          ...userInfo
        }
      })
      .then(res => {
        showToast('祝福成功~')
        greeted.value = true
        getUserList()
      })
  } else {
    showModal.value = true
  }
}

const getUserList = () => {
  wx.cloud
    .callFunction({
      name: 'userList',
      data: {}
    })
    .then(res => {
      console.log(res)
      userList.value = (res.result as AnyObject).data || []
    })
}

const isUserGreeted = async () => {
  if (!globalData.userInfo) {
    const res = await wx.cloud.callFunction({
      name: 'isUserGreeted'
    })
    console.log(res)
    const userData = (res.result as AnyObject).data
    greeted.value = !!userData
    globalData.userInfo = userData
    if (greeted.value) {
      globalData.openid = userData.openid
    }
  } else {
    greeted.value = true
  }
}

const onChooseAvatar = e => {
  avatarUrl.value = e.detail.avatarUrl
}

onShareAppMessage(() => {
  return {
    title: 'WZH&LQ的婚礼邀请',
    path: '/pages/index/index'
  }
})
</script>

<style lang="scss" scoped>
.greet {
  width: 100%;
  height: 100%;
  .cu-form-group .title {
    min-width: calc(4em + 15px);
  }
  .head {
    height: 150rpx;
    width: 200rpx;
    margin: 0 auto;
  }
  .image-box {
    height: 700rpx;
    width: 750rpx;
    margin-left: 30rpx;
    border-radius: 16rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
    .image-item {
      width: 180rpx;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      padding: 25rpx;
      float: left;
      image {
        border-radius: 90rpx;
      }
      p {
        height: 90rpx;
        line-height: 60rpx;
        font-size: 24rpx;
        color: #444;
        width: 90rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }
    }
  }
  .bottom {
    height: 140rpx;
    position: fixed;
    bottom: 0;
    left: 0;
    background: rgba(255, 255, 255, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .left {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      width: 300rpx;
      color: #fff;
      background: #e62c6b;
      margin-right: 20rpx;
    }
    .right {
      height: 80rpx;
      line-height: 80rpx;
      font-size: 28rpx;
      color: #fff;
      width: 300rpx;
      background: #2ca6f9;
    }
  }
  .count {
    height: 60rpx;
    line-height: 60rpx;
    background: rgba(255, 255, 255, 0.5);
    position: fixed;
    bottom: 140rpx;
    left: 0;
    font-size: 28rpx;
    color: #444;
    text-align: center;
    width: 100%;
  }
}
</style>
