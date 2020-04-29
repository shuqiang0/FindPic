<template>
  <scroll-view class="recommend_view" @scrolltolower="handleToLower" scroll-y v-if="recommends.length>0">
    <!-- 推荐开始 -->
    <view class="recommend_wrap">
      <navigator 
        class="recommend_item" 
        v-for="item in recommends" 
        :key="item.id"
        :url="`/pages/album/index?id=${item.target}`"
      >
        <image mode="widthFix" :src="item.thumb"></image>
      </navigator>
    </view>
    <!-- 推荐结束 -->
    <!-- 月份推荐开始 -->
    <view class="month_wrap">
      <view class="month_title">
        <view class="month_left">
          <view class="month">
            <text class="month_number">{{month.DD}}</text>
            /{{month.MM}}月
          </view>
          <text class="month_text">
            {{month.title}}
          </text>
        </view>
        <view class="month_right">
          更多 >
        </view>
      </view>
      <view class="month_content">
        <view class="month_img" v-for="(value, index) in month.items" :key="value.id">
          <img-data :list="month.items" :index="index">
            <image mode="aspectFill" :src="value.thumb+value.rule.replace('$<Height>', 360)"></image>
          </img-data>
        </view>
      </view>
    </view>
    <!-- 月份推荐结束 -->

    <!-- 热门开始 -->
    <view class="hot_wrap">
      <view class="hot_title">
        <text class="hot_title_text">热门</text>
      </view>
      <view class="hot_content">
        <view class="hot_content_item" v-for="(item,index) in hot" :key="item.id">
          <img-data :list="hot" :index="index">
            <image mode="widthFix" :src="item.thumb"></image>
          </img-data>
        </view>
      </view>
    </view>
    <!-- 热门结束 -->
  </scroll-view>
</template>

<script>
import ImgData from "@/components/imgdata/index";
import moment from "moment";
export default {
  components:{
    ImgData
  },
  data(){
    return {
      //推荐列表
      recommends:[],
      //月份
      month:{},
      //热门
      hot:[],
      params:{
        //获取好多条
        limit:30,
        //关键字
        order:'hot',
        //跳过多少条
        skip:0
      },
      //数据是否为空
      isNull:false
    }
  },
  mounted(){
    this.getList()
  },
  methods:{
    //获取数据
    getList(){
      this.request({
        url:'http://157.122.54.189:9088/image/v3/homepage/vertical',
        data:this.params
      }).then(res => {
        if (res.res.vertical.length === 0) {
          uni.showToast({
            title:'没有更多数据了',
            icon:"none"
          })
          this.isNull = true
          return
        }
        //第一次请求数据才会处理推荐和月份模块
        if (this.recommends.length === 0) {
          // 推荐模块
          this.recommends = res.res.homepage[1].items
          // 月份模块
          this.month = res.res.homepage[2]
          this.month.MM = moment(this.month.stime).format('MM')
          this.month.DD = moment(this.month.stime).format('DD')
        }
        this.hot = [...this.hot,...res.res.vertical]
      })
    },
    //上滑触底加载
    handleToLower(){
      /**
       * 1修改请求数据的参数
       * 2进行数据请求
       * 3.数据叠加
       */
      if (this.isNull) {
        uni.showToast({
          title:'没有更多数据了',
          icon:'none'
        })
        return
      }
      this.params.skip += this.params.limit
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
  .recommend_view{
    height: calc(100vh - 36px);
  }
  .recommend_wrap{
    display: flex;
    flex-wrap: wrap;
    .recommend_item{
      width: 50%;
      border:5rpx solid #fff;
    }
  }

  .month_wrap{
    .month_title{
      display: flex;
      justify-content: space-between;
      padding: 20rpx;
      .month_left{
        font-weight: 600;
        display: flex;
        .month{
          color: $color;
          .month_number{
            font-size: 34rpx;
          }
        }
        .month_text{
          font-size: 34rpx;
          margin-left: 20rpx;
        }
      }
      .month_right{
        color: $color;
      }
    }
    .month_content{
      display: flex;
      flex-wrap: wrap;
      .month_img{
        width: 33.33%;
        border: 5rpx solid #fff;
      }
    }
  }

  .hot_wrap{
    .hot_title{
      padding: 20rpx;
      .hot_title_text{
        font-weight: 600;
        padding-left: 20rpx;
        border-left: 20rpx solid $color;
      }
    }
    .hot_content{
      display: flex;
      flex-wrap: wrap;
      .hot_content_item{
        width: 33.33%;
        border: 5rpx solid #fff;
      }
    }
  }
</style>