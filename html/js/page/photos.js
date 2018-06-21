var app = new Vue({
    el: '#app',
    data: {
        photos: null
    },
    computed: {
    },
    methods: {
        closePhotos: function(){
            // 状态条设置为红色
		    plus.navigator.setStatusBarBackground('#d10100');
            var page = plus.webview.currentWebview();
            page.close('auto');
        }
    },
    mounted: function(){
        var mySwiper = new Swiper('#photos',{
            pagination : '.swiper-pagination',
            initialSlide: this.photos.index
        });
    },
    created: function(){
        this.photos = JSON.parse(localStorage.getItem('photos'))
    }
})


if(window.plus){
    plusReady();
}else{
    document.addEventListener("plusready",plusReady,false);
}
function plusReady(){
    plus.navigator.setStatusBarBackground('#000');
}