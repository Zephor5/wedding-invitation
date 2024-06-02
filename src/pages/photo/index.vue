<!--
 * @Author: zephor5@https://github.com/zephor5
 * @Date: 2022-04-13 09:29:23
 * @LastEditTime: 2024-06-02 17:50:37
 * @LastEditors: Zephor5 zephor@qq.com
 * @Description:
 * @FilePath: \wedding-invitation\src\pages\photo\index.vue
-->
<template>
  <div class="photo">
    <image class="bg-image" :src="background" mode="aspectFill" />
    <h-swiper :list="list" :isGif="isGif" :autoplay="autoplay"></h-swiper>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import HSwiper from '@src/component/swiper.vue'
import { onHide, onShow } from '@dcloudio/uni-app'
import { getResouces, getCommonConfig } from '@src/api/wedding-invitation'

const list = ref([])
const isGif = ref(false)
const background = ref('')
const autoplay = ref(false)

onMounted(() => {
  getList()

  if (import.meta.env.VITE_VUE_WECHAT_TCB === 'true') {
    const db = wx.cloud.database()
    const common = db.collection('common')
    common.get().then(res => {
      background.value = res.data[0].background
    })
  } else {
    getCommonConfig().then(res => {
      background.value = res.data.background
    })
  }
})

onShow(() => {
  autoplay.value = true
})

onHide(() => {
  autoplay.value = false
})

const getList = () => {
  if (import.meta.env.VITE_VUE_WECHAT_TCB === 'true') {
    const db = wx.cloud.database()
    const banner = db.collection('pics')
    banner.get().then(res => {
      let result = []
      for (let i = 0; i < res.data.length; i++) {
        let show = i === 0
        result.push({
          url: res.data[i].url,
          show: show,
          no: res.data[i].no || i
        })
      }
      list.value = result.sort((a, b) => a.no - b.no)
    })
  } else {
    getResouces('photo-banner').then(res => {
      let result = []
      for (let i = 0; i < res.data.bannerList.length; i++) {
        let show = i === 0
        result.push({
          url: res.data.bannerList[i].url,
          show: show
        })
      }
      list.value = result
    })
  }
}
</script>

<style lang="scss" scoped>
.photo {
  height: 100%;
}
</style>
