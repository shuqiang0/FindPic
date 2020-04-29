<template>
  <view @click="handleClick">
    <slot></slot>
  </view>
</template>

<script>
export default {
  name: "ImgData",
  props: {
    list: {
      type: Array,
      default() {
        return [];
      }
    },
    index: {
      type: Number,
      default: 0
    }
  },
  methods:{
    handleClick(){
      getApp().globalData.imgList = this.list
      getApp().globalData.imgIndex = this.index
      uni.navigateTo({
        url:"/pages/imgDetail/index"
      })
    }
  }
};
</script>

<style scoped>
</style>