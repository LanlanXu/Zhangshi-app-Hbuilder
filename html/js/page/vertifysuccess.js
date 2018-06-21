var app = new Vue({
    el: '#app',
    data: {
        btnMsg: '',
        disableBtn: false
    },
    computed: {
        id: function () {
            return localStorage.getItem('helpId')
        }
    },
    methods: {
        toNext: function () {
            var _this = this;
            if (this.disableBtn) return;
            if (localStorage.getItem('editHelp')) { // 修改时
                // 刷新项目详情页面
                if (window.plus) {
                    var rescuemng = plus.webview.getWebviewById('childwebview/rescuemng.html?id=' + this.id);
                    rescuemng.loadURL('childwebview/rescuemng.html?id=' + this.id);
                    // 跳转
                    _this.disableBtn = true;
                    setTimeout(function () {
                        if (window.plus) {
                            var page = plus.webview.getWebviewById('/projectvetifystep1.html');
                            page.close('none');
                            var page = plus.webview.getWebviewById('/vertifydata.html');
                            page.close('none');
                            var page = plus.webview.getWebviewById('/vertifysuccess.html');
                            page.close('auto');
                        }
                    }, 1000);
                }
            } else { // 新增时
                clicked('/index.html');
            }
        }
    },
    mounted: function () {

    },
    created: function () {
        if (localStorage.getItem('editHelp')) { // 修改时
            this.btnMsg = '返回项目管理';
        } else { // 新增时
            this.btnMsg = '回到首页';
        }
    }
})



