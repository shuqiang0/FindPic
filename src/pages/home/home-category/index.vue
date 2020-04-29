<template>
  <view class="home_category">
    <navigator 
      class="category_item"
      v-for="item in category"
      :key="item.id"
      :url="`/pages/imgCategory/index?id=${item.id}`"
    >
      <image mode="aspectFill" :src="item.cover"></image>
      <view class="category_title">{{item.name}}</view>
    </navigator>
  </view>
</template>

<script>
export default {
  data(){
    return {
      category:[]
    }
  },
  mounted(){
    uni.setNavigationBarTitle({title:'分类'})
    this.getList()
  },
  methods:{
    getList(){
      this.request({
        url:'http://157.122.54.189:9088/image/v1/vertical/category'
      }).then(res=>{
        this.category = res.res.category
        console.log(this.category)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.home_category{
  display: flex;
  flex-wrap: wrap;
  .category_item{
    position: relative;
    width: 33.33%;
    border: 5rpx solid #fff;
    image{
      width: 240rpx;
      height: 240rpx;
    }
    .category_title{
      padding-left: 20rpx;
      width: 100%;
      height: 60rpx;
      line-height: 60rpx;
      font-size: 36rpx;
      color: #fff;
      position: absolute;
      bottom: 0;
      background-image: linear-gradient(to right top,rgba(0,0,0,0.3),rgba(0,0,0,0));
    }
  }
}
</style>