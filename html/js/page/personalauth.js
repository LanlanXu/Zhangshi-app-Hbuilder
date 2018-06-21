var app = new Vue({
    el: '#app',
    data: function () {
        return {
            form: {
                realName: '',
                idNumber: '',
                idCardImage1: '',
                idCardImage2: ''
            },
            msg: '',
            msgDisplay: false,
            rule: {
                realName: [
                    { required: true, message: '真实姓名不得为空' }
                ],
                idNumber: [
                    { required: true, message: '身份证号不得为空' },
                    {
                        regExp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
                        message: '请输入正确格式的身份证号'
                    }
                ],
                idCardImage1: [
                    { required: true, message: '请上传身份证正面照' }
                ],
                idCardImage2: [
                    { required: true, message: '请上传身份证反面照' }
                ]
            },
            authType: 5, // 1：未认证 2：认证中 3：已认证 4：已拒绝
            disable: false,
            authStatus: ''
        }
    },
    computed: {
    },
    methods: {
        clicked: function (id) {
            clicked(id)
        },
        showImg: function (event, i) {
            var _this = this;
            this.uploadImg(event, null, function (res) {
                _this.form['idCardImage' + i] = res.data
            }, null)
        },
        initInfo: function (data) {
            this.form.realName = data.realName;
            this.form.idNumber = data.idNumber;
            this.form.idCardImage1 = data.idCardImage1;
            this.form.idCardImage2 = data.idCardImage2;
            this.authType = data.authenticationUserStatus;

            // 权限控制 1：未认证 2：认证中 3：已认证 4：已拒绝
            switch (this.authType) {
                case 1:
                    break;
                case 2:
                    this.disable = true;
                    this.authStatus = '个人认证中，暂时不能修改数据哦！';
                    break;
                case 3:
                    this.disable = true;
                    this.authStatus = '您已认证成功,不用重复认证哦！';
                    break;
                case 4:
                    this.authStatus = '您的认证被拒绝，可以修改信息，重新申请认证！';
                    break;
            }
        },
        submit: function () {
            var _this = this;
            if (this.disable) return;
            if (!this.validate()) return;
            // 修改信息
            $.xhrPost('user/authc/personage.shtml', {
                'realName': this.form.realName,
                'idNumber': this.form.idNumber,// 身份证号码
                'idCardImage1': this.form.idCardImage1,// 身份证照片
                'idCardImage2': this.form.idCardImage2// 身份证照片
            }, function (data) {
                if (data.success) {
                    _this.errorMsg('您的认证提交成功，请等待审核！');
                    // 跳转
                    setTimeout(function () {
                        if (window.plus) {
                            var page = plus.webview.getWebviewById('/personalauth.html');
                            page.close('auto');
                        }
                    }, 2000);
                } else {
                    _this.errorMsg(data.message);
                }
            })
        }
    },
    mounted: function () {
    },
    created: function () {
        var _this = this;
        $.xhrPost('user/get/personage.shtml', {}, function (data) {
            if (data.success) {
                // 跳转
                _this.initInfo(data.data);
            } else {
                _this.errorMsg(data.message);
            }
        })
    }
})



