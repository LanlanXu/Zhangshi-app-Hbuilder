var app = new Vue({
    el: '#app',
    data: function () {
        var _this = this;
        var validateCheck = function (value) {
            var bool = true;
            if (_this.form.telephone && !/^[1][0-9]{10}$/.test(_this.form.telephone)) {
                _this.errorMsg('请输入正确格式的手机号');
                bool = false;
            }
            return bool;
        };
        return {
            form: {
                nickName1: '',
                nickName2: '',
                rank: '',
                Level: '',
                fathername: '',
                birthday: '',
                telephone: '',
                idcard: '',
                education: '',
                address: '',
                description: ''
            },
            calendar: null,
            codeSrc: '',
            msg: '',
            msgDisplay: false,
            relationshipCon: ['兄弟姐妹', '配偶', '儿子', '女儿'],
            tabIndex: 0,
            sexCon: ['男', '女'],
            tabIndexOfSex: 0,
            liveCon: ['健在', '已故'],
            tabIndexOfLive: 0,
            rule: {
                nickName1: [
                    { required: true, message: '姓不得为空' },
                    {
                        regExp: /^[\u4e00-\u9fa5]{1,2}$/,
                        message: '请输入正确的姓'
                    }
                ],
                nickName2: [
                    { required: true, message: '名不得为空' },
                    {
                        regExp: /^[\u4e00-\u9fa5]{1,3}$/,
                        message: '请输入正确的名'
                    }
                ],
                rank: [
                    { required: true, message: '排行不得为空' }
                ],
                Level: [
                    { required: true, message: '世代数不得为空' }
                ],
                fathername: [
                    { required: true, message: '父亲名字不得为空' },
                    {
                        regExp: /^[\u4e00-\u9fa5]{1,4}$/,
                        message: '请输入正确的父亲名字'
                    }
                ],
                idcard: [
                    { required: true, message: '身份证不得为空' },
                    {
                        regExp: /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/,
                        message: '请输入正确格式的身份证号'
                    }
                ],
                telephone: [
                    { validator: validateCheck }
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
        id: function () {
            return Number($.getUrlData().bookid)
        }
    },
    methods: {
        clicked: function (id) {
            clicked(id)
        },
        submit: function () {
            var _this = this;
            if (!this.validate(['nickName1', 'nickName2', 'rank', 'Level', 'fathername', 'telephone', 'idcard'])) return;
            this.getParentId();

        },
        getParentId: function () {
            var _this = this;
            $.xhrPost('book/getMembersInfoByNames.shtml', {
                bookid: this.id,
                memberName: this.form.fathername
            }, function (data) {
                if (data.success) {
                    if (data.data.id) {
                        _this.form.parentId = data.data.id;
                        _this.submitData();
                    } else {
                        _this.errorMsg('该父亲名字不在此族谱中');
                    }
                } else {
                    _this.errorMsg(data.message);
                }
            })
        },
        submitData: function () {
            var _this = this;
            // 修改信息
            $.xhrPost('book/addOrUpdateMemberInfo.shtml', {
                name: this.form.nickName1 + this.form.nickName2,
                birthday: this.form.birthday,
                address: '',
                Level: this.form.Level,
                bookId: this.id,
                fathername: this.form.fathername,
                gender: !this.tabIndexOfSex ? '男' : '女',
                islive: !this.tabIndexOfLive,
                rank: this.form.rank,
                birthday: this.form.birthday,
                address: this.form.address,
                description: this.form.description,
                idcard: this.form.idcard,
                education: this.form.education,
                telephone: this.form.telephone,
                parentId: this.form.parentId
            }, function (data) {
                if (data.success) {
                    // 跳转
                    _this.errorMsg('添加成功');
                    setTimeout(function () {
                        if (window.plus) {
                            var page = plus.webview.getWebviewById(window.location.href.match(/\/[^\/]+$/)[0]);
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
            'maxDate': date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()//最大日期 注意：该值会覆盖标签内定义的日期范围
        });
    },
    created: function () {
        var _this = this;
    }
})



