var app = new Vue({
    el: '#app',
    data: function () {
        var _this = this;
        var validateHelpSeekerIdcard = function () {
            var bool = true;
            if (_this.form.idCardType == 1 && !_this.form.helpSeekerIdcard) {
                _this.errorMsg('求助者身份证号不得为空')
                bool = false;
            } else if (_this.form.idCardType == 1 && !/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(_this.form.helpSeekerIdcard)) {
                _this.errorMsg('请输入正确格式的求助者身份证号')
                bool = false;
            }
            return bool
        };
        var validateHelpSeekerBirthNum = function () {
            var bool = true;
            if (_this.form.idCardType == 2 && !_this.form.helpSeekerBirthNum) {
                _this.errorMsg('出生证编号不得为空');
                bool = false;
            }
            return bool;
        };
        var validatePhoneCheck = function (value) {
            var bool = /^[1][0-9]{10}$/.test(value);
            if (!bool) {
                _this.errorMsg('请输入正确格式的电话号码')
            }
            return bool
        };
        return {
            msg: '',
            msgDisplay: false,
            form: {
                idCardType: 1,
                helpSeekerName: '',
                helpSeekerIdcard: '',
                helpSeekerBirthNum: '',
                payeeName: '',
                payeeIdcard: '',
                payeePhone: '',
                bank: '',
                banknumber: '',
                relationship: 1
            },
            tab: ['本人', '直系亲属', '夫妻'],
            rule: {
                helpSeekerName: [
                    { required: true, message: '求助者真实姓名不得为空' }
                ],
                helpSeekerIdcard: [
                    { validator: validateHelpSeekerIdcard }
                ],
                helpSeekerBirthNum: [
                    { validator: validateHelpSeekerBirthNum }
                ],
                payeeName: [
                    { required: true, message: '收款人真实姓名不得为空' }
                ],
                payeeIdcard: [
                    { required: true, message: '收款人身份证号不得为空' },
                    { regExp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确格式的收款人身份证号' }
                ],
                payeePhone: [
                    { required: true, message: '电话号码不得为空' },
                    { validator: validatePhoneCheck }
                ]
            }
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
        submit: function () {
            if (this.validate()) {
                localStorage.setItem('projectData', JSON.stringify(this.form));
                clicked('/vertifydata.html');
            }

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
                    _this.form.idCardType = datas.helperCertificateType;
                    _this.form.helpSeekerName = datas.helperName;
                    _this.form.helpSeekerIdcard = datas.helperCertificateType == 1 ? datas.helperCertificateCode : '';
                    _this.form.helpSeekerBirthNum = datas.helperCertificateType == 2 ? datas.helperCertificateCode : '';
                    _this.form.payeeName = datas.payeeName;
                    _this.form.payeeIdcard = datas.payeeCertificateCode;
                    _this.form.payeePhone = datas.payeeTelephone;
                    _this.form.bank = datas.payeeBank;
                    _this.form.banknumber = datas.payeeCardNo;
                    _this.form.relationship = datas.relationship;
                }
            })
        }
    }
})



