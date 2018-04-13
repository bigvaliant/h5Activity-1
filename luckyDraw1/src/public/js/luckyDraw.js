$(function() {
    var elem1 = $(".luckyDraw_top");
    var elem2 = $(".luckyDraw_sec2");
    var h1 = $(window).height();
    var h2 = elem1.height() + elem2.height();
    $('#demo').vTicker({
        speed: 500,
        pause: 1000,
        animation: 'fade',
        mousePause: false,
        showItems: 1
    });
    lottery.lottery({
        selector: '#lottery',
        width: 3,
        height: 3,
        index: 0, // 初始位置
        initSpeed: 300, // 初始转动速度
        upStep:       50,   // 加速滚动步长
        upMax:        50,   // 速度上限
        downStep:     60,   // 减速滚动步长
        downMax:      500,  // 减速上限
        waiting:      100, // 匀速转动时长
        beforeRoll: function() { // 重写滚动前事件：beforeRoll
            console.log(this);
            //alert(1);
        }
    });
    if (h1 < h2) {
        var hh = h2 - h1;
        $("body").animate({
            "scrollTop": hh + "px"
        }, 100);
    }
});