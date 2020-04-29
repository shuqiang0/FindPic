<template>
  <scroll-view 
    enable-flex
    class="video_main"
    scroll-y
    @scrolltolower="handleScrollToLower"
  >
    <view 
      class="video_item" 
      v-for="item in videowp" 
      :key="item.id"
      @click="handleToVideoPlay(item)"
    >
      <image mode="widthFix" :src="item.img"></image>
    </view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    urlObj: Object
  },
  data(){
    return {
      videowp:[],
      hasMore:true
    }
  },
  watch:{
    urlObj(){
      //清空以前数据
      this.videowp = []
      this.getList()
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    handleToVideoPlay(item){
      //将点击数据存在全局中
      getApp().globalData.video = item
      //跳转页面
      uni.navigateTo({
        url:'/pages/videoPlay/index'
      })
    },
    //下拉加载事件
    handleScrollToLower(){
      if (this.hasMore) {
        this.urlObj.params.skip += this.urlObj.params.limit
        this.getList()
      }else{
        uni.showToast({title:'没有数据了',icon:"none"})
      }
    },
    getList(){
      this.request({
        url:this.urlObj.url,
        data:this.urlObj.params
      }).then(res=>{
        if (res.res.videowp.length===0) {
          this.hasMore = false
          uni.showToast({title:'没有数据了',icon:"none"})
          return
        }
        //数据叠加
        this.videowp = [...this.videowp,...res.res.videowp]
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.video_main{
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 36px);
  .video_item{
    width: 33.33%;
    border: 5rpx solid #fff;
  }
}
</style>