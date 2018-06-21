var app = new Vue({
    el: '#app',
    data: function(){
        var _this = this;
        var validateUserCheck = function (value) {
            var bool = /^[1][0-9]{10}$/.test(value);
            if(!bool) _this.errorMsg('请输入正确格式的手机号');
            return bool;
        };
        return {
            form: {
                phone: '',
                msgCode: '',
                code: ''
            },
            codeSrc: '',
            rule: {
                phone: [
                    { required: true, message: '手机号不得为空' },
                    { validator: validateUserCheck}
                ],
                imgcode: [
                    { required: true, message: '图形验证码不得为空' }
                ],
                code: [
                    { required: true, message: '验证码不得为空' }
                ]
            },
            msg: '',
            msgDisplay: false,
            btnMsg: '获取验证码',
            timer: null,
            sec: 60
        }
    },
    computed: {
    },
    methods: {
        generateImgCode: function(){
            this.codeSrc = BASEURL + 'captcha/image.shtml?session=' + localStorage.getItem('session') + '&_=' + (new Date()).getTime()
        },
        sendCode: function(){
            var _this = this;
            if(this.timer) return;
            if(!this.validate(['phone', 'imgcode'])) return;
            // 发送验证码
            $.xhrGet('captcha/code.shtml', {
                type: 'TELEPHONE',
                target : this.form.phone,
                imageCode: this.form.imgcode //企业类型，可选
            }, function(data){
                _this.generateImgCode();
                if(data.success){
                    _this.timer = setInterval(function(){
                        if(!_this.sec) {
                            _this.btnMsg = '获取验证码';
                            clearInterval(_this.timer);
                            _this.timer = null;
                            _this.sec = 60;
                        } else {
                            _this.btnMsg = _this.sec + '秒';
                            _this.sec --;
                        }
                    }, 1000);
                }
                _this.errorMsg(data.message);
            })
        },
        submit: function(){
            var _this = this;
            if(!this.validate(['phone', 'code'])) return;
            // 修改邮箱
            $.xhrGet('user/bind/telephone.shtml', {
                account: this.form.phone,
                msgCode: this.form.code
            }, function(data){
                _this.errorMsg(data.message);
                if(data.success){
                    // 跳转
                    setTimeout(function(){
                       if(window.plus){
                            var page = plus.webview.getWebviewById( '/modifyphone.html' );
                            page.close('auto');
                       }
                    }, 2000);
                }
            })
        }
    },
    mounted: function(){
        this.generateImgCode()
    },
    created: function(){
    }
  })


