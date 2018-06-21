var app = new Vue({
    el: '#app',
    data: {
        photos: null
    },
    computed: {
    },
    methods: {
        closePhotos: function(){
            window.close();
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
