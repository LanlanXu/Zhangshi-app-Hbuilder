var app = new Vue({
    el: '#app',
    data: function(){
        var _this = this;
        var validateUserCheck = function (value) {
            var bool = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
            if(!bool) _this.errorMsg('请输入正确格式的邮箱');
            return bool;
        };
        return {
            form: {
                email: '',
                msgCode: '',
                code: ''
            },
            codeSrc: '',
            rule: {
                email: [
                    { required: true, message: '邮箱不得为空' },
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
            if(!this.validate(['email', 'imgcode'])) return;
            // 发送验证码
            $.xhrGet('captcha/code.shtml', {
                type: 'EMAIL',
                target : this.form.email,
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
            if(!this.validate(['email', 'code'])) return;
            // 修改邮箱
            $.xhrGet('user/bind/email.shtml', {
                account: this.form.email,
                msgCode: this.form.code
            }, function(data){
                _this.errorMsg(data.message);
                if(data.success){
                    // 跳转
                    setTimeout(function(){
                       if(window.plus){
                            var page = plus.webview.getWebviewById( '/modifyemail.html' );
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


