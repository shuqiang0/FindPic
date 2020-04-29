<template>
  <view class="video_play">
    <image class="video_cover" mode="aspectFill" :src="video.img"></image>
    <!-- 工具栏开始 -->
    <view class="video_tools">
      <view @click="handleMuted" :class="['iconfont', muted? 'iconjingyin' : 'iconshengyin']"></view>
      <view class="iconfont iconzhuanfa">
        <button open-type="share"></button>
      </view>
    </view>
    <!-- 工具栏结束 -->

    <!-- 视频开始 -->
    <view class="video_container">
      <video :muted="muted" object-fit="fill" :src="video.video"></video>
      <view class="video_download" @click="handleDownloadVideo">
        下载高清
      </view>
    </view>
    <!-- 视频结束 -->

  </view>
</template>

<script>
export default {
  data(){
    return {
      video:{},
      muted: false
    }
  },
  onLoad(){
    this.video = getApp().globalData.video
  },
  methods:{
    //点击开关声音
    handleMuted(){
      this.muted = !this.muted
    },
    //下载视频
    async handleDownloadVideo(){
      await uni.showLoading({title:"正在下载..."})
      //将视频下载到小程序内存中
      const res1 = await uni.downloadFile({ url:this.video.video });
      const { tempFilePath } = res1[1]
      //将视频从小程序内存中下载下来
      const res2 = await uni.saveVideoToPhotosAlbum({ filePath:tempFilePath })
      await uni.hideLoading()
      if (res2.length === 1) {
        await uni.showToast({title:'下载失败'})
      }else{
        await uni.showToast({title:'下载成功'})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .video_play{
    position: relative;
    height: 100vh;
    width: 100vw;
    .video_cover{
      height: 100vh;
      width: 100vw;
      position: absolute;
      z-index: -1;
      filter: blur(10px);
    }
    .video_tools{
      padding: 20rpx 0;
      display: flex;
      justify-content: flex-end;
      .iconfont{
        color: #fff;
        font-size: 40rpx;
        height: 80rpx;
        width: 80rpx;
        border-radius: 50%;
        background-color: rgba(0,0,0,0.2);
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 20rpx;
      }
      .iconzhuanfa {
        position: relative;
        button{
          position: absolute;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
      }
    }
    .video_container{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%);
      video{
        height: 600rpx;
        width: 360rpx;
      }
      .video_download{
        color: #fff;
        width: 360rpx;
        height: 80rpx;
        border: 2rpx solid #fff;
        background-color: rgba(0,0,0,0.5);
        border-radius: 80rpx;
        margin-top: 80rpx;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

  }
</style>