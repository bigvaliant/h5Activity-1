/*!
 * lottery v1.0.3
 * by blacksnail2015 2015-03-30
 */
/*
 * 这里对速度做一下说明：
 *     这里的速度其实就是切换样式的间隔时间，也就是setTimeout(functionName, time)中的time值；
 *     因此，速度值越小，间隔越短，转的越快。
 */
(function($) {
    "use strict";
    $.fn.popup = function(opts) {
        return new popup(this[0], opts);
    };
    var queue = [];
    var popup = function(containerEl, opts) {


        if (typeof containerEl === "string" || containerEl instanceof String) {
            this.container = document.getElementById(containerEl);
        } else {
            this.container = containerEl;
        }
        if (!this.container) {
            window.alert("Error finding container for popup " + containerEl);
            return;
        }


        try {
            if (typeof(opts) === "string" || typeof(opts) === "number")
                opts = {
                    message: opts,
                    cancelOnly: "true",
                    cancelText: "OK"
                };
            this.id = opts.id = opts.id; //opts is passed by reference  
            this.addCssClass = opts.addCssClass ? opts.addCssClass : "";
            this.suppressTitle = opts.suppressTitle || this.suppressTitle;
            this.title = opts.suppressTitle ? "" : (opts.title || "Alert");
            this.message = opts.message || "";
            this.cancelText = opts.cancelText || "Cancel";
            this.cancelCallback = opts.cancelCallback || function() {};
            this.cancelClass = opts.cancelClass || "button";
            this.doneText = opts.doneText || "Done";
            this.doneCallback = opts.doneCallback || function() {
                // no action by default  
            };
            this.doneClass = opts.doneClass || "button";
            this.cancelOnly = opts.cancelOnly || false;
            this.effectTime = opts.effectTime || 200;
            this.onShow = opts.onShow || function() {};
            this.autoCloseDone = opts.autoCloseDone !== undefined ? opts.autoCloseDone : true;


            queue.push(this);
            if (queue.length === 1)
                this.show();
        } catch (e) {
            console.log("error adding popup " + e);
        }


    };


    popup.prototype = {
        id: null,
        addCssClass: null,
        title: null,
        message: null,
        cancelText: null,
        cancelCallback: null,
        cancelClass: null,
        doneText: null,
        doneCallback: null,
        doneClass: null,
        cancelOnly: false,
        effectTime: null,
        onShow: null,
        autoCloseDone: true,
        suppressTitle: false,
        show: function() {
            var self = this;
            var markup = "<div id='" + this.id + "' class='popup hidden " + this.addCssClass + "'>" +
                "<header>" + this.title + "</header>" +
                "<div class='popup_cont'>" + this.message + "</div>" +
                "<footer>" +
                "<a href='javascript:;' class='" + this.doneClass + "' id='action'>" + this.doneText + "</a>" +
                "<a href='javascript:;' class='" + this.cancelClass + "' id='cancel'>" + this.cancelText + "</a>" +
                "<div style='clear:both'></div>" +
                "</footer>" +
                "</div>";


            var $el = $(markup);
            $(this.container).append($el);
            $el.bind("close", function() {
                self.hide();
            });


            if (this.cancelOnly) {
                $el.find("A#action").hide();
                $el.find("A#cancel").addClass("center");
            }
            $el.find("A").each(function() {
                var button = $(this);
                button.bind("click", function(e) {
                    if (button.attr("id") === "cancel") {
                        self.cancelCallback.call(self.cancelCallback, self);
                        self.hide();
                    } else {
                        self.doneCallback.call(self.doneCallback, self);
                        if (self.autoCloseDone)
                            self.hide();
                    }
                    e.preventDefault();
                });
            });
            self.positionPopup();
            $.blockUI(0.5);


            $el.bind("orientationchange", function() {
                self.positionPopup();
            });


            //force header/footer showing to fix CSS style bugs  
            $el.show(this.effectTime)


        },


        hide: function() {
            var self = this;
            $("#" + self.id).addClass("hidden");
            $.unblockUI();
            self.remove();
        },


        remove: function() {
            var self = this;
            var $el = $("#" + self.id);
            $el.unbind("close");
            $el.find("BUTTON#action").unbind("click");
            $el.find("BUTTON#cancel").unbind("click");
            $el.unbind("orientationchange").hide(this.effectTime)
            setTimeout(function() {
                $el.remove();
            }, this.effectTime)
        },


        positionPopup: function() {
            var popup = $("#" + this.id);


            popup.css("top", ((window.innerHeight / 2.5) + window.pageYOffset) - (popup[0].clientHeight / 2) + "px");
            popup.css("left", (window.innerWidth / 2) - (popup[0].clientWidth / 2) + "px");
        }
    };
    var uiBlocked = false;
    $.blockUI = function(opacity) {
        if (uiBlocked)
            return;
        opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
        $("BODY").prepend($("<div id='mask'" + opacity + " class='popup_bg'></div>"));
        $("BODY DIV#mask").bind("touchstart", function(e) {
            e.preventDefault();
        });
        $("BODY DIV#mask").bind("touchmove", function(e) {
            e.preventDefault();
        });
        uiBlocked = true;
    };


    $.unblockUI = function() {
        uiBlocked = false;
        $("BODY DIV#mask").unbind("touchstart");
        $("BODY DIV#mask").unbind("touchmove");
        $("BODY DIV#mask").fadeOut(this.effectTime)
        setTimeout(function() {
            $("BODY DIV#mask").remove();
        }, this.effectTime)
    };



    $.popup = function(opts) {
        return $(document.body).popup(opts);
    };


})(jQuery);

