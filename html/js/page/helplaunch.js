var app = new Vue({
    el: '#app',
    data: {
        typeShow: true, // 分会分类
        msg: '',
        msgDisplay: false,
        orgList: [], // 分会列表
        form: {
            money: '', // 筹款金额
            helpType: '1',
            orgType: '',
            title: '',
            cont: ''
        },
        file: '',
        type: 'number',
        agreed: true, // 不同意
        photoList: [],
        protoBool: false,
        protoBoolTwo: false,
        num: 0,
        rule: {
            money: [
                { required: true, message: '金额不得为空' }
            ],
            title: [
                { required: true, message: '筹款标题不得为空' }
            ],
            cont: [
                { required: true, message: '求助内容不得为空' },
                { regExp: /^.{10,}$/, message: '求助内容不得低于10字' }
            ]
        }
    },
    computed: {
        id: function () {
            return localStorage.getItem('editHelpId')
        }
    },
    methods: {
        closePhotos: function () {
            this.protoBool = false;
            this.protoBoolTwo = false;
        },
        errorMsg: function (msg) {
            this.msg = msg
            this.$refs['msg'].loadErrorMsg()
        },
        submit: function () {
            var _this = this;
            if (!$.checklogin()) return;
            if (!this.validate()) return;
            if (!this.photoList.length) {
                this.errorMsg('至少上传一张项目图片');
                return;
            }
            var para = {
                type: this.form.helpType, // 求助类型: 1、大病救助；2、贫困助学；3、扶贫济困
                title: this.form.title,
                content: this.form.cont,
                targetAmount: this.form.money,
                projectImageUrls: this.photoList,
                orgId: this.form.orgType
            };
            if (localStorage.getItem('editHelp')) {
                para.helpId = this.id;
            }
            // 提交互助信息
            $.xhrPost('help/mobile/submit/' + this.form.helpType + '.shtml', para, function (data) {
                _this.errorMsg(data.message);
                if (data.success) {
                    localStorage.setItem('helpId', data.data);
                    // 跳转
                    setTimeout(function () {
                        clicked('/success.html');
                    }, 2000);
                }
            })

        },
        updateValue: function (value) {
            var formattedValue = value.replace(/[^0-9\.]/g, '')
            formattedValue = formattedValue.replace(/\.+/, '')
            // formattedValue = formattedValue.replace(/(\.\d+)\./, '$1')
            formattedValue = formattedValue
                // 删除两侧的空格符
                .trim()
                // 保留 2 位小数
                .slice(
                0,
                formattedValue.indexOf('.') === -1
                    ? formattedValue.length
                    : formattedValue.indexOf('.') + 3
                )
            // 如果值尚不合规，则手动覆盖为合规的值
            if (formattedValue !== value) {
                this.form.money = formattedValue
            }

        },
        showImg: function (event) {
            var _this = this;
            if (this.num + event.target.files.length > 8) {
                this.errorMsg('上传图片不得多于8张');
                return;
            } else {
                this.num += event.target.files.length;
            }

            for (var i = 0; i < event.target.files.length; i++) {
                this.uploadImg(event, i, function (res) {
                    _this.photoList.push(res.data)
                }, function (res) {
                    _this.num--;
                })
            }
        },
        deletePhoto: function (index) {
            this.photoList.splice(index, 1);
            this.num--;
        },
        openlayer: function (str) {
            this[str] = true;
            return;
            var embed = plus.webview.create('/layer.html', 'layer', {
                top: '0px',
                bottom: '0px',
                position: 'dock',
                dock: 'top',
                bounce: 'none',
                background: 'transparent',
                opacity: 0
            });
            embed.show();
            embed.addEventListener('loaded', function () {
                plus.nativeUI.closeWaiting();

            }, false);
            // embed.addEventListener('loading', function () {
            //     plus.nativeUI.showWaiting('', { style: 'black', modal: false, background: 'rgba(0,0,0,0)' });
            // }, false);
        }
    },
    mounted: function () {
        // document.getElementById('layer').addEventListener('touchstart', function (e) {
        //     e.preventDefault()
        //     e.stopPropagation();
        // }, false);
        // document.getElementById('layer').addEventListener('touchmove', function (e) {
        //     // e.preventDefault()
        //     // e.stopPropagation();
        // }, false);
    },
    created: function () {
        var _this = this;
        // 获取分会
        $.xhrGet('org/query.shtml', {}, function (data) {
            _this.orgList = data.data.childOrgs
            _this.form.orgType = _this.orgList[0].id

            if (localStorage.getItem('editHelp')) {
                // 求助详情
                $.xhrPost('help/detail/' + _this.id + '.shtml', {}, function (data) {
                    if (data.success) {
                        var datas = data.data;
                        _this.form.money = datas.targetAmount;
                        _this.form.orgType = datas.orgId;
                        _this.form.helpType = datas.type;
                        _this.form.title = datas.title;
                        _this.form.cont = datas.content;
                        _this.photoList = datas.projectImageUrls;
                    }
                })
            }
        });


        // 默认进来类型是否已经设置
        if (localStorage.getItem('helpType')) {
            this.form.helpType = localStorage.getItem('helpType');
            this.typeShow = false
        } else {
            this.typeShow = true
        }


    }
})



