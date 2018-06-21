//判断手机类型
window.onload = function () {
    var u = navigator.userAgent;
    if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
    } else if (u.indexOf('iPhone') > -1) {//苹果手机
        //屏蔽ios下上下弹性
        $(window).on('scroll.elasticity', function (e) {
            e.preventDefault();
        })
        // .on('touchmove.elasticity', function (e) {
        //     e.preventDefault();
        // });
    }

}


//加载图片
var loading_img_url = [],
    thumb_img_url = [],
    bookid = window.location.href.match(/[\?&]bookid=([^&$]+)/)[1];
$.xhrGet('book/familyData.shtml', {
    id: bookid
}, function (data) {
    if (data.success) {
        if (!data.data.img.length) {
            $('.shade').hide();
            return;
        }
        for (var i = 0; i < data.data.img.length; i++) {
            var url = BASEIP + 'mrz.file/file/books/' + bookid + '/' + (i + 1) + '.jpg';
            loading_img_url.push(url);

        }
        //预加载
        loading();
    }
})
//加载页面
var numbers = 0, loadNum = 0, length, i = 0, downLoadBool = true;
function loading () {
    length = loading_img_url.length > 9 ? 9 : loading_img_url.length;

    var tagHtml = ' <div id="loading-img-1" style="background:#fff url(' + loading_img_url[0] + ') center top no-repeat;background-size:100%"></div>';
    $(".flipbook").append(tagHtml);
    var w = $(".graph").width();

    //配置turn.js
    function loadApp () {
        recursion();
        var w = $('.flipbook-viewport').width();
        var h = $('.flipbook-viewport').height();
        $('.flipbook').width(w).height(h);
        $('.flipbook').turn({
            // Width
            width: w,
            // Height
            height: h,
            // Elevation
            elevation: 50,
            acceleration: true,
            disabled: true,
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
        $('.flipbook-viewport').zoom({
            flipbook: $('.flipbook')
        });

    }

    yepnope({
        test: Modernizr.csstransforms,
        yep: ['js/public/turn.js'],
        both: ['js/public/zoom.min.js'],
        complete: loadApp
    });
}
function recursion () {
    if (i >= loading_img_url.length) return;
    if (!downLoadBool) return;
    var img = new Image();
    img.src = loading_img_url[i];
    img.onerror = function () {
        numbers += (1 / length) * 100;
        loadNum++;
        i++;

        newDiv(i);
        recursion();
    }
    img.onload = function () {
        if (loadNum == length) {
            $('.shade').hide();
            $(".flipbook-viewport").show();
            app.btnBool = true;
        } else if (loadNum < length) {
            numbers += (1 / length) * 100;
            loadNum++;
            $('.number').html(parseInt(numbers) + "%");
        }
        i++;
        newDiv(i);
        recursion();
    }
}

function newDiv (i) {
    if (i == 0) return;
    var div = document.createElement('div');
    div.id = 'loading-img-' + (i + 1);
    div.style.backgroundColor = '#fff';
    div.style.backgroundImage = 'url(' + loading_img_url[i] + ')';
    div.style.backgroundPosition = 'center top';
    div.style.backgroundSize = '100%';
    var element = $(div);
    $(".flipbook").turn("addPage", element, i + 1);

    app.thumblist.push({
        urlsrc: loading_img_url[i - 1],
        index: i
    });
}


