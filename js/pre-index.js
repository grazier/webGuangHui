(function (w, d) {
  var sub = d.getElementById('meizu-header-sub'),
      product = d.getElementById('meizu-header-link-product'),
      addHandle = function (element, type, handler) {
        if (element.addEventListener) {
          element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
          element.attachEvent('on' + type, handler);
        } else {
          element['on' + type] = handler;
        }
      },
      getEvent = function (event) {
        return event ? event : w.event;
      },
      getTarget = function (event) {
        return event.target || event.srcElement;
      },
      setOpacity = function (element, num) {
        element.parentNode.style.opacity = num;
      },
      handler = function (event) {
        event = getEvent(event);
        var target = getTarget(event);
        if (target.className === 'a-mx4') {
          setOpacity(arr['a-mx4'], 1);
          setOpacity(arr['a-mx3'], 0.5);
          setOpacity(arr['a-mx2'], 0.5);
        } else if (target.className === 'a-mx3') {
          setOpacity(arr['a-mx4'], 0.5);
          setOpacity(arr['a-mx3'], 1);
          setOpacity(arr['a-mx2'], 0.5);
        } else if (target.className === 'a-mx2') {
          setOpacity(arr['a-mx4'], 0.5);
          setOpacity(arr['a-mx3'], 0.5);
          setOpacity(arr['a-mx2'], 1);
        }
      },
      clear = function () {
        setOpacity(arr['a-mx4'], 1);
        setOpacity(arr['a-mx3'], 1);
        setOpacity(arr['a-mx2'], 1);
      },
      a = sub.getElementsByTagName('a'),
      arr = [];
  for (var i = a.length - 1; i >= 0; i--) {
    arr[a[i].className] = a[i];
    addHandle(a[i].parentNode, 'mouseover', handler);
  };
  addHandle(product, 'mouseleave', clear);
})(window, document);


$(function () {
  var product = $('#meizu-header-link-product'),
      subnav = $('#meizu-header-sub'),
      nav = $('nav'),
      img = $('img[data-src]'),
      isRetina = function () {
        var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
          if (window.devicePixelRatio > 1) {
            return true;
          }
          if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
            return true;
          }
          return false;
      },
      isMac = function () {
        return navigator.platform.indexOf('Mac') !== -1;
      },
      show = function () {
        product.addClass('hover');
        subnav.stop().slideDown();
        nav.addClass('toggle');
      },
      hide = function () {
        product.removeClass('hover');
        subnav.stop().slideUp(function () {
          nav.removeClass('toggle');
        });
      };
  product.mouseover(show);
  subnav.mouseover(show);
  product.mouseout(hide);
  subnav.mouseout(hide);

  if (isMac()) {
    $('body').addClass('mac');
  }
  if (isRetina()) {
    img.each(function () {
      var src = $(this).attr('data-src-2x');
      $(this).css('width', '100%').attr('src', src);
    });
  } else {
    img.each(function () {
      var src = $(this).attr('data-src');
      $(this).attr('src', src);
    });
  }



  // 轮播
  $(function () {
    var container = $('.slider'),
        slider = container.children('.slider-wrap').children(),
        bullet = container.children('.bullet'),
        //btn_group_1 = $('.slider-2 .link-group'),
        //btn_group_2 = $('.slider-1 .button-group'),
        length = slider.length,
        flag = -1,
        current = 0,
        temp = '',
        time = '',
        loopSpeed = 8000,
        fadeSpeed = 2000,
        loop = function () {
          slider.eq(current).fadeOut(fadeSpeed);
          if (current <= 0) {
            flag = 1;
          } else if (current >= length - 1) {
            flag = -1;
          }
          //if (current === 0) {
          //  btn_group_1.fadeOut(fadeSpeed);
          //  btn_group_2.fadeIn(fadeSpeed);
          //} else {
          //  btn_group_2.fadeOut(fadeSpeed);
          //  btn_group_1.fadeIn(fadeSpeed);
          //}
          current = current + flag;
          slider.eq(current).fadeIn(fadeSpeed);
          bullet.children()
            .eq(current)
            .children('i')
            .addClass('fa-circle')
            .removeClass('fa-circle-thin')
            .end()
            .siblings()
            .children('i')
            .addClass('fa-circle-thin')
            .removeClass('fa-circle');
        };
    slider.eq(0).show();
    if (length > 1) {
      slider.each(function (index) {
        if (index === 0) {
          temp += '<li data-index="'+index+'"><i class="fa fa-circle"></i></li>';
        } else {
          temp += '<li data-index="'+index+'"><i class="fa fa-circle-thin"></i></li>';
        }
      });
      bullet.append($(temp));
      time = setInterval(loop, loopSpeed);
      bullet.on('click', 'li', function () {
        var index = parseInt($(this).attr('data-index'));
        //if (index === 0) {
        //  btn_group_1.fadeIn();
        //  btn_group_2.fadeOut();
        //} else {
        //  btn_group_2.fadeIn();
        //  btn_group_1.fadeOut();
        //}
        bullet.children()
          .eq(index)
          .children('i')
          .addClass('fa-circle')
          .removeClass('fa-circle-thin')
          .end()
          .siblings()
          .children('i')
          .addClass('fa-circle-thin')
          .removeClass('fa-circle');
        slider.eq(index).fadeIn()
          .siblings().fadeOut();
        clearInterval(time);
        current = index;
        time = setInterval(loop, loopSpeed);
      });
    }
  });


});