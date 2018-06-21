var app = new Vue({
    el: '#app',
    data: function () {
        return {
            form: {
                loginName: '',
                nickName: '',
                birthday: '',
                image: ''
            },
            calendar: null,
            codeSrc: '',
            msg: '',
            msgDisplay: false,
            sexCon: ['保密', '男', '女'],
            tabIndex: 0,
            rule: {
                nickName: [
                    { required: true, message: '昵称不得为空' }
                ],
                birthday: [
                    { required: true, message: '出生年月不得为空' },
                    {
                        regExp: /^((((19|20)\d{2})-(0?[13-9]|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29))$/,
                        message: '请输入正确格式的年月日'
                    }
                ]
            }
        }
    },
    computed: {
    },
    methods: {
        clicked: function (id) {
            clicked(id)
        },
        showImg: function (event) {
            var _this = this;
            this.uploadImg(event, null, function (res) {
                _this.form.image = res.data
            }, null, 'user/uploadHeadImage.shtml')
        },
        sexInit: function (value) {
            switch (value) {
                case !value:
                    this.tabIndex = 0; break;
                case 'M':
                    this.tabIndex = 1; break;
                case 'F':
                    this.tabIndex = 2; break;
            }
        },
        initInfo: function (data) {
            this.form.image = data.image;
            this.form.loginName = data.loginName;
            this.form.nickName = data.nickName;
            // null表示未知，F表示女，M表示男
            this.sexInit(data.sex);
            this.form.birthday = data.birthday;
        },
        submit: function () {
            var _this = this;
            if (!this.validate()) return;
            // 修改信息
            $.xhrPost('user/setInfo.shtml', {
                nickName: this.form.nickName,
                sex: this.tabIndex ? (this.tabIndex == 1 ? 'M' : 'F') : null,// null表示未知，F表示女，M表示男
                birthday: this.form.birthday,
                address: ''
            }, function (data) {
                if (data.success) {
                    // 跳转
                    _this.errorMsg('修改成功');
                    setTimeout(function () {
                        if (window.plus) {
                            var page = plus.webview.getWebviewById('/infomodify.html');
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
        this.calendar = new LCalendar();
        var date = new Date();
        this.calendar.init({
            'trigger': '#calendar',//标签id
            'type': 'date',//date 调出日期选择 datetime 调出日期时间选择 time 调出时间选择 ym 调出年月选择
            'minDate': '1900-1-1',//最小日期 注意：该值会覆盖标签内定义的日期范围
            'maxDate': date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate()//最大日期 注意：该值会覆盖标签内定义的日期范围
        });
    },
    created: function () {
        var _this = this;
        $.xhrPost('user/info.shtml', {}, function (data) {
            if (data.success) {
                // 跳转
                _this.initInfo(data.data);
            } else {
                _this.errorMsg(data.message);
            }
        })
    }
})



