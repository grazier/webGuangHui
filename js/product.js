$(function () {
  
  var firstAnimate = function () {
    var mx4 = $('.video-img img');
    mx4.addClass('animate');
  }

  var numAnimate = function (obj) {
    var video = obj.find('.nums.video'),
        call = obj.find('.nums.call'),
        game = obj.find('.nums.game'),
        video_num = [3,1,0,0],
        call_num = [1,3],
        game_num = [2,1],
        eachFunc = function (index) {
          var that = $(this),
              status = [];
          if (that.hasClass('video')) {
            status = video_num;
          } else if (that.hasClass('call')) {
            status = call_num;
          } else {
            status = game_num;
          }
          $(this).animate({
            'margin-top': (52*(9-status[index])-464)+'px'
          },1000);
        }
    video.each(eachFunc);
    call.each(eachFunc);
    game.each(eachFunc);
  }

  var percentAnimate = function () {
    var bar = $('.wifi-progress-bar'),
        blue = bar.find('.blue'),
        yellow = bar.find('.yellow');
    blue.animate({
      width: '80%'
    },1000);
    yellow.animate({
      width: '20%'
    },1000);
  }

  var index = 0;
  var cameraAnimate = function (delta) {
    if (/AppleWebKit\/(\S+)/.test(navigator.userAgent)) {
      delta = delta > 0 ? 0.1 : -0.1;
    } else {
      delta = delta > 0 ? 1 : -1;
    }
    if (((index >= 0 && delta < 0) || index < 0) && (index > -10 || delta > 0) ) {
      index += delta;
    }
    var camera = $('.camera-img img');
    camera.animate({
      'margin-top': -30*index+'px'
    },{queue: false});
  }


  firstAnimate();
  $(window).scroll(function () {
    var top = $(window).scrollTop();
    if (top > 3500) {
      percentAnimate();
      percentAnimate = function () {};
    }
    if (top > 4600) {
      numAnimate($('.standby-params'));
      numAnimate = function () {};
    }
  });
  $('.mx4-camera').on('mousewheel', function(event) {
      cameraAnimate(event.deltaY);
  });

  if (isMobile) {
    var bar = $('.wifi-progress-bar');

    bar.find('.blue').css('width', '80%');
    bar.find('.yellow').css('width', '20%');
  } else {
    var nums = $('.nums'),
        img = $('.standby-img-2');
    img.addClass('roll');
    nums.removeClass('num3')
      .removeClass('num2')
      .removeClass('num1')
      .removeClass('num0');
  }
})