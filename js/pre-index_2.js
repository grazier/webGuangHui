(function (w, d) {
  var sub2 = d.getElementById('win-win-header-sub'),
      product2 = d.getElementById('win-win-header-link-product2'),
      addHandle2 = function (element, type, handler) {
        if (element.addEventListener) {
          element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
          element.attachEvent('on' + type, handler);
        } else {
          element['on' + type] = handler;
        }
      },
      getEvent2 = function (event) {
        return event ? event : w.event;
      },
      getTarget2 = function (event) {
        return event.target || event.srcElement;
      },
      setOpacity2 = function (element, num) {
        element.parentNode.style.opacity = num;
      },
      handler2 = function (event) {
        event = getEvent2(event);
        var target = getTarget2(event);
        if (target.className === 'a-mx4') {
          setOpacity2(arr['a-mx4'], 1);
          setOpacity2(arr['a-mx3'], 0.5);
          setOpacity2(arr['a-mx2'], 0.5);
        } else if (target.className === 'a-mx3') {
          setOpacity2(arr['a-mx4'], 0.5);
          setOpacity2(arr['a-mx3'], 1);
          setOpacity2(arr['a-mx2'], 0.5);
        } else if (target.className === 'a-mx2') {
          setOpacity2(arr['a-mx4'], 0.5);
          setOpacity2(arr['a-mx3'], 0.5);
          setOpacity2(arr['a-mx2'], 1);
        }
      },
      clear2 = function () {
        setOpacity2(arr['a-mx4'], 1);
        setOpacity2(arr['a-mx3'], 1);
        setOpacity2(arr['a-mx2'], 1);
      },
      a2 = sub2.getElementsByTagName('a'),
      arr2 = [];
  for (var i = a2.length - 1; i >= 0; i--) {
    arr2[a2[i].className] = a2[i];
    addHandle2(a2[i].parentNode, 'mouseover', handler2);
  };
  addHandle2(product2, 'mouseleave', clear2);
})(window, document);


$(function () {
  var product2 = $('#win-win-header-link-product2'),
      subnav2 = $('#win-win-header-sub'),
      nav2 = $('nav'),
      img2 = $('img[data-src]'),
      isRetina2 = function () {
        var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
          if (window.devicePixelRatio > 1) {
            return true;
          }
          if (window.matchMedia && window.matchMedia(mediaQuery).matches) {
            return true;
          }
          return false;
      },
      isMac2 = function () {
        return navigator.platform.indexOf('Mac') !== -1;
      },
      show2 = function () {
        product2.addClass('hover');
        subnav2.stop().slideDown();
        nav2.addClass('toggle');
      },
      hide2 = function () {
        product2.removeClass('hover');
        subnav2.stop().slideUp(function () {
          nav2.removeClass('toggle');
        });
      };
  product2.mouseover(show2);
  subnav2.mouseover(show2);
  product2.mouseout(hide2);
  subnav2.mouseout(hide2);

  if (isMac2()) {
    $('body').addClass('mac');
  }
  if (isRetina2()) {
    img2.each(function () {
      var src = $(this).attr('data-src-2x');
      $(this).css('width', '100%').attr('src', src);
    });
  } else {
    img2.each(function () {
      var src = $(this).attr('data-src');
      $(this).attr('src', src);
    });
  }

});