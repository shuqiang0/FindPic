<template>
  <scroll-view @scrolltolower="handleToLower" scroll-y class="album_container">
    <!-- //轮播图开始 -->
    <swiper class="album_swiper" autoplay circular indicator-dots>
      <swiper-item v-for="item in banners" :key="item.id">
        <image :src="item.thumb" class="album_swiper_img"></image>
      </swiper-item>
    </swiper>
    <!-- 轮播图结束 -->

    <!-- 列表开始 -->
    <view class="album_list">
      <navigator 
        class="album_list_item" 
        v-for="item in album" 
        :key="item.id"
        :url="`/pages/album/index?id=${item.id}`"
      >
        <view class="album_img">
          <image mode="aspectFill" :src="item.cover"></image>
        </view>
        <view class="album_info">
          <view class="album_title">{{item.name}}</view>
          <view class="album_desc">{{item.desc}}</view>
          <view class="album_button">
            <view class="album_attention">+关注</view>
          </view>
        </view>
      </navigator>
    </view>
    <!-- 列表结束 -->
  </scroll-view>
</template>

<script>
export default {
  data(){
    return {
      //数据请求参数
      params:{
        limit:30,
        order:'new',
        skip:0
      },
      //轮播图
      banners:[],
      //专辑列表
      album:[],
      //数据是否还有
      hasMore:true
    }
  },
  mounted() {
    uni.setNavigationBarTitle({ title: "专辑" });
    this.getList()
  },
  methods: {
    //上滑触底更新
    handleToLower(){
      if (this.hasMore) {
        this.params.skip += this.params.limit
        this.getList()
      }else {
        uni.showToast({title:'没有更多数据了'})
      }
    },
    //获取数据
    getList(){
      this.request({
        url:"http://157.122.54.189:9088/image/v1/wallpaper/album",
        data:this.params,
      }).then(res => {
        //判断是否还有数据
        if (res.res.album.length === 0) {
          uni.showToast({
            title:'没有更多数据了',
            icon:"none"
          })
          this.hasMore = false
          return
        }
        //banner只需赋值一次
        if (this.banners.length === 0) {
          this.banners = res.res.banner
        }
        //数据叠加
        this.album = [...this.album,...res.res.album]
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .album_container{
    height: calc(100vh - 36px);
  }
  .album_swiper{
    height: 326.1rpx;
    .album_swiper_img{
      height: 100%;
    }
  }

  .album_list{
    .album_list_item{
      padding: 20rpx 10rpx;
      display: flex;
      border-bottom: 1px solid #ccc;
      .album_img{
        flex: 1;
        image{
          width: 200rpx;
          height: 200rpx;
        }
      }
      .album_info{
        padding-left: 20rpx;
        flex: 2;
        overflow: hidden;
        .album_title{
          color: #333;
          font-size: 30rpx;
          padding: 10rpx 0;
        }
        .album_desc{
          padding: 10rpx 0;
          font-size: 24rpx;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .album_button{
          padding: 10rpx 0;
          display: flex;
          justify-content: flex-end;
          .album_attention{
            color: $color;
            border: 1px solid $color;
            padding: 8rpx;
          }
        }
      }
    }
  }
</style>