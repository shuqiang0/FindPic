export default (params) => {
  uni.showLoading({
    title: "正在加载中...",
  });
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      success(res) {
        resolve(res.data);
      },
      fail(err) {
        reject(err);
      },
      complete() {
        uni.hideLoading();
      },
    });
  });
};
