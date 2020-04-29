<template>
  <view class="album_container">
    <view class="album_cover">
      <view class="album_cover_img">
        <image mode="widthFix" :src="album.cover"></image>
      </view>
      <view class="album_cover_info">
        <view class="album_cover_title">{{album.name}}</view>
        <view class="album_cover_btn">关注专辑</view>
      </view>
    </view>
    <view class="album_user">
      <view class="album_user_info">
        <image :src="album.user.avatar"></image>
        <text class="album_user_name">{{album.user.name}}</text>
      </view>
      <view class="album_user_comment">{{album.desc}}</view>
    </view>
    <view class="album_img_list">
      <view class="album_img_item" v-for="(item,index) in wallpaper" :key="item.id">
        <img-data :list="wallpaper" :index="index">
          <image mode="aspectFill" :src="item.thumb + item.rule.replace('$<Height>', 200)"></image>
        </img-data>
      </view>
    </view>
  </view>
</template>

<script>
import ImgData from "@/components/imgdata/index";
export default {
  components:{
    ImgData
  },
  data() {
    return {
      params:{
        limit:15,
        order:'new',
        skip:0,
        // 1为第一次获取数据，0表示不是第一次
        first:1
      },
      id:0,
      album:{},
      wallpaper:[],
      hasMore:true
    };
  },
  onLoad(options) {
    this.id = options.id
    this.getList()
  },
  methods:{
    getList(){
      this.request({
        url:`http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data:this.params
      }).then(res=>{
        console.log(res.res.wallpaper)
        if (res.res.wallpaper.length === 0) {
          uni.showToast({
            title:'没有更多数据了',
            icon:"none"
          })
          this.hasMore = false
          return
        }
        if (this.params.first === 1) {
          this.album = res.res.album
          this.params.first = 0
        }
        this.wallpaper = [...this.wallpaper, ...res.res.wallpaper]
      })
    }
  },
  //上滑触底刷新
  onReachBottom(){
    if (this.hasMore) {
      this.params.skip += this.params.limit
      this.getList()
    }else{
      uni.showToast({
        title:'没有更多数据了',
        icon:"none"
      })
    }
  }
};
</script>

<style lang="scss" scoped>
  .album_cover{
    position: relative;
    .album_cover_info{
      width: 100%;
      position: absolute;
      bottom: 20rpx;
      left: 0;
      padding: 0 40rpx;
      display: flex;
      justify-content: space-between;
      .album_cover_title{
        font-size: 40rpx;
        color: #fff;
      }
      .album_cover_btn{
        border-radius: 10rpx;
        height: 60rpx;
        width:152rpx;
        background-color: $color;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .album_user{
    padding: 20rpx;
    .album_user_info{
      display: flex;
      align-items: center;
      image{
        border-radius: 50%;
        width: 80rpx;
        height: 80rpx;
      }
      .album_user_name{
        color: #333;
        margin-left: 20rpx;
      }
    }
    .album_user_comment{
      padding: 20rpx 0;
      font-size: 24rpx;
    }
  }
  .album_img_list{
    display: flex;
    flex-wrap: wrap;
    .album_img_item{
      width: 33.33%;
      border: 5rpx solid #fff;
      image{
        height: 160rpx; 
      }
    }
  }
</style>