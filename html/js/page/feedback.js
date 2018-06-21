var app = new Vue({
    el: '#app',
    data: function(){
        var _this = this;
        var validateCheck = function (value) {
            var bool = true;
            if(!_this.form.telephone && !_this.form.email) {
                _this.errorMsg('邮箱或手机号至少填一项');
                bool = false;
            } else if(_this.form.telephone && !/^[1][0-9]{10}$/.test(_this.form.telephone)) {
                _this.errorMsg('请输入正确格式的手机号');
                bool = false;
            } else if(_this.form.email && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(_this.form.email)){
                _this.errorMsg('请输入正确格式的邮箱');
                bool = false;
            }
            return bool;
        };
        return {
            form: {
                telephone: '',
                email: '',
                title: '',
                content: ''
            },
            codeSrc: '',
            msg: '',
            msgDisplay: false,
            rule: {
                title: [
                    { required: true, message: '标题不得为空' }
                ],
                telephone: [
                    { validator: validateCheck}
                ],
                content: [
                    { required: true, message: '意见不得为空' }
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
            // 提交
            $.xhrPost('feedback/commit.shtml', {
                title: this.form.title,
                content: this.form.content,
                telephone: this.form.telephone,
                email: this.form.email,
            }, function(data){
                _this.errorMsg(data.message);
                if(data.success){
                    // 跳转
                    setTimeout(function(){
                        if(window.plus) {
                            var page = plus.webview.getWebviewById( '/feedback.html' );
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



