<template>
  <view class="img_category">
    <!-- 分段器开始 -->
    <view class="img_category_nav">
      <view class="img_category_title">
        <uni-segmented-control :current="current" :values="items.map(v => v.title)" @clickItem="onClickItem" style-type="text" active-color="#b43465"></uni-segmented-control>
      </view>
      <text class="iconfont iconsearch"></text>
    </view>
    <!-- 分段器结束 -->

    <!-- 图片列表开始 -->
    <scroll-view @scrolltolower="handleScrollToLower" scroll-y class="img_category_content">
      <view class="img_item_wrapper">
        <view class="img_item" v-for="(item,index) in imgList" :key="item.id" @click="handleToImgDetail(index)">
          <image mode="widthFix" :src="item.thumb"></image>
        </view>
      </view>
    </scroll-view>
    <!-- 图片列表结束 -->
    
  </view>  
</template>

<script>
import { uniSegmentedControl } from "@dcloudio/uni-ui";
export default {
  components:{
    uniSegmentedControl
  },
  data(){
    return {
      imgList:[],
      params:{
        //一次获取几条
        limit:30,
        //数据类型
        order:'new',
        //跳过几条
        skip:0
      },
      id:'',
      items: [{title:'最新',type:'new'},{title:'热门',type:'hot'}],
      current: 0,
      hasMore:true
    }
  },
  mounted(){
    let pages = getCurrentPages()
    this.id = pages[pages.length-1].options.id
    this.getList()
  },
  methods:{
    handleToImgDetail(index){
      //将当前页面中的图片数据保存在全局变量中
      getApp().globalData.imgList = this.imgList
      getApp().globalData.imgIndex = index
      //跳转到图片详情页面
      uni.navigateTo({
        url:'/pages/imgDetail/index'
      })
    },
    //scroll-view的下滑触底加载
    handleScrollToLower(){
      if (this.hasMore) {
        //跳过多少条
        this.params.skip += this.params.limit
        //进行数据加载
        this.getList()
      }else{
        uni.showToast({
          title:'已经没有数据了', 
          icon:"none"
        })
      }
    },
    //获取数据
    getList(){
      this.request({
        url:`http://157.122.54.189:9088/image/v1/vertical/category/${this.id}/vertical`,
        data:this.params
      }).then(res => {
        if (res.res.vertical.length === 0) {
          this.hasMore = false
          uni.showToast({
            title:'已经没有数据了',
            icon:'none'
          })
          return
        }
        //数据叠加
        this.imgList = [...this.imgList, ...res.res.vertical]
      })
    },
    //分段器点击
    onClickItem(e) {
      /**
       * 1.修改navtab
       * 2.根据修改tab的索引，更改数据请求的类型
       * 3.数据请求
       */
      if (this.current !== e.currentIndex) {
          this.current = e.currentIndex;
      }else{
        //点击同样的tab,不进行数据加载
        return
      }
      //重置数据请求类型
      this.params.order = this.items[e.currentIndex].type
      //重置跳过多少条
      this.params.skip = 0
      //重置图片列表
      this.imgList = []
      //数据请求
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .img_category{
    .img_category_nav{
      position: relative;
      .img_category_title{
        width: 60%;
        margin: 0 auto;
      }
      .iconsearch{
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: 5%;
      }

    }
    .img_category_content{
      height: calc(100vh - 36px);
      .img_item_wrapper{
        display: flex;
        flex-wrap: wrap;
      }
      .img_item{
        width: 33.33%;
        border: 5rpx solid #fff;
      }
    }
    
  }
</style>