$(function(){var i=$(window),t=$(".container"),e=$(".win-win-header"),o=$("#win-win-header-sub"),n=$(".subnav"),a=$(".toTop"),d=$(window).scrollTop(),s=0,r=0,c=($("#win-win-header").height(),n.innerHeight()),l=n.offset()?n.offset().top:0,h=!1;window.isIE=function(){return window.ActiveXObject||"ActiveXObject"in window||/MSIE ([^;]+)/.test(navigator.userAgent)?!0:!1},window.isMac=function(){return-1!==navigator.platform.indexOf("Mac")},window.isMobile=function(){return!!navigator.userAgent.match(/android|webos|ip(hone|ad|od)|opera (mini|mobi|tablet)|iemobile|windows.+(phone|touch)|mobile|fennec|kindle (Fire)|Silk|maemo|blackberry|playbook|bb10\; (touch|kbd)|Symbian(OS)|Ubuntu Touch/i)},window.isRetina=function(){var i="(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)";return window.devicePixelRatio>1?!0:window.matchMedia&&window.matchMedia(i).matches?!0:!1},isMac()&&$("body").addClass("mac"),isIE()&&$("body").addClass("ie");var m=$("img[data-src]");m.each(isRetina()?function(){var i=$(this).attr("data-src-2x");$(this).attr("src",i)}:function(){var i=$(this).attr("data-src");$(this).attr("src",i)}),window.getViewport=function(){return"BackCompat"==document.compatMode?{width:document.body.clientWidth,height:document.body.clientHeight}:{width:document.documentElement.clientWidth,height:document.documentElement.clientHeight}},window.fixSubnav=function(t){i.scroll(function(){s=i.scrollTop(),r=i.scrollLeft(),s>l?(n.addClass("fixed").css("left",-r),h=!0):(n.removeClass("fixed").css("left",0),h=!1),1===t&&(isIE()||(s>d?s>l+c?n.stop().animate({top:-c},200):s>l&&l+c>s&&n.stop().css({top:0}):s>l?n.stop().animate({top:0},200):d>l&&n.finish().css({top:l}))),d=s})},i.scroll(function(){s=i.scrollTop(),900>s?a.fadeOut():a.fadeIn()}).resize(function(){getViewport().width<1080?(t.addClass("JSWrapperWidth"),n.addClass("JSWrapperWidth"),e.addClass("JSWrapperWidth"),o.css("width","1080px")):(t.removeClass("JSWrapperWidth"),n.removeClass("JSWrapperWidth"),e.removeClass("JSWrapperWidth"),o.css("width","100%"))}),a.click(function(){$("html,body").animate({scrollTop:0},500)}),i.scroll().resize()});