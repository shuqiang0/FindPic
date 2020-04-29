<template>
  <view class="img_detail" v-if="Object.keys(imgDetail).length">
    <!-- 用户信息开始 -->
    <view class="user_info" v-if="imgDetail.user">
      <view class="user_avatar"><image mode="widthFix" :src="imgDetail.user.avatar"></image></view>
      <view class="user_name_time">
        <view class="user_name">{{imgDetail.user.name}}</view>
        <view class="user_time">{{imgDetail.cntime}}</view>
      </view>
    </view>
    <!-- 用户信息结束 -->
    <!-- 大图开始 -->
    <the-slide @slideAction="handleSlideAction">
      <image mode="widthFix" class="user_img" :src="imgDetail.thumb"></image>
    </the-slide>
    <!-- 大图结束 -->
    <!-- 点赞收藏开始 -->
    <view class="img_link_collect">
      <view class="img_like">
        <text class="iconfont icondianzan"></text>
        {{imgDetail.rank}}
      </view>
      
      <view class="img_collect">
        <text class="iconfont iconshoucang"></text>收藏
      </view>
    </view>
    <!-- 点赞收藏结束 -->

    <!-- 下载开始 -->
    <view class="download" @click="handleDownload">
      <view class="download_btn">下载图片</view>
    </view>
    <!-- 下载结束 -->

    <!-- 专辑开始 -->
    <view v-if="Object.keys(album).length" class="img_album">
      <view class="img_album_title">相关</view>
      <view class="album_container">
        <view class="album_img"><image mode="aspectFill" :src="album.cover"></image></view>
        <view class="album_info">
          <view class="album_mark">专辑</view>
          <view class="album_name">{{album.name}}</view>
          <text class="iconfont iconiconfontjiantou4"></text>
        </view>
      </view>
    </view>
    <!-- 专辑结束 -->
    
    <!-- 最热评论开始 -->
    <view v-if="hot.length" class="comment hot">
      <view class="comment_title">
        <text class="iconfont iconhot1"></text>
        最热评论
      </view>
      <view class="comment_item" v-for="item in hot" :key="item.id">
        <view class="comment_left"><image mode="aspectFill" :src="item.user.avatar"></image></view>
        <view class="comtent_right">
          <view class="user_name">{{item.user.name}}</view>
          <view class="comment_time">{{item.atime | formatTime}}</view>
          <view class="comment_content">{{item.content}}</view>
          <text class="iconfont icondianzan">{{item.size}}</text>
        </view>
      </view>
    </view>
    <!-- 最热评论结束 -->

    <!-- 最新评论开始 -->
    <view v-if="comment.length" class="comment new">
      <view class="comment_title">
        <text class="iconfont iconpinglun"></text>
        最新评论
      </view>
      <view class="comment_item" v-for="item in comment" :key="item.id">
        <view class="comment_left"><image mode="aspectFill" :src="item.user.avatar"></image></view>
        <view class="comtent_right">
          <view class="user_name">{{item.user.name}}</view>
          <view class="comment_time">{{item.atime | formatTime}}</view>
          <view class="comment_content">{{item.content}}</view>
          <text class="iconfont icondianzan">{{item.size}}</text>
        </view>
      </view>
    </view>
    <!-- 最新评论结束 -->
  </view>
</template>

