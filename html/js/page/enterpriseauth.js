
var app = new Vue({
    el: '#app',
    data: function(){
        return {
            form: {
                companyName: '',
                businessLicenseCode: '',
                businessLicenseImage: '',
                authorizationStatementImage: ''
            }, 
            msg: '',
            msgDisplay: false,
            rule: {
                companyName: [
                    { required: true, message: '企业名称不得为空' }
                ],
                businessLicenseCode: [
                    { required: true, message: '营业执照编号不得为空' },
                    // { 
                    //     regExp: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, 
                    //     message: '请输入正确格式的身份证号' 
                    // }
                ],
                businessLicenseImage: [
                    { required: true, message: '请上传营业执照照片' }
                ],
                authorizationStatementImage: [
                    { required: true, message: '请上传授权说明书' }
                ]
            },
            authType: 5, // 1：未认证 2：认证中 3：已认证 4：已拒绝
            disable: false,
            authStatus: ''
        }
    },
    computed: {
    },
    methods: {
        clicked: function(id){
            clicked(id)
        },
        showImg: function(event, i){
            var _this = this;
            this.uploadImg(event, null, function(res){
                _this.form[i] = res.data
            }, null)
        },
        initInfo: function(data){
            this.form.companyName = data.companyName;
            this.form.businessLicenseCode = data.businessLicenseCode;
            this.form.businessLicenseImage = data.businessLicenseImage;
            this.form.authorizationStatementImage = data.authorizationStatementImage;
            this.authType = data.authenticationCompanyStatus;

            // 权限控制 1：未认证 2：认证中 3：已认证 4：已拒绝
            switch(this.authType) {
                case 1:
                    break;
                case 2:
                    this.disable = true;
                    this.authStatus = '企业认证中，暂时不能修改数据哦！';
                    break;
                case 3:
                    this.disable = true;
                    this.authStatus = '您已认证成功,不用重复认证哦！';
                    break;
                case 4:
                    this.authStatus = '您的认证被拒绝，可以修改信息，重新申请认证！';
                    break;
            }
        },
        submit: function(){
            var _this = this;
            if(this.disable) return;
            if(!this.validate()) return;
            // 修改信息
            $.xhrPost('user/authc/company.shtml', {
                'companyName': this.form.companyName,
                'businessLicenseCode': this.form.businessLicenseCode,// 身份证号码
                'businessLicenseImage': this.form.businessLicenseImage,// 身份证照片
                'authorizationStatementImage': this.form.authorizationStatementImage// 身份证照片
            }, function(data){
                if(data.success){
                    _this.errorMsg('您的认证提交成功，请等待审核！');
                    // 跳转
                    setTimeout(function(){
                        if(window.plus) {
                            var page = plus.webview.getWebviewById( '/enterpriseauth.html' );
                            page.close('auto');
                        }
                    }, 2000);
                } else {
                    _this.errorMsg(data.message);
                }
            })
        }
    },
    mounted: function(){
    },
    created: function(){
        var _this = this;
        $.xhrPost('user/get/company.shtml', {}, function(data){
            if(data.success){
                // 跳转
                _this.initInfo(data.data);
            } else {
                _this.errorMsg(data.message);
            }
        })
    }
})



