var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        detail: null,
        canModify: false
    },
    computed: {
        id: function () {
            return $.getUrlData().id
        }
    },
    methods: {
        errorMsg: function (msg) {
            this.msg = msg
            this.$refs['msg'].loadErrorMsg()
        },
        clicked: function (id) {
            clicked(id)
        },
        toHelplaunch: function () {
            if (!this.canModify) {
                this.errorMsg('无法修改');
                return;
            }
            localStorage.setItem('editHelp', true);
            localStorage.setItem('editHelpId', this.id);
            localStorage.setItem('helpType', '')
            clicked('/helplaunch.html');
        },
        toProjectvetifystep: function () {
            if (!this.canModify) {
                this.errorMsg('无法修改');
                return;
            }
            localStorage.setItem('editHelp', true);
            localStorage.setItem('editHelpId', this.id);
            localStorage.setItem('helpType', '');
            clicked('/projectvetifystep1.html');
        },
        deleteHelp: function () {
            if (!this.canModify) {
                this.errorMsg('无法删除');
                return;
            }
            if (!confirm('确定要删除此项目？')) {
                return;
            }
            var _this = this;
            $.xhrGet('help/delete/' + this.id + '.shtml', {}, function (data) {
                if (data.success) {
                    _this.errorMsg('删除成功！');
                    // 刷新项目详情页面
                    if (window.plus) {
                        var rescuelist = plus.webview.getWebviewById('childwebview/rescuelist.html');
                        rescuelist.loadURL('rescuelist.html');
                        // 跳转
                        setTimeout(function () {
                            if (window.plus) {
                                var page = plus.webview.getWebviewById(window.location.href.match(/\/[^\/]+$/)[0]);
                                page.close('auto');
                            }
                        }, 2000);
                    }
                }
            })
        }
    },
    mounted: function () {

    },
    created: function () {
        var _this = this;
        // 求助列表
        $.xhrPost('help/detail/' + this.id + '.shtml', {}, function (data) {
            if (data.success) {
                _this.detail = data.data
                // 项目编辑、认证和删除只能在certificationStatus;// 认证状态:1、已提交；2、认证中；这个两个状态进行修改
                switch (data.data.certificationStatus) {
                    case 1:
                        _this.canModify = true; break;
                    case 2:
                        _this.canModify = true; break;
                    default: ;
                }
            }
        })
    }
})