<script>
import moment from 'moment'
import TheSlide from "@/components/slide/index";
//将时间格式转换为中文
moment.locale('zh-cn')
export default {
  components:{
    TheSlide
  },
  data(){
    return{
      //图片信息，用户信息
      imgDetail:{},
      //专辑信息
      album:{},
      //最新评论
      comment:[],
      //最热评论
      hot:[]
    }
  },
  onLoad(){
    const { imgList, imgIndex } = getApp().globalData
    console.log(imgList)
    //获取指定索引图片详情
    this.imgDetail = imgList[imgIndex]
    //处理时间格式为...前
    this.imgDetail.cntime = moment(this.imgDetail.atime*1000).fromNow()
    //根据id请求评论数据
    this.getComments(this.imgDetail.id)
  },
  methods:{
    //点击下载图片
    async handleDownload(){
      await uni.showLoading({title:"正在下载中..."})
      //将图片下载小程序内存中
      const res1 = await uni.downloadFile({url:this.imgDetail.img})
      const { tempFilePath } = res1[1]
      //将小程序内存中的图片下载到本地
      const res2 = await uni.saveImageToPhotosAlbum({filePath:tempFilePath})
      if (res2.length === 1) {
        await uni.showToast({title:"下载失败！"})
      }else{
        await uni.showToast({title:"下载成功！"})
      }
    },
    //滑动事件
    handleSlideAction(res){
      //保存全局变量对象
      let globalData = getApp().globalData
      if (res.direction === 'left') {
        if (globalData.imgIndex === globalData.imgList.length-1) {
          globalData.imgIndex = -1
        }
        globalData.imgIndex++
      }else{
        if (globalData.imgIndex === 0) {
          globalData.imgIndex = globalData.imgList.length
        }
        globalData.imgIndex--
      }
      this.imgDetail = globalData.imgList[globalData.imgIndex]
      this.getComments(this.imgDetail.id)
    },
    getComments(id){
      this.request({
        url:`http://157.122.54.189:9088/image/v2/wallpaper/wallpaper/${id}/comment`
      }).then(res=>{
        console.log(res.res)
        if (res.res.album) {
          this.album = res.res.album[0]
        }
        this.comment = res.res.comment
        this.hot = res.res.hot
      })
    }
  },
  filters:{
    formatTime(time){
      return moment(time*1000).fromNow()
    }
  }
}
</script>

<style lang="scss" scoped>
  .img_detail{
    .user_img{
      border-bottom: 1rpx solid #eee;
    }
    .user_info{
      padding: 40rpx;
      display: flex;
      align-items: center;
      .user_avatar{
        width: 80rpx;
        height: 80rpx;
        image{
          border-radius: 50%;
        }
      }
      .user_name_time{
        padding-left: 30rpx;
        .user_name{
          color: #333;
        }
        .user_time{
          font-size: 24rpx;
        }
      }
    }
    .img_link_collect{
      border-bottom: 1px solid #eee;
      padding: 20rpx 0;
      display: flex;
      .img_like,
      .img_collect{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    //下载按钮
    .download{
      padding: 20rpx 10rpx;
      .download_btn{
        font-weight: 600;
        height: 80rpx;
        line-height: 80rpx;
        text-align: center;
        background-color: $color;
        color: #fff;
      }
    }
    // 专辑
    .img_album{
      padding: 20rpx;
      border: 5rpx solid #eee;
      .img_album_title{
        padding: 20rpx 0;
        color: #333;
      }
      .album_container{
        display: flex;
        .album_img{
          flex: 1;
          image{
            width: 180rpx;
            height: 180rpx;
          }
        }
        .album_info{
          position: relative;
          flex: 2;
          .album_mark{
            text-align: center;
            height: 40rpx;
            line-height: 40rpx;
            width: 80rpx;
            background-color: $color;
            color: #fff;
          }
          .album_name{
            color: #333;
            padding: 10rpx 0;
          }
          .iconfont{
            font-size: 40rpx;
            position: absolute;
            top: 50%;
            right: 10%;
            transform: translateY(-50%);
            color: #000;
          }
        }
      }
    }
    //最热评论
    .hot .iconhot1{
      font-size: 48rpx; 
      padding-bottom: 20rpx;
      color: red;
      margin-right: 20rpx;
    }
    //最新评论
    .new .iconpinglun{
      font-size: 48rpx; 
      padding-bottom: 20rpx;
      color: skyblue;
      margin-right: 20rpx;
    }
    //评论共同样式
    .comment{
      padding: 20rpx;
      .comment_item{
        padding-top: 15rpx;
        border-bottom: 5rpx solid #eee;
        display: flex;
        .comment_left{
          flex: 1;
          image{
            width: 80rpx;
            height: 80rpx;
          }
        }
        .comtent_right{
          position: relative;
          padding-left: 10rpx;
          flex: 7;
          .user_name,
          .comment_time{
            font-size: 24rpx;
            padding: 5rpx 0;
          }
          .comment_content{
            color: #000;
            font-size: 24rpx;
            padding: 10rpx 50rpx 10rpx 0;
          }
          .iconfont{
            position: absolute;
            bottom: 10%;
            right: 0;
          }
        }
      }
    }
  }

</style>