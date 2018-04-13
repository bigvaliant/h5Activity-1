$(function () {
    
        // 抽奖图片布局
        var items = $(".item");
        var posT = [0,0,0,1,2,2,2,1,1];
        var posL = [0,1,2,2,2,1,0,0,1];
        
        $.each(items, function (i, item) {
            var w = $(item).outerWidth();
            var h = $(item).outerHeight();
            $(item).css({
                left: w * posL[i],
                top: h * posT[i]
            });
        });
    
        // 抽奖
        var timer = null,   // 定时器
            i = 0,      // 开始位置
            count = 0,      // 计数
            state = false,  // 开关
            speed = 0,     // 速度
            speedArr = [30, 60, 100, 300];     //  

        // 是否有机会抽奖
        var total = $(".count").text();

        $("#start").on("click", function(){
            if (state) return;
            if(total <= 0) return alert("没有次数了");
            total--;
            $(".count").text(total);

            state = true;
            $(items[i]).find(".modal").show();
            var random = Math.floor(Math.random() * 20 + 50);
            console.log(random);
            start(random);
        });
    
        function start(random) {
            clearTimeout(timer);    // 清除定时器
            i++;
            count++;
            if (i > 7) i = 0;

            //速度
            var s1 = random / 2;
            var s2 = random - 10;
            var s3 = random - 5;

            if (count <= s1) {
                speed = speedArr[0];
            }
            else if (count > s1 && count <= s2) {
                speed = speedArr[1];
            }
            else if (count > s2 && count <= s3) {
                speed = speedArr[2];
            }
            else if (count > s3) {
                speed = speedArr[3];
            }
            // console.log(count, speed);

            // 定时器
            timer = setTimeout(function(){
                $(items[i]).find(".modal").show(); 
                $(items[i]).siblings().find(".modal").hide();

                if (count >= random) {
                    clearTimeout(timer);    // 清除定时器
                    showOkPage(items[i]);
                    
                    // 初始化
                    state = !state;
                    count = 0;
                    speed = speedArr[0];
                    return;
                }
                
                // 再次执行
                start(random);

            }, speed);
        }

        // 抽奖完成
        function showOkPage(item) {
            var className = $(item).find("div").hasClass("envelope");
            var imgUrl = $(item).find("img").attr("src");
            var text = $(item).find("p").text();
            var text = $(item).find("p").text();
            console.log(className, imgUrl, text);

            if (className) {
                $(".reffle_pic").addClass("hb");
            }

            $("#feffle_ok_img").attr("src", imgUrl);
            $("#feffle_ok_text").html(text);
            $(".reffle_ok").css("display", "block");
        }
    
    
        $(".close").click(function(){
            $(".reffle_ok").css("display", "none");
        });
    
    });