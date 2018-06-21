var app = new Vue({
    el: '#app',
    data: {
        msg: '',
        msgDisplay: false,
        form: {
            content: '',
            addr: ''
        },
        agreed: false, // 不同意
        photoList: [],
        num: 0,
        rule: {
            content: [
                { required: true, message: '内容不得为空' }
            ]
        }
    },
    methods: {
        showImg: function (event) {
            var _this = this;
            if (this.num + event.target.files.length > 8) {
                this.errorMsg('上传图片不得多于9张');
                return;
            } else {
                this.num += event.target.files.length;
            }

            for (var i = 0; i < event.target.files.length; i++) {
                this.uploadImg(event, i, function (res) {
                    _this.photoList.push(res.data)
                }, function (res) {
                    _this.num--;
                });
            }
        },
        deletePhoto: function (index) {
            this.photoList.splice(index, 1);
            this.num--;
        },
        submit: function () {
            var _this = this;
            if (!this.validate()) return;
            $.xhrPost('dynamic/publish/common.shtml', {
                content: this.form.content,
                addr: this.agreed ? this.form.addr : '',
                attas: this.photoList
            }, function (data) {
                _this.errorMsg(data.message);
                if (data.success) {
                    // 刷新交流圈页面
                    if (window.plus) {
                        var comcircle = plus.webview.getWebviewById('childwebview/entercircle');
                        comcircle.loadURL('../childwebview/comcircle.html');
                        // 跳转
                        setTimeout(function () {
                            var page = plus.webview.getWebviewById('/edit.html');
                            page.close('auto');
                        }, 2000);
                    }
                }
            });
        }
    },
    mounted: function () {
    },
    created: function () {
    }
})

if (window.plus) {
    plusReady();
} else {
    document.addEventListener("plusready", plusReady, false);
}
function plusReady () {
    plus.geolocation.getCurrentPosition(function (position) {
        app.form.addr = position.address.province + '.' + position.address.city;
    }, function (e) {
        app.errorMsg(e.message);
    }, { geocode: true });
}



