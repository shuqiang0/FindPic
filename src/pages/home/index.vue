<template>
  <view>
    <view class="home_tab">
      <view class="home_tab_title">
        <view class="title_inner">
          <uni-segmented-control
            :current="current"
            :values="items.map(value=>value.title)"
            @clickItem="onClickItem"
            style-type="text"
            active-color="#b43465"
          ></uni-segmented-control>
        </view>
        <view class="iconfont iconsearch"></view>
      </view>
      <view class="home_tab_content">
        <view v-if="current === 0">
          <HomeRecommend />
        </view>
        <view v-if="current === 1">
          <HomeCategory />
        </view>
        <view v-if="current === 2">
          <HomeNew />
        </view>
        <view v-if="current === 3">
          <HomeAlbum />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import HomeRecommend from "./home-recommend";
import HomeCategory from "./home-category";
import HomeNew from "./home-new";
import HomeAlbum from "./home-album";
import { uniSegmentedControl } from "@dcloudio/uni-ui";
export default {
  components: {
    HomeRecommend,
    HomeCategory,
    HomeNew,
    HomeAlbum,
    uniSegmentedControl
  },
  data() {
    return {
      items: [
        {
          title: "推荐"
        },
        {
          title: "分类"
        },
        {
          title: "最新"
        },
        {
          title: "专辑"
        }
      ],
      current: 0
    };
  },
  methods: {
    onClickItem(e) {
      if (this.current !== e.currentIndex) {
        this.current = e.currentIndex;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.home_tab {
  .home_tab_title {
    position: relative;
    .title_inner {
      width: 60%;
      margin: 0 auto;
    }
    .iconsearch {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      right: 5%;
    }
  }
  .home_tab_content {
  }
}
</style>
