var app = new Vue({
    el: '#app',
    data: function(){
        var _this = this;
        var validateUserCheck = function (value) {
            var bool = /^[1][0-9]{10}$|^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
            if(!bool) _this.errorMsg('请输入正确格式的邮箱或手机号');
            return bool;
        };
        var validatePwdCheck = function (value) {
            var bool = _this.form.pwd == value;
            if(!bool) _this.errorMsg('两次密码不一致');
            return bool;
        };
        return {
            form: {
                user: '',
                msgCode: '',
                code: '',
                pwd: '',
                pwdCheck: ''
            },
            codeSrc: '',
            rule: {
                user: [
                    { required: true, message: '邮箱或手机号不得为空' },
                    { validator: validateUserCheck}
                ],
                imgcode: [
                    { required: true, message: '图形验证码不得为空' }
                ],
                code: [
                    { required: true, message: '验证码不得为空' }
                ],
                pwd: [
                    { required: true, message: '密码不得为空' },
                    { regExp: /^[0-9a-zA-Z]{6,20}$/, message: '密码须为6位以上的数组和字母组成' }
                ],
                pwdCheck: [
                    { validator: validatePwdCheck}
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
            if(!this.validate(['user', 'imgcode'])) return;
            if(/^[1][0-9]{10}$/.test(this.form.user)){
                this.type = 'TELEPHONE';
            } else if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.form.user)){
                this.type = 'EMAIL';
            }
            // 发送验证码
            $.xhrGet('captcha/code.shtml', {
                type: this.type,
                target : this.form.user,
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
        findpwd: function(){
            var _this = this;
            if(!this.validate(['user', 'code', 'pwd', 'pwdCheck'])) return;
            if(/^[1][0-9]{10}$/.test(this.user)){
                this.type = 'TELEPHONE';
            } else if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.user)){
                this.type = 'EMAIL';
            }
            // 找回密码
            $.xhrGet('user/findPassword.shtml', {
                telephone: this.type == 'TELEPHONE' ? this.form.user : '',
                email: this.type != 'TELEPHONE' ? this.form.user : '',
                password: this.form.pwd,
                msgCode: this.form.code
            }, function(data){
                _this.errorMsg(data.message);
                if(data.success){
                    // 跳转
                    clicked('/login.html')
                } else {
                    _this.generateImgCode();
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


