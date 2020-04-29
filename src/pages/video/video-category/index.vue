<template>
  <view class="video_category">
    <view class="category_item" v-for="item in videoCategory" :key="item.id">
      <image mode="aspectFill" :src="item.img"></image>
      <view class="category_name">{{item.name}}</view>
    </view>
  </view>
</template>

<script>
export default {
  props:{
    urlObj:Object
  },
  data(){
    return {
      videoCategory:[]
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    getList(){
      this.request({url:this.urlObj.url}).then(res=>{
        this.videoCategory = res.res.category
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.video_category{
  display: flex;
  flex-wrap: wrap;
  .category_item{
    width: 50%;
    position: relative;
    border: 5rpx solid #fff;
    image{}
    .category_name{
      width: 100%;
      height: 60rpx;
      font-size: 40rpx;
      color: #fff;
      position: absolute;
      bottom: 0;
      left: 0;
      padding-left: 20rpx;
      background-image: linear-gradient(to right top,rgba(0,0,0,0.5),rgba(0,0,0,0));
    }
  }
}
</style>