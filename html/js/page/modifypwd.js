var app = new Vue({
    el: '#app',
    data: function(){
        var _this = this;
        var validatePwdCheck = function (value) {
            var bool = _this.form.pwd == value;
            if(!bool) _this.errorMsg('两次密码不一致');
            return bool;
        };
        return {
            form: {
                oldpwd: '',
                pwd: '',
                pwdCheck: ''
            },
            codeSrc: '',
            msg: '',
            msgDisplay: false,
            rule: {
                oldpwd: [
                    { required: true, message: '旧密码不得为空' }
                ],
                pwd: [
                    { required: true, message: '新密码不得为空' },
                    { regExp: /^[0-9a-zA-Z]{6,20}$/, message: '密码须为6位以上的数组和字母组成' }
                ],
                pwdCheck: [
                    { validator: validatePwdCheck}
                ]
            }
        }
    },
    computed: {
    },
    methods: {
        clicked: function(id){
            clicked(id)
        },
        submit: function(){
            var _this = this;
            if(!this.validate()) return;
            // 修改密码
            $.xhrPost('user/changePassword.shtml', {
                oldPassword: this.form.oldpwd,
                newPassword: this.form.pwd
            }, function(data){
                _this.errorMsg(data.message);
                if(data.success){
                    // 跳转
                    setTimeout(function(){
                        if(window.plus){
                            var page = plus.webview.getWebviewById( '/modifypwd.html' );
                            page.close('auto');
                       }
                    }, 2000);
                }
            })
        }
    },
    mounted: function(){
        
    },
    created: function(){
    }
  })



