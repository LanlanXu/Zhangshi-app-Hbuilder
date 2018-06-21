var app = new Vue({
    el: '#app',
    data: {
    },
    computed: {
    },
    methods: {
        logout: function () {
            // 退出登录
            $.xhrPost('user/logout.shtml', {}, function (data) {
                if (data.success) {
                    // 跳转
                    clicked('/login.html?toLogin=true')
                }
            })
            //
        },
        clearSession: function () {
            plus.nativeUI.showWaiting('清理中...', { style: 'white', modal: true, background: 'rgba(0,0,0,0.5)' });
            setTimeout(function () {
                plus.nativeUI.closeWaiting();
                plus.nativeUI.toast("缓存已清除！");
            }, 3000);
        }
    }
})