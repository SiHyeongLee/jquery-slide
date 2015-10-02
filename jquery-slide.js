//함수 실행
$(document).ready(function() {
    if ($('.featured-service')) {namespace.doSlider('.featured-service', 5000, 'true');} //메인 서비스 영역 슬라이드 함수 실행, 파라메터 (슬라이드 실행 영역, 모션 간격, 자동플레이)
});

//네임스페이스
var namespace = {};

//함수 정의
(function (window, $, NS) {

    NS.doSlider = function(object, delay, autoplay) {
        var $elemWrap = $(object),
            $elem = $elemWrap.find('.js-slide-container > *'),
            $sideMotionTrigger = $elemWrap.find('.slide-button'),
            $counterTrigger = $elemWrap.find('.js-slide-counter > *'),
            timer = 0,
            speed = 500,                                        //슬라이드 이동 속도
            interval = delay,                                   //슬라이드 시간 간격
            direction = '-',                                    //슬라이드 이동 방향
            distance = null,         							//슬라이드 이동 거리
            endLeftPos = null,    								//좌측 한계선
            endRightPos = null,      							//우측 한계선
            initLeftPos = null,                            		//endLeftPos 도착 시 $elem의 재설정 위치
            initRightPos = null,                           		//endRightPos 도착 시 $elem의 재설정 위치
            currentCounter = 0,                                 //카운터 현재 위치
            directionCounter = 1,                               //카운터 이동 방향
            isAnimating = false;                                //현재 슬라이드 동작 유무 설정($sideMotionTrigger의 연속 클릭에 대한 오작동 방지)

        function initialize() {
            distance = $elemWrap.parent().innerWidth(),
                endLeftPos = -(distance * $elem.last().index()),
                endRightPos = distance * $elem.last().index(),
                initLeftPos = distance,
                initRightPos = -distance;

            $elem.each(function() {
                $(this).css('left', $(this).index() * distance);
            });

            startMotion();
        }

        function doMotion(count) {
            isAnimating = true;

            if (count !== undefined) { //$counterTrigger 클릭했을 경우
                currentCounter = count;

                $elem.each(function() {
                    $(this).animate({
                        left : ($(this).index() - count) * distance
                    }, speed, function() {
                        isAnimating = false;

                        if ($(this).position().left === 0) {
                            $elem.find('a').attr('tabindex', -1);
                            $(this).find('a').attr('tabindex', 0);
                        }
                    });
                });

            } else {
                $elem.each(function() {
                    if (direction=="+" && $(this).position().left >= endRightPos) {$(this).css('left', initRightPos);}
                    if (direction=="-" && $(this).position().left <= endLeftPos) {$(this).css('left', initLeftPos);}
                });

                $elem.animate({
                    left : direction + '=' + distance
                }, speed, function() {
                    isAnimating = false;

                    if ($(this).position().left === 0) {
                        $elem.find('a').attr('tabindex', -1);
                        $(this).find('a').attr('tabindex', 0);
                    }
                });

                //카운터 동작
                currentCounter = currentCounter + directionCounter;
                if (currentCounter > $counterTrigger.last().index()) {currentCounter = 0;}
                if (currentCounter < 0) {currentCounter = $counterTrigger.last().index();}
            }

            $counterTrigger.eq(currentCounter).addClass('active').siblings().removeClass('active');
        }


        //슬라이드 시작 함수
        function startMotion() {
            if (autoplay === 'true') {
                if (timer === 0) {timer = setInterval(doMotion, interval);}
            }
        }

        //슬라이드 정지 함수
        function stopMotion() {
            if (timer !== 0) {
                clearInterval(timer);
                timer = 0;
            }
        }

        //사이드이동 버튼 클릭 시 동작 함수
        $sideMotionTrigger.on({
            click : function() {
                if ($(this).hasClass('js-slide-prev')) {
                    direction = '+';
                    directionCounter = -1;
                } else {
                    direction = '-';
                    directionCounter = 1;
                }

                if (!isAnimating) {
                    doMotion();
                    stopMotion();
                    direction = '-';
                    directionCounter = 1;
                    setTimeout(startMotion,2000);
                }
            }
        });

        $elem.on({
            swipeleft : function() {
                direction = '-';
                directionCounter = 1;
                if (!isAnimating) {
                    doMotion();
                    stopMotion();
                    setTimeout(startMotion,2000);
                }
            },
            swiperight : function() {
                direction = '+';
                directionCounter = -1;
                if (!isAnimating) {
                    doMotion();
                    stopMotion();
                    direction = '-';
                    directionCounter = 1;
                    setTimeout(startMotion,2000);
                }
            }
        });

        //카운터 클릭 시 동작 함수
        $counterTrigger.on({
            click : function() {
                var count = $(this).index();

                if (!isAnimating) {
                    doMotion(count);
                    stopMotion();
                    direction = '-';
                    directionCounter = 1;
                    setTimeout(startMotion,2000);
                }
            }
        });

        initialize();
    };

})(window, jQuery, namespace);