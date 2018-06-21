var blist = [];
function scaned (t, r, f) {
    var d = new Date();
    var h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(), ms = d.getMilliseconds();
    if (h < 10) { h = '0' + h; }
    if (m < 10) { m = '0' + m; }
    if (s < 10) { s = '0' + s; }
    if (ms < 10) { ms = '00' + ms; }
    else if (ms < 100) { ms = '0' + ms; }
    var ts = '[' + h + ':' + m + ':' + s + '.' + ms + ']';
    // alert('['+h+':'+m+':'+s+'.'+ms+']'+'　　'+t+'码');
    blist[blist.length] = { type: t, result: r, file: f };
    update(t, r, f);
}
function update (t, r, f) {
    var arr = r.match(/zhangshi-helpid-(\d+)/);
    if (arr) {
        setTimeout(function () {
            clicked('/helpprodetail.html?id=' + arr[1], 'reloadIndex');
        }, 500);
    } else {
        plus.nativeUI.alert('非项目二维码', null, '扫描失败');
    }


}
var app = new Vue({
    el: '#app',
    data: {
        banner: [],
        enterList: [],
        articleList: [],
        helpList: [],
        bookList: [],
        topData: {
            maxAmount: 0,
            projectCount: 0,
            helpCount: 0
        }
    },
    methods: {
        bannerHref: function (type, url, articleId) {
            // 轮播图类型 1、普通的轮播图；2、链接轮播图；3、文章轮播图
            switch (type) {
                case 3:
                    this.clickedTo('articledetail.html?id=' + articleId); break;
            }
        },
        clickedTo: function (id, bool) {
            if (bool) {
                clicked(id, '', true)
            } else {
                clicked(id, 'reloadIndex')
            }

        },
        toPersonal: function () {
            if ($.checklogin()) this.clickedTo('/personalcenter.html');
        },
        toCircle: function () {
            this.clickedTo('/enterprisecircle.html');
        },
        toHelp: function (index) {
            localStorage.setItem('helpType', index ? index : '');
            localStorage.setItem('editHelp', '');
            localStorage.setItem('editHelpId', '');
            this.clickedTo('helpmanpages.html');
        },
        getHelpList: function () {
            var _this = this
            // 求助列表
            $.xhrGet('help/list.shtml', {
                pageNum: 1,
                count: 3,
                type: ''
            }, function (data) {
                if (data.success) {
                    _this.helpList = data.data
                }
            })
        }
    },
    created: function () {
        // 族谱书
        // this.bookList = bookdata
        var _this = this

        // 文章列表mrz.api/article/list/top/1.shtml?orgId=1&count=3&token=
        $.xhrGet('article/list/top/1.shtml', {
            orgId: 1,
            count: 4
        }, function (data) {
            if (data.success) {
                for (var index in data.data) {
                    data.data[index].publishTime = data.data[index].publishTime.slice(0, 10)
                }
                _this.articleList = data.data
            }
        })
        // 企业列表
        $.xhrGet('company/list.shtml', {
            pageNum: 1,
            count: 2,
            type: '' //企业类型，可选
        }, function (data) {
            if (data.success) {
                _this.enterList = data.data
            }
        });
        // 族谱列表
        $.xhrGet('book/m/listBook.shtml', {
            page: 1,
            rows: 6,
            jurisdiction: 1,
            type: 2
        }, function (data) {
            if (data.success) {
                _this.bookList = data.data.rows;
            }
        });

        this.getHelpList();
    },
    mounted: function () {
        var _this = this
        //轮播图
        $.xhrGet('carousel/list/0.shtml', {}, function (data) {
            if (data.success) {
                _this.banner = data.data

                _this.$nextTick(function () {
                    var mySwiper = new Swiper('#banner', {
                        pagination: '.swiper-pagination'
                    });
                })
            }
        })
        // 大数据
        $.xhrGet('help/top.shtml', {
            pageNum: 1,
            count: 10
        }, function (data) {
            if (data.success) {
                _this.$set(_this.topData, 'maxAmount', data.data.maxAmount ? data.data.maxAmount : 0)
                _this.$set(_this.topData, 'projectCount', data.data.projectCount ? data.data.projectCount : 0)
                _this.$set(_this.topData, 'helpCount', data.data.helpCount ? data.data.helpCount : 0)
                // Object.assign(_this.topData, {
                //     maxAmount: data.data.maxAmount,
                //     projectCount: data.data.projectCount,
                //     helpCount: data.data.helpCount
                // })
                _this.$nextTick(function () {
                    var mySwiper = new Swiper('#index-help', {
                        pagination: '.slide-pagination',
                        effect: 'coverflow',
                        grabCursor: true,
                        loop: true,
                        spaceBetween: 0,
                        centeredSlides: true,
                        slidesPerView: '2',
                        coverflow: {
                            rotate: 0,
                            stretch: -50,
                            depth: 300,
                            modifier: 1,
                            slideShadows: true
                        },
                        onSlideChangeEnd: function (swiper) {
                            swiper.updateSlidesSize();
                            swiper.updatePagination();
                            swiper.updateClasses();
                        }
                    });
                })
            }
        });

    }
})


