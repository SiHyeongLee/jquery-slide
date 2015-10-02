//�Լ� ����
$(document).ready(function() {
    if ($('.featured-service')) {namespace.doSlider('.featured-service', 5000, 'true');} //���� ���� ���� �����̵� �Լ� ����, �Ķ���� (�����̵� ���� ����, ��� ����, �ڵ��÷���)
});

//���ӽ����̽�
var namespace = {};

//�Լ� ����
(function (window, $, NS) {

    NS.doSlider = function(object, delay, autoplay) {
        var $elemWrap = $(object),
            $elem = $elemWrap.find('.js-slide-container > *'),
            $sideMotionTrigger = $elemWrap.find('.slide-button'),
            $counterTrigger = $elemWrap.find('.js-slide-counter > *'),
            timer = 0,
            speed = 500,                                        //�����̵� �̵� �ӵ�
            interval = delay,                                   //�����̵� �ð� ����
            direction = '-',                                    //�����̵� �̵� ����
            distance = null,         							//�����̵� �̵� �Ÿ�
            endLeftPos = null,    								//���� �Ѱ輱
            endRightPos = null,      							//���� �Ѱ輱
            initLeftPos = null,                            		//endLeftPos ���� �� $elem�� �缳�� ��ġ
            initRightPos = null,                           		//endRightPos ���� �� $elem�� �缳�� ��ġ
            currentCounter = 0,                                 //ī���� ���� ��ġ
            directionCounter = 1,                               //ī���� �̵� ����
            isAnimating = false;                                //���� �����̵� ���� ���� ����($sideMotionTrigger�� ���� Ŭ���� ���� ���۵� ����)

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

            if (count !== undefined) { //$counterTrigger Ŭ������ ���
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

                //ī���� ����
                currentCounter = currentCounter + directionCounter;
                if (currentCounter > $counterTrigger.last().index()) {currentCounter = 0;}
                if (currentCounter < 0) {currentCounter = $counterTrigger.last().index();}
            }

            $counterTrigger.eq(currentCounter).addClass('active').siblings().removeClass('active');
        }


        //�����̵� ���� �Լ�
        function startMotion() {
            if (autoplay === 'true') {
                if (timer === 0) {timer = setInterval(doMotion, interval);}
            }
        }

        //�����̵� ���� �Լ�
        function stopMotion() {
            if (timer !== 0) {
                clearInterval(timer);
                timer = 0;
            }
        }

        //���̵��̵� ��ư Ŭ�� �� ���� �Լ�
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

        //ī���� Ŭ�� �� ���� �Լ�
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