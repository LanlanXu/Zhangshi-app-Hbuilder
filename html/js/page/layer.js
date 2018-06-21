var app = new Vue({
  el: '#app',
  data: {
  },
  methods: {
    closePhotos: function () {
      // 状态条设置为红色
      plus.navigator.setStatusBarBackground('#d10100');
      var page = plus.webview.currentWebview();
      page.close('auto');
    }
  }
})


if (window.plus) {
  plusReady();
} else {
  document.addEventListener("plusready", plusReady, false);
}
function plusReady () {
  // plus.navigator.setStatusBarBackground('#000');
}