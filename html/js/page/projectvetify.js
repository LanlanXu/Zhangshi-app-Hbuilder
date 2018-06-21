var app = new Vue({
    el: '#app',
    data: function () {
        var _this = this;
        var validatePhoneCheck = function (value) {
            var bool = /^[1][0-9]{10}$/.test(value);
            if (!bool) {
                _this.errorMsg('请输入正确格式的电话号码')
            }
            return bool
        };
        return {
            msg: '',
            tabIndex: 0,
            tab: ['本人', '直系亲属', '夫妻'],
            form: {
                name: '',
                idcard: '',
                phone: '',
                bank: '',
                banknumber: ''
            },
            rule: {
                name: [
                    { required: true, message: '收款人真实姓名不得为空' } //  validator: '',
                ],
                idcard: [
                    { required: true, message: '收款人身份证号不得为空' },
                    { regExp: /^[1][0-9]{10}$/, message: '请输入正确格式的收款人身份证号' }
                ],
                phone: [
                    { required: true, message: '电话号码不得为空' },
                    { validator: validatePhoneCheck }
                ]
            }
        }
    },
    methods: {
        showImg: function (event, i) {
            var _this = this;
            var formData = new FormData();
            formData.append('file', event.target.files[0]);
            $.ajax({
                url: BASEURL + 'atta/upload.shtml',
                type: 'POST',
                cache: false,
                data: formData,
                processData: false,
                contentType: false
            }).done(function (res) {
                _this['upImgSrc' + i] = res.data
            }).fail(function (res) {
                _this['upImgSrc' + i] = null
            });
        },
        submit: function () {
        }
    },
    mounted: function () {
    },
    created: function () {
    }
})



