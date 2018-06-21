var app = new Vue({
    el: '#app',
    data: function () {
        return {
            form: {
                key: '',
                Level: '',
                Middlename: ''
            },
            msg: '',
            msgDisplay: false,
            thumbShow: false,
            thumblist: [],
            detail: null,
            heightAuto: false,
            disabled: false
        }
    },
    computed: {
        id: function () {
            return Number($.getUrlData().id)
        },
        title: function () {
            return $.getUrlData().title
        },
        time: function () {
            return $.getUrlData().time
        }
    },
    methods: {
        clicked: function (id) {
            clicked(id)
        },
        search: function () {
            if (this.disabled) return;
            var _this = this;
            if (!this.form.key && !this.form.Level && !this.form.Middlename) {
                this.errorMsg('搜索内容不得都为空');
                return;
            }
            var para = {
                bookid: this.id,
                key: this.form.key,
                level: this.form.Level,
                middlename: this.form.Middlename,
                page: 1,
                rows: 10000,
                type: 2
            };
            this.disabled = true;
            var newPara = {};
            for (var item in para) {
                if (para[item] != '') newPara[item] = para[item];
            }
            $.xhrGet('book/listMember.shtml', newPara, function (data) {
                if (data.success) {
                    if (data.data.length) {
                        localStorage.setItem('searchPara', JSON.stringify(newPara));
                        _this.clicked('/genealogyformat.html?bookid=' + _this.id + '&title=' + _this.title + '&search=true')
                    } else {
                        _this.errorMsg('无相关内容');
                    }
                }
                _this.disabled = false;
            })
            // if (!this.form.keywords) {
            //     this.errorMsg('关键字不得为空');
            //     return;
            // }
            // if (this.id == 0) {
            //     switch (this.form.keywords) {
            //         case '张安元':
            //             this.clicked('/genealogybook.html?bookid=' + this.id + '&index=93'); break;
            //         case '张茂胜':
            //             this.clicked('/genealogybook.html?bookid=' + this.id + '&index=123'); break;
            //         default:
            //             this.errorMsg('无相关内容');
            //     }
            // } else {
            //     switch (this.form.keywords) {
            //         case '张茂胜':
            //             this.clicked('/genealogybook.html?bookid=' + this.id + '&index=6'); break;
            //         default:
            //             this.errorMsg('无相关内容');
            //     }
            // }
        }
    },
    mounted: function () {

    },
    created: function () {
        // this.detail = bookdata[0]
        var _this = this;
        // familyData.shtml ? id = 14
        $.xhrGet('book/getBookInfoById.shtml', {
            id: this.id
        }, function (data) {
            if (data.success) {
                _this.detail = data.data
            }
        })
    }
})