var defaults = {
    selector: '#lottery',
    width: 4, // 转盘宽度
    height: 4, // 转盘高度
    initSpeed: 300, // 初始转动速度
    speed: 0, // 当前转动速度
    upStep: 50, // 加速滚动步长
    upMax: 50, // 速度上限
    downStep: 30, // 减速滚动步长
    downMax: 200, // 减速上限
    waiting: 100, // 匀速转动时长
    index: 0, // 初始位置
    target: 2, // 中奖位置，可通过后台算法来获得，默认值：最便宜的一个奖项或者"谢谢参与"
    isRunning: false // 当前是否正在抽奖
}

var lottery = {

    // 初始化用户配置
    lottery: function(options) {
        this.options = $.extend(true, defaults, options);
        this.options.speed = this.options.initSpeed;
        this.container = $(this.options.selector);
        this._setup();
    },

    // 开始装配转盘
    _setup: function() {

        // 这里为每一个奖项设置一个有序的下标，方便lottery._roll的处理
        // 初始化第一行lottery-group的序列
        for (var i = 0; i < this.options.width; ++i) {
            this.container.find('.lottery-group:first .lottery-unit:eq(' + i + ')').attr('lottery-unit-index', i);
        }

        // 初始化最后一行lottery-group的序列
        for (var i = lottery._count() - this.options.height + 1, j = 0, len = this.options.width + this.options.height - 2; i >= len; --i, ++j) {
            this.container.find('.lottery-group:last .lottery-unit:eq(' + j + ')').attr('lottery-unit-index', i);
        }

        // 初始化两侧lottery-group的序列
        for (var i = 1, len = this.options.height - 2; i <= len; ++i) {
            this.container.find('.lottery-group:eq(' + i + ') .lottery-unit:first').attr('lottery-unit-index', lottery._count() - i);
            this.container.find('.lottery-group:eq(' + i + ') .lottery-unit:last').attr('lottery-unit-index', this.options.width + i - 1);
        }
        this._enable();
    },

    // 开启抽奖
    _enable: function() {
        this.container.find('a').bind('click', this.beforeRoll);
    },

    // 禁用抽奖
    _disable: function() {
        this.container.find('a').unbind('click', this.beforeRoll);
    },

    // 转盘加速
    _up: function(e) {
        var _this = this;
        if (_this.options.speed <= _this.options.upMax) {
            _this._constant(e);
        } else {
            _this.options.speed -= _this.options.upStep;
            _this.upTimer = setTimeout(function() {
                _this._up(e);
            }, _this.options.speed);
        }
    },

    // 转盘匀速
    _constant: function(f) {
        var _this = this;
        clearTimeout(_this.upTimer);
        setTimeout(function() {
            _this.beforeDown(f);
        }, _this.options.waiting);
    },

    // 减速之前的操作，支持用户追加操作（例如：从后台获取中奖号）
    beforeDown: function(g) {
        var _this = this;
        //_this.aim();
        if (g == 1) {
            _this.options.target = 1;
        }
        if (_this.options.beforeDown) {
            _this.options.beforeDown.call(_this);
        }
        _this._down();
    },

    // 转盘减速
    _down: function() {
        var _this = this;
        if (_this.options.speed > _this.options.downMax && _this.options.target == _this._index()) {
            _this._stop();
        } else {
            _this.options.speed += _this.options.downStep;
            _this.downTimer = setTimeout(function() {
                _this._down();
            }, _this.options.speed);
        }
    },

    // 转盘停止，还原设置
    _stop: function() {
        var _this = this;
        clearTimeout(_this.downTimer);
        clearTimeout(_this.rollerTimer);
        _this.options.speed = _this.options.initSpeed;
        _this.options.isRunning = false;
        _this._enable();
        if (_this.options.target == 2) {
            $.popup({
                title: "提示",
                message: "很遗憾这次没抽中",
                cancelText: "再来一次",
                cancelCallback: function() {
                    _this.beforeRoll(1);
                },
                doneText: "确定",
                doneCallback: function() {
                    console.log("确定点击后的事件");
                },
                cancelOnly: false
            });
        } else {
            document.getElementById('light').style.display = 'block';
            document.getElementById('fade').style.display = 'block';
            setTimeout("window.location.href='http://iwenli.org'", 3000);
        }
    },

    // 抽奖之前的操作，支持用户追加操作
    beforeRoll: function(a) {
        var _this = lottery;
        _this._disable();
        if (_this.options.beforeRoll) {
            _this.options.beforeRoll.call(_this);
        }

        _this._roll(a);
    },

    // 转盘滚动
    _roll: function(d) {
        var _this = this;
        _this.container.find('[lottery-unit-index=' + _this._index() + ']').removeClass("active");
        ++_this.options.index;
        _this.container.find('[lottery-unit-index=' + _this._index() + '].lottery-unit').addClass("active");
        _this.rollerTimer = setTimeout(function() {
            _this._roll();
        }, _this.options.speed);
        if (!_this.options.isRunning) {
            _this._up(d);
            _this.options.isRunning = true;
        }
    },

    // 转盘当前格子下标
    _index: function() {
        return this.options.index % this._count();
    },

    // 转盘总格子数
    _count: function() {
        return this.options.width * this.options.height - (this.options.width - 2) * (this.options.height - 2);
    },

    // 获取中奖号，用户可重写该事件，默认随机数字
    aim: function() {
        if (this.options.aim) {
            this.options.aim.call(this);
        } else {
            this.options.target = parseInt(parseInt(Math.random() * 10) * this._count() / 10);
            //alert(this.options.target);
            console.log(this.options.target);
        }
    }
};