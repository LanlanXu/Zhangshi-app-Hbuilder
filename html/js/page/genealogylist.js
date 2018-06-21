scrollBottomInit();
var app = new Vue({
    el: '#app',
    data: {
        data: [],
        datalength: 1,
        page: 1,
        msg: '',
        msgDisplay: false,
        relationshipCon: ['全部', '公开', '有限', '私密', '个人'],
        tabIndex: 0,
        form: {
            province: '',
            city: '',
            hallName: '',
            name: '',
            memberName: ''
        },
        provList: [],
        cityList: [],
        disabledList: [3]
    },
    computed: {
    },
    methods: {
        clickeded: function (id, bool) {
            if (!bool) clicked(id)
        },
        shift: function (index) {
            this.tabIndex = index;
            this.page = 1;
            this.data = [];
            this.loadingStop();
            this.clearData();
            this.getDatas();
        },
        clearData: function () {
            this.form = {
                province: '',
                city: '',
                hallName: '',
                name: '',
                memberName: ''
            };
            this.cityList = [];
        },
        /* 查询列表 */
        search: function () {
            this.page = 1;
            this.data = [];
            this.getDatas();
        },
        getName: function (arr, id) {
            var temp = arr.filter(function (obj) {
                return obj.id === id;
            })
            return temp.length ? temp[0].name : '';
        },
        getDatas: function () {
            var _this = this,
                proName = this.getName(this.provList, this.form.province),
                cityName = this.getName(this.cityList, this.form.city);
            // 底部下拉加载出现
            if (this.page > 1) this.loadingShow();
            var para = {
                type: 2,
                hallName: this.form.hallName,
                name: this.form.name,
                rows: 15,
                page: this.page,
                memberName: this.form.memberName,
                province: proName,
                city: cityName
            };
            if (this.tabIndex) para.jurisdiction = this.tabIndex;
            var newPara = {};
            for (var item in para) {
                if (para[item] != '') newPara[item] = para[item];
            }
            $.xhrGet('book/m/listBook.shtml', newPara, function (data) {
                if (data.success) {
                    //下拉加载样式
                    handleLoad(_this, data.data);

                    // for (var index in data.data) {
                    //     data.data[index].publishTime = data.data[index].publishTime.slice(0, 10)
                    // }
                    for (var i = 0; i < data.data.rows.length; i++) {
                        if (_this.disabledList.indexOf(para.jurisdiction) != -1) data.data.rows[i].disabled = true;
                        _this.data.push(data.data.rows[i]);
                    }

                    _this.page++;
                    // 更新总数据长度
                    _this.datalength = _this.data.length;
                }
            })
        },
        changeProv: function (e) {
            if (e.target.value !== '') {
                this.provCity(e.target.value);
            } else {
                this.cityList = [];
                this.form.city = '';
            }
        },
        provCity: function (id) {
            var _this = this;
            $.xhrGet('book/getAreasInfo.shtml', {
                parentId: id
            }, function (data) {
                if (data.success) {
                    if (id === 0) {
                        _this.provList = data.data;
                    } else {
                        _this.cityList = data.data;
                    }
                }
            })
        }
    },
    mounted: function () {
    },
    created: function () {
        var _this = this;
        this.getDatas();
        this.provCity(0);
    }
})


