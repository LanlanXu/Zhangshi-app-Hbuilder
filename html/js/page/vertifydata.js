var app = new Vue({
    el: '#app',
    data: function () {
        var _this = this;
        var validatePhonesCheck = function (value) {
            var num = 0;
            for (var i = 2; i < 7; i++) {
                num += _this.form['upImgSrc' + i] ? 1 : 0;
            }
            var bool = num >= 2;
            if (!bool) _this.errorMsg('医疗证明至少上传两张');
            return bool;
        };
        return {
            photoList: [],
            num: 0,
            msg: '',
            msgDisplay: false
        }
    },
    computed: {
        id: function () {
            return localStorage.getItem('editHelpId')
        }
    },
    methods: {
        errorMsg: function (msg) {
            this.msg = msg
            this.$refs['msg'].loadErrorMsg()
        },
        showImg: function (event) {
            var _this = this;
            if (this.num + event.target.files.length > 10) {
                this.errorMsg('上传图片不得多于10张');
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
        submit: function () {
            var _this = this;
            if (!this.photoList.length) {
                this.errorMsg('至少上传一张认证图片');
                return;
            };

            var data = JSON.parse(localStorage.getItem('projectData'));
            // 提交信息
            $.xhrPost('help/mobile/submit/filish.shtml', {
                id: localStorage.getItem('helpId'),
                helperName: data.helpSeekerName,
                helperCertificateType: data.idCardType, // 求助者证件类型1、身份证;2、出生证
                helperCertificateCode: data.idCardType == 1 ? data.helpSeekerIdcard : data.helpSeekerBirthNum,
                imageUrls: this.photoList,
                relationship: data.relationship,
                payeeName: data.payeeName,
                payeeCertificateCode: data.payeeIdcard,
                payeeTelephone: data.payeePhone,
                payeeBank: data.bank,
                payeeCardNo: data.banknumber
            }, function (data) {
                _this.errorMsg(data.message);
                if (data.success) {
                    clicked('/vertifysuccess.html');
                }
            })
        }
    },
    mounted: function () {
    },
    created: function () {
        var _this = this;
        if (localStorage.getItem('editHelp')) {
            // 求助详情
            $.xhrPost('help/detail/' + this.id + '.shtml', {}, function (data) {
                if (data.success) {
                    var datas = data.data;
                    _this.photoList = datas.imageUrls;
                }
            })
        }
    }
})



