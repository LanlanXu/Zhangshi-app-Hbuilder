var app = new Vue({
    el: '#app',
    data: function () {
        return {
            page: 1,
            timerBool: false,
            timer: null,
            optShow: false,
            msg: '',
            msgDisplay: false,
            thumbShow: false,
            thumblist: [],
            data: [],
            btnBool: false
        }
    },
    computed: {
        id: function () {
            return Number($.getUrlData().bookid)
        },
        title: function () {
            return $.getUrlData().title
        },
        search: function () {
            return $.getUrlData().search
        }
    },
    methods: {
        a: function () { },
        toPage: function (value) {
            var pageCount = $(".flipbook").turn("pages");//总页数
            var currentPage = $(".flipbook").turn("page");//当前页
            if (isNaN(value)) {
                switch (value) {
                    case 'first':
                        $(".flipbook").turn('page', 1);
                        this.$refs['audio'].play();
                        this.errorMsg('已经是第一页了');
                        break;
                    case 'last':
                        $(".flipbook").turn('page', pageCount);
                        this.$refs['audio'].play();
                        this.errorMsg('已经是最后一页了');
                        break;
                    case 'pre':
                        if (currentPage >= 2) {
                            $(".flipbook").turn('page', currentPage - 1);
                            this.$refs['audio'].play();
                        } else {
                            this.errorMsg('已经是第一页了');
                        }
                        break;
                    case 'next':
                        if (currentPage < pageCount) {
                            $(".flipbook").turn('page', currentPage + 1);
                            this.$refs['audio'].play();
                        } else {
                            this.errorMsg('已经是最后一页了');
                            this.timerBool = false;
                            clearInterval(this.timer);
                        }
                        break;
                    default:
                        if (this.page < pageCount && this.page > 0) {
                            $(".flipbook").turn('page', this.page);
                            this.$refs['audio'].play();
                        }
                }
            } else {
                this.$refs['audio'].play();
                $(".flipbook").turn('page', value);
                this.page = value;
                this.thumbShow = false;
            }
        },
        setTimer: function () {
            var _this = this;
            if (this.timerBool) {
                this.timerBool = false;
                clearInterval(this.timer);
            } else {
                this.timerBool = true;
                this.errorMsg('以8秒每页自动播放');
                this.timer = setInterval(function () {
                    _this.toPage('next');
                }, 8000);
            }
        },
        loading: function () {
            //配置turn.js
            function loadApp () {
                var w = $('.flipbook-viewport').width();
                var h = $('.flipbook-viewport').height();
                $('.flipboox').width(w).height(h);
                $('.flipbook').turn({
                    // Width
                    width: w,
                    // Height
                    height: h,
                    // Elevation
                    elevation: 50,
                    display: 'single',
                    // Enable gradients
                    gradients: true,
                    // Auto center this flipbook
                    autoCenter: true,
                    page: $.getUrlData().index ? Number($.getUrlData().index) : 1,
                    when: {
                        turning: function (e, page, view) {
                        },
                        turned: function (e, page, view) {
                            if (app) app.page = page;
                        }
                    }
                })
            }

            yepnope({
                test: Modernizr.csstransforms,
                yep: ['js/public/turn.js'],
                both: ['js/public/zoom.min.js'],
                complete: loadApp
            });
        },
        handleData: function (data) {
            var indexArr = [],
                pageArr = [],
                erweiArr = [],
                num = 0;
            for (var i = 0; i < data.length; i++) {
                if (!(i % 3)) {//!(i % 4)
                    pageArr.push({
                        indexArr: [data[i].level],
                        erweiArr: [{
                            level: data[i].level,
                            arr: [data[i]]
                        }]
                    });
                } else {
                    if (pageArr[pageArr.length - 1].indexArr.indexOf(data[i].level) === -1) {
                        pageArr[pageArr.length - 1].indexArr.push(data[i].level);
                        pageArr[pageArr.length - 1].erweiArr.push({
                            level: data[i].level,
                            arr: [data[i]]
                        });
                    } else {
                        pageArr[pageArr.length - 1].erweiArr[pageArr[pageArr.length - 1].erweiArr.length - 1].arr.push(data[i]);
                    }
                }


            }
            this.data = pageArr;
        }
    },
    mounted: function () {
    },
    created: function () {
        var _this = this;
        if (!this.search) { // 非搜索页面的跳转
            $.xhrGet('book/familyData.shtml', {
                id: this.id
            }, function (data) {
                if (data.success) {
                    _this.handleData(data.data.data);
                    if (data.data.data.length) _this.btnBool = true;
                    //预加载
                    _this.loading();
                    $('.shade').hide();
                }
            })
        } else {
            $.xhrGet('book/listMember.shtml', JSON.parse(localStorage.getItem('searchPara')),
                function (data) {
                    if (data.success) {
                        _this.handleData(data.data);
                        if (data.data.length) _this.btnBool = true;
                        //预加载
                        _this.loading();
                        $('.shade').hide();
                    }
                })
        }


    }
})


