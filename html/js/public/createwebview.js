var ws = null, embed = null;
// 扩展API加载完毕，现在可以正常调用扩展API 
function plusReady () {
    ws = plus.webview.currentWebview();
    ws.addEventListener('show', createEmbed, false);

}
// 判断扩展API是否准备，否则监听"plusready"事件
if (window.plus) {
    plusReady();
} else {
    document.addEventListener("plusready", plusReady, false);
}
function createEmbed () {
    var topoffset = document.getElementsByTagName('header')[0].offsetHeight;
    if (plus.navigator.isImmersedStatusbar()) {// 兼容immersed状态栏模式
        topoffset = (Math.round(plus.navigator.getStatusbarHeight()) + topoffset);
    }
    var page = location.href.match(/\/([a-z0-9]+\.html.*)$/)[1];
    embed = plus.webview.create('childwebview/' + page, 'childwebview/' + page, { top: (topoffset - 1) + 'px', bottom: '0px', position: 'dock', dock: 'bottom', bounce: 'none' });
    ws.append(embed);

}
