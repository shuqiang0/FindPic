<template>
  <view 
    class="slide" 
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <slot></slot>  
  </view>
</template>

<script>
export default {
  name: "TheSlide",
  data(){
    return {
      startClientX:0,
      startClientY:0,
      startTime:0
    }
  },
  methods:{
    handleTouchStart(e){
      this.startClientX = e.changedTouches[0].clientX
      this.startClientY = e.changedTouches[0].clientY
      this.startTime = Date.now()
    },
    handleTouchEnd(e){
      const endTime = Date.now()
      const endClientX = e.changedTouches[0].clientX
      const endClientY = e.changedTouches[0].clientY
      //用于记录左滑还是右滑
      let direction = ''
      //滑动时间判断是否是合理的滑动
      if (endTime - this.startTime < 2000) {
        //滑动距离判断是否合理
        if (Math.abs(endClientX - this.startClientX) > 10 &&  Math.abs(endClientY - this.startClientY) < 10) {
          //滑动前后相减判断左右滑
          direction = endClientX - this.startClientX > 0? 'right':'left'
        }else{
          return
        }
      }else {
        return
      }
      //告诉父组件滑动方向
      this.$emit('slideAction', {direction})
    }
  }
}
</script>

<style scoped>
  
</style>