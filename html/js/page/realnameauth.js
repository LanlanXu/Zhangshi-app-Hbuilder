var app = new Vue({
    el: '#app',
    data: function () {
        return {
            msg: '',
            tabIndex: 0,
            disableBtn: false,
            form: {
                relationship: 1,
                name: '',
                code: '',
                content: ''
            },
            rule: {
                name: [
                    { required: true, message: '证实人真实姓名不得为空' } //  validator: '',
                ],
                code: [
                    { required: true, message: '证实人身份证号不得为空' },
                    { regExp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确格式的证实人身份证号' }
                ],
                content: [
                    { required: true, message: '证实内容不得为空' }
                ]
            }
        }
    },
    computed: {
        id: function () {
            return $.getUrlData().id
        }
    },
    methods: {
        submit: function () {
            var _this = this;
            if (this.disableBtn) return;
            if (!this.validate()) return;
            // 提交信息
            $.xhrPost('help/verify/' + this.id + '.shtml', {
                helpId: this.id,
                relationship: this.form.relationship, // 证明者关系：1、亲人；2、朋友；3、邻居；4、同事；5、老师；6、同学；7、病友；8、志愿者；9、项目参与者
                name: this.form.name,
                code: this.form.code,
                content: this.form.content
            }, function (data) {
                _this.errorMsg(data.message);
                if (data.success) {
                    // 刷新项目详情页面
                    if (window.plus) {
                        var helpprodetail = plus.webview.getWebviewById('childwebview/helpprodetail.html?id=' + _this.id);
                        // alert(helpprodetail.id)
                        helpprodetail.loadURL('../childwebview/helpprodetail.html?id=' + _this.id);
                        var confirmationlist = plus.webview.getWebviewById('/confirmationlist.html?id=' + _this.id + '&disabled=false');
                        // alert(helpprodetail.id)
                        if (confirmationlist) confirmationlist.loadURL('/confirmationlist.html?id=' + _this.id + '&disabled=false');
                        // 跳转
                        _this.disableBtn = true;
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
    }
})



