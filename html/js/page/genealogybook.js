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
            btnBool: false,
            pos: {
                x: 0, y: 0
            },
            zoomBool: false
        }
    },
    computed: {
        id: function () {
            return Number($.getUrlData().bookid)
        },
        title: function () {
            return $.getUrlData().title
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
                        this.page = 1;
                        break;
                    case 'last':
                        $(".flipbook").turn('page', pageCount);
                        this.$refs['audio'].play();
                        this.errorMsg('已经是最后一页了');
                        this.page = pageCount;
                        break;
                    case 'pre':
                        if (currentPage >= 2) {
                            $(".flipbook").turn('page', currentPage - 1);
                            this.$refs['audio'].play();
                            this.page = currentPage - 1;
                        } else {
                            this.errorMsg('已经是第一页了');
                        }
                        break;
                    case 'next':
                        if (currentPage < pageCount) {
                            $(".flipbook").turn('page', currentPage + 1);
                            this.$refs['audio'].play();
                            this.page = currentPage + 1;
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
        controlthumb: function () {
            if (!this.thumbShow) {
                $('.flipbook-viewport').zoom('zoomOut');
                this.zoomBool = false;
            }
            this.thumbShow = !this.thumbShow
        },
        zoomContol: function (e) {
            this.optShow = false;
            var pos = {
                x: 0,
                y: 0
            };
            if (this.zoomBool) {
                $('.flipbook-viewport').zoom('zoomOut');
            } else {
                $('.flipbook-viewport').zoom('zoomIn', pos);
            }
            this.zoomBool = !this.zoomBool;
        }


    },
    mounted: function () {
        var _this = this;
        document.getElementById('thumb').addEventListener('touchstart', function (e) {
            e.stopPropagation();
        }, false);
        document.getElementById('thumb').addEventListener('touchmove', function (e) {
            e.stopPropagation();
        }, false);
        document.getElementById('layer').addEventListener('touchstart', function (e) {
            _this.pos = {
                x: e.touches[0].pageX,
                y: e.touches[0].pageY
            };
            e.stopPropagation();
        }, false);

        document.getElementById('layer').addEventListener('touchmove', function (e) {
            var dis = {
                x: e.touches[0].pageX - _this.pos.x,
                y: e.touches[0].pageY - _this.pos.y
            };

            if (_this.zoomBool) {
                var w = $('.flipbook').width(),
                    h = $('.flipbook').height();
                var arr = $('.flipbook').css('transform').match(/\(([^\(\)]*)\)/)[1].split(/,\s/);
                var now = {
                    x: Number(arr[4]) + dis.x,
                    y: Number(arr[5]) + dis.y
                }
                // now.x = now.x > 0 ? 0 : now.x;
                // now.x = now.x < -(w / 2) ? -(w / 2) : now.x;
                // now.y = now.y > 0 ? 0 : now.y;
                // now.y = now.y < -(h / 2) ? -(h / 2) : now.y;
                $('.flipbook').css('transform', 'translate3d(' + now.x + 'px, ' + now.y + 'px, 0px)');
                _this.pos = {
                    x: e.touches[0].pageX,
                    y: e.touches[0].pageY
                };
            }
            e.stopPropagation();
        }, false);
    }
})


