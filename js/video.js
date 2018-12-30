(function() {
  var isIE11 = !!navigator.userAgent.match(/Trident\/7\./);
  //基于jquery 1.8之前的代代码
  if (isIE11) {
    $.browser.msie = true;
    delete $.browser.mozilla;
  } //ie11 browser judgment
})();

if (!$.meizu) {
  $.meizu = {
    'zindex': 10000
  };
  $.mzAddResize = function(p, fn) {
    $.mzAddResize.param.push(p);
    $.mzAddResize.queue.push(fn);
  };
  $.mzAddResize.queue = [];
  $.mzAddResize.param = [];
}
$.block = {
  uuid: 0,
  getWH2: function() {
    return {
      'width': $(document).width(),
      'height': $(document).height()
    };
  },
  getWH: function() {
    var w = 0,
      h = 0;
    if ($.meizu.ie) {
      h = $(document.documentElement).height();
      w = $(document.documentElement).width();
    } else if (window.innerHeight) {
      h = window.innerHeight;
      w = window.innerWidth;
    } else if (document.documentElement && document.documentElement.clientHeight) {
      h = document.documentElement.clientHeight;
      w = document.documentElement.clientWidth;
    }
    return {
      'width': w,
      'height': h
    };
  },
  open: function(nohide) {
    $('body').addClass('vf');
    var block = $('<div id="mzBlockLayer' + ($.block.uuid += 1) + '" class="mzBlockLayer" style=" z-index: ' + ($.meizu.zindex += 1) + '; "> </div>');
    var htdy = $($.meizu.ie ? 'html' : 'body');
    htdy.data('sTop', Math.max($(document).scrollTop(), $('body').scrollTop()));
    !nohide && htdy.data('overflow', htdy.css('overflow')).css({
      'overflow': 'hidden'
    });
    var wh = !nohide ? this.getWH() : this.getWH2();
    $(document.body).append(block);
    block.css({
      'height': wh.height,
      'width': wh.width,
      'display': 'block'
    }).data('sTop', htdy.data('sTop'));
    !nohide && block.css('top', htdy.data('sTop'));
    $.mzAddResize({
      'block': block,
      'nohide': nohide
    }, function(data) {
      var htdy = $($.meizu.ie ? 'html' : 'body');
      var wh = !data.nohide ? $.block.getWH() : $.block.getWH2();
      data.block.css({
        'height': wh.height,
        'width': wh.width
      });
    });
    return "mzBlockLayer" + $.block.uuid;
  },
  reOpen: function(id, nohide) {
    $('body').addClass('vf');
    var htdy = $($.meizu.ie ? 'html' : 'body');
    htdy.data('sTop', Math.max($(document).scrollTop(), $('body').scrollTop()));
    !nohide && htdy.data('overflow', htdy.css('overflow')).css({
      'overflow': 'hidden'
    });
    var wh = !nohide ? this.getWH() : this.getWH2();
    var block = $('#' + id);
    block.css({
      'height': wh.height,
      'width': wh.width,
      'display': 'block'
    }).data('sTop', htdy.data('sTop'));
    !nohide && block.css('top', htdy.data('sTop'));
  },
  close: function(id) {
    $('body').removeClass('vf');
    var htdy = $($.meizu.ie ? 'html' : 'body');
    if ('hidden' != htdy.data('overflow')) htdy.removeAttr('style');
    $('#' + id).hide();
  }
};
(function($) {
  var _dragEvent,
    _use,
    _$window = $(window),
    _$document = $(document),
    _elem = document.documentElement,
    _isIE6 = !-[1, ] && !('minWidth' in _elem.style),
    _isLosecapture = 'onlosecapture' in _elem,
    _isSetCapture = 'setCapture' in _elem,
    _events = {},
    _fnMoves = {},
    _fnEnds = {},
    _fnStarts = {},
    DragEvent = function() {
      var that = this,
        proxy = function(name) {
          var fn = that[name];
          that[name] = function() {
            return fn.apply(that, arguments);
          };
        };
      proxy('start');
      proxy('move');
      proxy('end');
    };

  DragEvent.prototype = {
    onstart: $.noop,
    start: function(event) {
      _$document.bind('mousemove', this.move).bind('mouseup', this.end);

      this._sClientX = event.clientX;
      this._sClientY = event.clientY;
      this.onstart(event.clientX, event.clientY);

      return false;
    },
    onmove: $.noop,
    move: function(event) {
      this._mClientX = event.clientX;
      this._mClientY = event.clientY;
      this.onmove(
        event.clientX - this._sClientX,
        event.clientY - this._sClientY
      );

      return false;
    },
    onend: $.noop,
    end: function(event) {
      _$document.unbind('mousemove', this.move).unbind('mouseup', this.end);
      this.onend(event.clientX, event.clientY);
      return false;
    }
  };
  _use = function(event, inDom) {
    _dragEvent = _dragEvent || new DragEvent();
    var startWidth, startHeight, startLeft, startTop;
    var clsSelect = 'getSelection' in window ? function() {
      window.getSelection().removeAllRanges();
    } : function() {
      try {
        document.selection.empty();
      } catch (e) {};
    };
    _dragEvent.onstart = function(x, y) {

      startLeft = inDom[0].offsetLeft;
      startTop = inDom[0].offsetTop;


      _$document.bind('dblclick', _dragEvent.end);
      if (!_isIE6) {
        if (_isLosecapture) {
          inDom.bind('losecapture', _dragEvent.end);
        } else {
          _$window.bind('blur', _dragEvent.end);
        }
      }

      if (_isSetCapture) {
        inDom[0].setCapture();
      }

      _fnStarts[inDom[0].id] && _fnStarts[inDom[0].id]();

    };
    _dragEvent.onmove = function(x, y) {
      var limit = inDom.data('limit');
      var style = inDom[0].style,
        left = x + startLeft,
        top = y + startTop,
        sleft = Math.max(limit.minX, Math.min(limit.maxX, left)),
        stop = Math.max(limit.minY, Math.min(limit.maxY, top));
      style.left = sleft + 'px';
      style.top = stop + 'px';

      clsSelect();
      _fnMoves[inDom[0].id] && _fnMoves[inDom[0].id](sleft, stop);
    };
    _dragEvent.onend = function(x, y) {
      _$document.unbind('dblclick', _dragEvent.end);

      if (!_isIE6) {
        if (_isLosecapture) {
          inDom.unbind('losecapture', _dragEvent.end);
        } else {
          _$window.unbind('blur', _dragEvent.end);
        }
      }

      if (_isSetCapture) {
        inDom[0].releaseCapture();
      }


      if (_isIE6) {
        var style = inDom[0].style;
        style.removeExpression('left');
        style.removeExpression('top');
        style.position = 'absolute';
      }
      _fnEnds[inDom[0].id] && _fnEnds[inDom[0].id]();
    };
    _dragEvent.start(event);
  };
  _$document.mousedown(function(event) {
    var id = event.target.id;
    if (!id) return;
    if (_events[id]) {
      _use(event, _events[id]);
      return false;
    }
  });

  function dialog(c) {
    var defaults = {
      'host': null,
      'width': false,
      'height': false,
      'nohide': true
    };
    this.options = $.extend(defaults, c);
  }
  dialog.uuid = 0;
  dialog.prototype = {
    open: function() {
      var _self = this;
      var opt = this.options;
      var blockID = opt.blockID;
      if (!this.options.blockID) {
        blockID = opt.blockID = $.block.open(opt.nohide);
        if ($.isFunction(opt.blkClose)) {
          $('#' + blockID).on('click', opt.blkClose);
        }
      } else {
        $.block.reOpen(opt.blockID, opt.nohide);
      }
      var block = $('#' + blockID);
      var winDiv;
      if (!opt.winid) {
        $(document.body).append($('<div class="mzdialog" id="mzdialog' + (dialog.uuid += 1) + '"></div>').append(this.options.host));
        this.options.winid = 'mzdialog' + dialog.uuid;
        winDiv = $('#' + this.options.winid);
        $.mzAddResize({
          'winDiv': winDiv,
          'blockID': blockID
        }, function(data) {
          var block = $('#' + data.blockID),
            w = data.winDiv.width(),
            h = data.winDiv.height();
          data.winDiv.css({
            'left': ((($(document).width() - w > 0 ? $(document).width() - w : 1)) / 2 + 'px'),
            'top': ((($(window).height() - h > 0 ? $(window).height() - h : 1)) / 2 + block.data('sTop') + 'px')
          });
        });
      } else {
        winDiv = $('#' + this.options.winid);
      }
      var style = {
        'width': opt.width,
        'height': opt.height,
        'zIndex': ($.meizu.zindex += 1),
        'position': 'absolute',
        'left': ((($(document).width() - opt.width > 0 ? $(document).width() - opt.width : 1)) / 2 + 'px'),
        'top': ((($(window).height() - opt.height > 0 ? $(window).height() - opt.height : 1)) / 2 + block.data('sTop') + 'px')
      };
      winDiv.css(style).show();
    },
    resize: function(w, h) {
      var winDiv = $('#' + this.options.winid),
        block = $('#' + this.options.blockID);
      var style = {
        'width': w,
        'height': h,
        'left': ((($(document).width() - w > 0 ? $(document).width() - w : 1)) / 2 + 'px'),
        'top': ((($(window).height() - h > 0 ? $(window).height() - h : 1)) / 2 + block.data('sTop') + 'px')
      };
      winDiv.css(style).show();
    },
    close: function() {
      $.block.close(this.options.blockID);
      $('#' + this.options.winid).hide();
    }
  };

  $.fn.extend({
    'mousewheel': function(Func) {
      return this.each(function() {
        var _self = this;
        _self.D = 0;
        if ($.browser.msie || $.browser.safari) {
          _self.onmousewheel = function() {
            if (!!navigator.userAgent.match(/Trident\/7\./)) {
              event.preventDefault();
            }
            _self.D = event.wheelDelta;
            event.returnValue = false;
            Func && Func.call(_self, event.clientX, event.clientY);
          };
        } else {
          _self.addEventListener("DOMMouseScroll", function(e) {
            _self.D = e.detail > 0 ? -1 : 1;
            e.preventDefault();
            Func && Func.call(_self, e.clientX, e.clientY);
          }, false);
        }
      });
    },
    'mzDialog': function(c) {
      c = $.extend({}, c, {
        host: $(this)
      });
      return new dialog(c);
    },
    'addDragEvent': function(sfn, mfn, efn) {
      _fnMoves[this[0].id] = mfn ? mfn : null;
      _fnEnds[this[0].id] = efn ? efn : null;
      _fnStarts[this[0].id] = sfn ? sfn : null;
      _events[this[0].id] = $(this);
    },
    'delDragEvent': function() {
      if (_events[this[0].id]) {
        _events[this[0].id] = null;
        _fnMoves[this[0].id] = null;
        _fnEnds[this[0].id] = null;
        _fnStarts[this[0].id] = null;
      }
    }
  });
})(jQuery);
//初始化Video配置信息
jQuery(function() {
  P.init();
  V.init();
  $(window.document).bind('keydown', function(e) {
    e = (e) ? e : window.event;
    if (27 == e.keyCode) {
      V._close();
      P._close();
    }
  });
});

V = {
  'flash': 0,
  'flashVer': 0,
  'video': 0,
  'videoType': {
    'mp4': false,
    'webm': false
  },
  _$player: null,
  'firstOpen': 0,
  _canPlay: false,
  _flashLoaded: function() {
    V._loadedAfter();
  },
  _loadedBefore: function() {
    var t = $('#vBeforeScreen');
    if (!t[0]) {
      var html =
        '<div style="position: absolute;left: 0px;top: 0px;z-index: 2;height:' + Page.videoAddr.wh.h + 'px;width:' + Page.videoAddr.wh.w + 'px;background-color: #E2E2E2;" id="vBeforeScreen">' +
        '<div style="height: 35px;width: 35px;margin: 0px auto;margin-top: ' + ((Page.videoAddr.wh.h - 35) / 2) + 'px;"><img src="' + Page.waitimg + '"/></div>' +
        '</div>';
      V._$player.append(html);
      if (V._noWait) {
        $('#vBeforeScreen').hide();
      }
      if (V._canNotPlay) {
        var thtml = '<a target="_blank" href="' + Page.videoAddr.m9flashappaddr + '"><img src="http://wwwimages.adobe.com/www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="获得 Adobe Flash Player" /></a>';
          
        $($('#vBeforeScreen').find('div')[0]).css({
          'width': '100px'
        }).html(thtml);
      }
    } else {
      if (!V._canPlay) {
        t.show();
      }
    }

  },
  _loadedAfter: function() {
    V._canPlay = true;
    $('#vBeforeScreen').hide();
  },
  init: function() {
    if (!window['Page'] || !Page.videoAddr)
      return;
    var ua = navigator.userAgent;
    V._sup = {
      'mz': (/Android/.test(ua) && /M9|M030|M031|M032|M040/.test(ua)),
      'm9': (/Android/.test(ua) && /M9/.test(ua)),
      'isSafari': (/\bchrome\b/.test(ua) && /safari/.test(ua)),
      'isiPad': /iPad/.test(ua)
    };
    var vdom = document.createElement('video');
    if (vdom.canPlayType) {
      V.video = true;
      var mp4 = vdom.canPlayType('video/mp4');
      if ((mp4 == 'probably') || (mp4 == 'maybe')) {
        V.videoType.mp4 = true;
      }
      var webm = vdom.canPlayType('video/webm');
      if ((webm == 'probably') || (webm == 'maybe')) {
        V.videoType.webm = true;
      }
    }
    if (document.all) {
      try{
        var swf = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
        if (swf) {
          V.flash = true;
          var VSwf = swf.GetVariable("$version");
          V.flashVer = parseInt(VSwf.split(" ")[1].split(",")[0]);
        }
      }catch(e){
        V._canNotPlay=true;
      }
      
    } else {
      try{

        if (navigator.plugins && navigator.plugins.length > 0) {
          var swf = navigator.plugins["Shockwave Flash"];
          if (swf) {
            V.flash = true;
            var words = swf.description.split(" ");
            for (var i = 0; i < words.length; ++i) {
              if (isNaN(parseInt(words[i]))) continue;
              V.flashVer = parseInt(words[i]);
            }
          }
        }
      }catch(e){
        V._canNotPlay=true;
      }
    }
    V._$player = $('#vPlayer');
    $('#vBtn').click(V.open);
    window['flashPlayClose'] = V._close; //flash关闭
    //flash/html5关闭
  },
  _close: function() {

    V._$vBtn && V._$vBtn.show();
    V._$video && V._$video[0].pause();
    V._JPanel && V._JPanel.close();
    if (V.flash) {
      try {
        $('#myvideo')[0].flashClose();
      } catch (E) {}
    }
    //返回flash调用视频地址
  },
  getFlashAddres: function() {
    if (V._sup.m9) {
      return Page['videoAddr']['m9flv'];
    }
    return Page['videoAddr']['flv'];
  },
  getFlashWH: function() {
    return Page['videoAddr']['wh'];
  },
  _noWait: false,
  _canNotPlay: false,
  open: function() {
    if (!V.firstOpen) {

      if (V.video ) {
        if (V._sup.isiPad) {
          V._noWait = true;
        }
        V.createVideo();
      } else if (V.flash) {
        V.createFlash();
      } else if (V.video) {
        if (V._sup.m9) {
          V._canNotPlay = true;
        } else {
          V.createVideo();
        }
      } else {
        V._canNotPlay = true;
      }
      V.firstOpen = true;
      V._JPanel = V._$player.mzDialog({
        'width': Page.videoAddr.wh.w,
        'height': Page.videoAddr.wh.h,
        'blkClose': window['V']._close
      });
    }
    V._JPanel.open();
    V._loadedBefore();
  },
  createFlash: function() {
    var w = Page.videoAddr.wh.w,
      h = Page.videoAddr.wh.h;
    var flash = '';
    var ie11 = !!navigator.userAgent.match(/Trident\/7\./);
    if (!$.browser.msie || ie11) {
      flash = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="' + w + '" height="' + h + '" align="middle" id="0.2975120947230607">' +
        '<param name="quality" value="high">' +
        '<param name="bgcolor" value="#000000">' +
        '<param name="play" value="false">' +
        '<param name="loop" value="true">' +
        '<param name="wmode" value="transparent">' +
        '<param name="scale" value="showall">' +
        '<param name="base" value=".">' +
        '<param name="menu" value="true">' +
        '<param name="devicefont" value="false">' +
        '<param name="salign" value="">' +
        '<param name="allowScriptAccess" value="always">' +
        '<param name="swLiveConnect" value="true">' +
        '<embed id="myvideo" name="myvideo" src="' + Page.videoAddr.swf + '" quality="high" width="' + w + '" height="' + h + '" align="middle" wmode="transparent" allowscriptaccess="always" type="application/x-shockwave-flash">' +
        '</object>';
    } else {
      flash = '<object id="myvideo" name="myvideo" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="' + w + '" height="' + h + '" align="middle">' +
        '<param name="movie" value="' + Page.videoAddr.swf + '" />' +
        '<param name="quality" value="high" />' +
        '<param name="bgcolor" value="#000000" />' +
        '<param name="play" value="true" />' +
        '<param name="loop" value="true" />' +
        '<param name="wmode" value="transparent">' +
        '<param name="wmode" value="gpu" />' +
        '<param name="scale" value="showall" />' +
        '<param name="menu" value="true" />' +
        '<param name="devicefont" value="false" />' +
        '<param name="salign" value="" />' +
        '<param name="allowScriptAccess" value="always" />' +
        '<a href="http://www.adobe.com/go/getflash">' +
        '<img src="http://wwwimages.adobe.com/www.adobe.com/images/shared/download_buttons/get_flash_player.gif" alt="获得 Adobe Flash Player" />' +
        '</a>' +
        '</object>';
    }
    V._$player.html(flash);
  },
  createVideo: function() {
    if (V.videoType.mp4 || V.videoType.webm) {
      var w = Page.videoAddr.wh.w,
        h = Page.videoAddr.wh.h;

      var video = (Page.videoAddr.mp4 ? '<source src="' + Page.videoAddr.mp4 + '" type="video/mp4"/>' : '') + (Page.videoAddr.webm ? '<source src="' + Page.videoAddr.webm + '" type="video/webm"/>' : '');

      var videoElement = document.createElement('video');
      videoElement.id = "myvideo";
      videoElement.width = w;
      videoElement.height = h;
      videoElement.controls = true;
      videoElement.loop = true;
      videoElement.innerHTML = video;
      videoElement.load();
      videoElement.play();
      V._$player.css({
        'width': w + 'px',
        'height': h + 'px'
      });
      V._$player.css({
        'width': w + 'px',
        'height': h + 'px'
      });
      var Hvideo =
        '<div id="videoContr">' +
        '<div id="VideoControl">' +
        '<div id="vProcc">' +
        '<div id="proccBg" class="opac3"></div>' +
        '<div id="cacheBg" class="opac5"></div>' +
        '<div id="vBar"></div>' +
        '</div>' +
        '<div class="VideoBg" id="vSpot"></div>' +
        '<div class="opac0" id="vTrack"></div>' +
        '<div id="videoBottom" class="opac5"></div>' +
        '<div id="videoBottom1">' +
        '<div id="videoBottom2">' +
        '<div class="fl" id="vTimezone"><span id="vCurTime"></span><span>/</span><span id="vAllTime"></span></div>' +
        '<div class="VideoBg VStart" id="vSS"></div>' +
        '<div id="vVolume">' +
        '<div id="volBg" class="opac3"></div>' +
        '<div id="vBar2"></div>' +
        '<div id="vSpot2" class="VideoBg"></div>' +
        '</div>' +
        '<div class="VideoBg" id="vLaba"></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
      V._$player.append(videoElement);
      V._$player.append(Hvideo);
      V._initEvent();
    } else {
      alert('do not support video play!');
    }
  },
  htmlTime: function(t) {
    var f = parseInt(t / 60),
      m = t % 60;
    m < 10 && (m = (m == 0) ? '00' : ('0' + m));
    f < 10 && (f = (f == 0) ? '00' : ('0' + f));
    return f + ':' + m;
  },
  _$videoContr: null,
  _time: 0,
  _drag1: false,
  _drag2: false,
  _w: Page.videoAddr.wh.w,
  _h: Page.videoAddr.wh.h,
  _time1: 0,
  _process: 0,
  _maxPlayTime: 0,
  _getDrag: function(i) {
    return i == 1 ? V._drag1 : V._drag2;
  },
  _setDrag: function(i, bool) {
    i == 1 ? (V._drag1 = bool) : (V._drag2 = bool);
  },
  _sSpot: function() {
    if (V._$vProcc.data('tid')) {
      clearTimeout(V._$vProcc.data('tid'));
      V._$vProcc.data('tid', 0);
    }
    V._$vProcc.data('_on', true);
    V._$Spot.show();
  },
  _hSpot: function() {
    if (!V._$vProcc.data('_on'))
      return;
    if (V._$vProcc.data('_on')) {
      clearTimeout(V._$vProcc.data('tid'));
      V._$vProcc.data('tid', 0);
    }
    V._$vProcc.data('tid', setTimeout(function() {
      if (V._$vProcc.data('_on')) {
        V._$Spot.hide();
        V._$vProcc.data('_on', false);
      }
    }, 1000));
  },
  _sContr: function() {
    V._$videoContr.data('noin', false);
    V._$videoContr.show();
  },
  _hContr: function() {
    V._$videoContr.data('noin', true);
    if (V._time1) {
      clearTimeout(V._time1);
    }
    V._time1 = setTimeout(function() {
      if (V._$videoContr.data('noin')) {
        V._$videoContr.hide();
        if (V._$vProcc.data('_on')) {
          clearTimeout(V._$vProcc.data('tid'));
          V._$vProcc.data('tid', 0);
          V._$Spot.hide();
          V._$vProcc.data('_on', false);
        }
      }
    }, 3000);
  },
  _initEvent: function() {
    var karr = '_$videoContr,_$curTime,_$bar,_$bar2,_$vBtn,_$Spot,_$Spot2,_$allTime,_$video,_$vSS,_$vCBG,_$vTZ,_$vProcc,_$vTrack'.split(',');
    var varr = 'videoContr,vCurTime,vBar,vBar2,vBtn,vSpot,vSpot2,vAllTime,myvideo,vSS,cacheBg,vTimezone,vProcc,vTrack'.split(',');
    for (var i = 0, j = karr.length; i < j; i++) {
      V[karr[i]] = $('#' + varr[i]);
    }
    V._$vSS.click(function() {
      var jobj = $(this);
      if (jobj.hasClass('VStart')) {
        jobj.removeClass('VStart').addClass('VPauls');
        V._$video[0].play();
      } else {
        jobj.removeClass('VPauls').addClass('VStart');
        V._$video[0].pause();
      }
    });
    var timeupdate = function() {
        var c = (Math.floor(this.currentTime) / V._time) * V._w;
        V._$bar.width(c + 'px');
        if (!V._getDrag(1)) {
          V._$Spot.css('left', c - 25 + 'px');
        }
        if(!this.currentTime)return;
        V._$curTime.html(V.htmlTime(Math.floor(this.currentTime)));
        V._time = Math.floor(this.duration);
        V._$allTime.html(V.htmlTime(V._time));
      },
      playing = function() {
        V._$vSS.removeClass('VStart').addClass('VPauls');
      },
      loadedmetadata = function() {
        V._loadedAfter();
        V._$vTZ.show();
        this.play();
      },
      volumeCtrl = function(x) {
        V._$bar2.width(x + 'px');
        V._$Spot2.css('left', x - 5 + 'px');
        V._$video[0]['volume'] = x / 95;
      },
      progress = function() {
        var v = V._$video[0];
        var r = v.buffered;
        if (r) {
          for (var i = 0; i < r.length; i++) {
            var ct = parseInt(r.end(i));
            if (ct > V._maxPlayTime) {
              V._maxPlayTime = ct;
              V._$vCBG.width((V._w * ct / Math.floor(this.duration)) + 'px');
            }
          }
        }
      },
      pause = function() {
        V._$vSS.removeClass('VPauls').addClass('VStart');
      },
      loadstart = function() {},
      play = function() {},
      error = function(err) {

      };
    V._$player.mouseover(V._sContr).mouseout(V._hContr);
    V._$vTrack.mouseover(V._sSpot).mouseout(V._hSpot).click(function(e) {
      var t = ((e.clientX - $(this).offset().left) / V._w) * V._$video[0].duration;
      V._$video[0].currentTime = t;
      timeupdate();
    });
    V._$Spot.mouseover(V._sSpot).mouseout(V._hSpot);
    V._$video.on('timeupdate', timeupdate)
      .on('playing', playing)
      .on('progress', progress)
      .on('loadedmetadata', loadedmetadata)
      .on('pause', pause)
      .on('play', play)
      .on('error', error)
      .on('loadstart', loadstart);
    V._$video.removeAttr('controls');
    volumeCtrl(50);
    V._$Spot.data('limit', {
      'minX': -25,
      'minY': 0,
      'maxX': (V._w - 25),
      'maxY': 0
    })
      .addDragEvent(function() {
        V._setDrag(1, true);
      }, null, function() {
        if (V._time) {
          var p1 = V._$Spot.css('left');
          var t = 1 * V._time * (p1.substr(0, p1.length - 2) - 0 + 25) / V._w;
          V._$video[0].currentTime = t;
          timeupdate.call(V._$video[0]);
        }
        V._setDrag(1, false);
      });
    V._$Spot2.data('limit', {
      'minX': 0,
      'minY': 20,
      'maxX': 95,
      'maxY': 20
    }).addDragEvent(null, volumeCtrl, null);
    V._$vSS.css('left', (parseInt(V._w / 2 - 25) + 'px')).show();
  }
};
P = {
  _$win: $(window),
  _$store: {
    'cache1': 0 //大图打开时的信息，包括高宽，是否通过点击小图打开，已经在小图的顺序
  }
  //获取图片显示高宽、位置
  ,
  _getConwh: function(img, rate, winw, winh) {
    var w, h, l, t;
    if (img.width > img.height) {
      w = 950 > img.width ? img.width : 950;
      h = parseInt(w * rate);
    } else {
      h = 670 > img.height ? img.height : 670;
      w = parseInt(h / rate);
    }
    l = ((winw - w > 0 ? winw - w : 1)) / 2,
    t = ((winh - h - 70 > 0 ? winh - h - 70 : 1)) / 2 + Math.max($(document).scrollTop(), $('body').scrollTop());
    return {
      'w': w,
      'h': h,
      'l': l,
      't': t
    };
  },
  _blkid: null
  //导航小图点击响应处理方法
  ,
  _clkFn: function(event, noAnimate) {
    if (!P._blkid) {
      P._blkid = $.block.open(true);
      $('#' + P._blkid).on('click', P._close);
    } else {
      $.block.reOpen(P._blkid, true);
    }
    P._$imgConta.data('openId', this.id);
    var img = Page.images[this.id],
      rate = img.height / img.width,
      o = P._getConwh(img, rate, P._$win.width(), P._$win.height()),
      left = o.l,
      top = o.t,
      cw = o.w,
      ch = o.h,
      finsh = function(img, cw, ch, left, top, first) {
        P._$contaBlk.css({
          'left': left + 10,
          'top': top + 10,
          'height': ch,
          'width': cw
        }).show();
        P._$imgBlk.show();
        P._$imgWait.css({
          'left': (left + cw / 2 - 45 + 'px'),
          'top': (top + ch / 2 - 12 + 'px')
        }).html('loading ...').show();
        P._$navBtnConta.css({
          'left': left - 20 + cw / 2,
          'top': top + 50 + ch
        }).show();
        P._$store.cache1 = {
          'order': img.order,
          'cw': cw,
          'ch': ch,
          'first': first
        };
        P._$imgCur.data('limit', {
          'minX': 0,
          'minY': 0,
          'maxX': 0,
          'maxY': 0
        })
          .css({
            'width': cw + 'px',
            'height': ch + 'px',
            'left': '0px',
            'top': '0px'
          })
          .show();
        if (!P._$imgCur.attr('src')) { //该图片未加载
          P._$imgCur.attr('src', img['src']);
        } else { //该图片已加载
          P._imgLoaded();
        }
        var oset = P._$conta.offset();
        oset.top = oset.top - Math.max($(document).scrollTop(), $('body').scrollTop());
        P._$conta.data('oset', oset)
          .data('step', parseInt((cw > ch ? (img.width - cw) : (img.height - ch)) / 4));
      };
    P._$conta.data('img', img)
      .data('rate', rate)
      .data('cachewh', {
        'w': cw,
        'h': ch
      })
      .data('conwh', {
        'w': cw,
        'h': ch
      })
      .show();
    var per = ((ch / img.height) * 100 + '').substr(0, 5) - 0.0;
    P._$imgConta.data('minZoom', per);
    P._$imgCur && P._$imgCur.hide();
    P._$imgCur = $(P._$imgConta.find('img')[img.order - 1]);
    if (noAnimate) {
      P._$conta.css({
        'left': left,
        'top': top,
        'height': ch,
        'width': cw
      });
      finsh(img, cw, ch, left, top, false);
    } else {
      P._$conta.css({
        'left': parseInt(left + left / 2),
        'top': parseInt(top + top / 2)
      })
        .animate({
          'left': left,
          'top': top,
          'height': ch,
          'width': cw
        }, {
          'easing': 'swing',
          'duration': 300,
          'complete': function() {
            finsh(img, cw, ch, left, top, true);
          }
        });
    }
  }
  //大图下载完后处理方法
  ,
  _imgLoaded: function() {
    P._$contaBlk.hide();
    P._$imgBlk.hide();
    P._$navBtnConta.hide();
    P._$imgWait.hide();
    var c = P._$store.cache1,
      cw = c.cw,
      ch = c.ch,
      order = c.order,
      first = c.first;
    if (first) {
      var imgw = P._$imgTip.width(),
        imgh = P._$imgTip.height();
      P._$imgTip.css({
        'left': ((cw - imgw) / 2 + 'px'),
        'top': ((ch - imgh) / 2 + 'px')
      }).show();
      setTimeout(function() {
        P._$imgTip.hide();
      }, 3000);
    }
    P._$navBtnConta.show();
    P._$navLeft.show();
    P._$navRight.show();
    var len = $("#daili .img_source").length;
    if (order < len && order > 1) {
      P._$navRight.addClass('R_Y').removeClass('R_N');
      P._$navLeft.addClass('L_Y').removeClass('L_N');
    } else if (order == 1) {
      P._$navRight.addClass('R_Y').removeClass('R_N');
      P._$navLeft.addClass('L_N').removeClass('L_Y');
    } else {
      P._$navRight.addClass('R_N').removeClass('R_Y');
      P._$navLeft.addClass('L_Y').removeClass('L_N');
    }
  },
  _close: function() {
    if (!P._blkid) {
      return;
    }
    P._$conta.css({
      'width': '0px',
      'height': '0px'
    }).hide().data('img', null);
    $.block.close(P._blkid);
    P._$contaBlk.hide();
    P._$imgWait.hide();
    P._$imgTip.hide();
    P._$navBtnConta.hide();
  },
  _clkFn2: function(cha) {
    var curid = '_clkImg' + (Page.images[P._$imgConta.data('openId')].order + cha);
    var img = Page[curid];
    P._$imgTip.hide();
    P._clkFn.call($('#' + curid)[0], null, true);
  },
  _timeOutId: null,
  _atomScroll: function() {
    if (P._timeOutId)
      clearTimeout(P._timeOutId);
    P._isMove = true;
    var atom = P._touchCache(1);
    if (!atom) {
      P._isMove = false;
      return;
    }
    P._$imgCur.animate({
      'width': atom.w,
      'height': atom.h,
      'top': atom.T,
      'left': atom.L
    }, {
      'easing': 'linear',
      'duration': 300,
      'complete': function() {
        var min = P._$imgConta.data('minZoom'),
          per = ((atom.h / atom.mh) * 100 + '').substr(0, 5) - 0.0;
        if (per > min) {
          P._$imgCur.attr('class', 'handCur');
        } else {
          P._$imgCur.attr('class', 'defuCur');
        }
        if (P._aniCache.length != 0) {
          while (P._aniCache.length != 0) {
            P._atomScroll();
          }
        } else {
          P._isMove = false;
          P._timeOutId = setTimeout(function() {
            if (!P._isMove) {
              P._$imgWait.removeClass('wait2').addClass('wait1').hide();
            }
          }, 500);
        }
      },
      'step': function(i, b) {
        if (b.prop === 'height') {
          P._$imgWait.html(((i / atom.mh) * 100 + '').substr(0, 5) + ' %');
        }
      }
    });
  },
  _aniCache: [],
  _isMove: false,
  _touchCache: function(oper, atom) {
    if (oper === 1) {
      var len = P._aniCache.length;
      var ret = $.extend({}, P._aniCache[len - 1], {
        'len': len
      });
      P._aniCache = [];
      return ret;
    } else if (oper === 2) {
      return P._aniCache.length;
    } else if (oper === 4) {
      P._aniCache = [atom];
    }
  },
  _toNum: function(str) {
    return str.substring(0, str.indexOf('p')) - 0;
  },
  _getWH: function(x, mx, step, rate, delta, cx, isW) {
    if (delta > 0 && x < mx) {
      if (x + step < mx) {
        x += step;
      } else {
        x = mx;
      }
    } else if (delta < 0 && x >= cx) {
      if (x - step > cx) {
        x -= step;
      } else {
        x = cx;
      }
    }
    if (isW) {
      return {
        'w': x,
        'h': parseInt(x * rate)
      };
    } else {
      return {
        'h': x,
        'w': parseInt(x / rate)
      };
    }
  },
  init: function() {
    if (!window['Page'] || !Page.images)
      return;
    $.extend(P, {
      _$conta: $('#Img_conta') //浏览的大图最外层元素
      ,
      _$contaBlk: $('#Img_conta_block') //加载图片时的遮蔽元素
      ,
      _$imgBlk: $('#ImgBlk') //等待进度条
      ,
      _$imgConta: $('#Img_show') //大图显示的容器
      ,
      _$imgCur: null //当前打开的图片
      ,
      _$imgWait: $('#ImgWait') //等待进度条
      ,
      _$imgTip: $('#ImgTip') //打开时显示的提示信息所在的元素
      ,
      _$navBtnConta: $('#ImgNavbtn') //导航按钮容器对象
      ,
      _$navRight: $('#ImgNavbtnRight') //向右导航按钮
      ,
      _$navLeft: $('#ImgNavbtnLeft') //向左导航按钮
    });
    //小图点击处理
    $('#daili .img_source').live('click', P._clkFn);
    //取前一张图片
    P._$navRight.click(function() {
      if (!$(this).hasClass('R_N')) P._clkFn2(1);
    });
    //取后一张图片
    P._$navLeft.click(function() {
      if (!$(this).hasClass('L_N')) P._clkFn2(-1);
    });
    //添加拖动事件
    P._$imgConta.find('img').each(function() {
      $(this).bind('load', P._imgLoaded).addDragEvent();
    });
    //窗口重置处理
    P._$win.resize(function() {
      if (!P._$conta.data('img')) return;
      var o = P._getConwh(P._$conta.data('img'), P._$conta.data('rate'), P._$win.width(), P._$win.height()),
        l = o.l,
        t = o.t,
        w = o.w,
        h = o.h;
      P._$conta.css({
        'left': (l + 'px'),
        'top': (t + 'px')
      });
      P._$contaBlk.css({
        'left': l + 10,
        'top': t + 10,
        'height': h,
        'width': w
      });
      P._$navBtnConta.css({
        'left': l - 20 + w / 2,
        'top': t + 50 + h
      });
      P._$imgWait.css({
        'left': (l + w / 2 - 45 + 'px'),
        'top': (t + h / 2 - 12 + 'px')
      });
      P._$conta.data('oset', P._$conta.offset());
    });
    //鼠标滑轮 opera不支持
    P._$conta.mousewheel(function(x, y) {
      var wh = P._$conta.data('cachewh'),
        conwh = P._$conta.data('conwh'),
        oset = P._$conta.data('oset'),
        step = P._$conta.data('step'),
        img = P._$conta.data('img'),
        mh = img.height,
        mw = img.width,
        rate = P._$conta.data('rate'),
        delta = this.D;
      var whobj;
      if (mw > mh)
        whobj = P._getWH(wh.w, mw, step, rate, delta, conwh.w, true);
      else
        whobj = P._getWH(wh.h, mh, step, rate, delta, conwh.h, false);
      wh.w = whobj.w;
      wh.h = whobj.h;

      P._$conta.data('cachewh', {
        'w': wh.w,
        'h': wh.h
      });
      P._$imgTip.hide();
      P._$imgWait.removeClass('wait1').addClass('wait2').show();
      var limit = {
        'minX': (conwh.w > wh.w ? 0 : -(wh.w - conwh.w)),
        'minY': (conwh.h > wh.h ? 0 : -(wh.h - conwh.h)),
        'maxX': 0,
        'maxY': 0
      };
      if (P._touchCache(2) < 5) {
        var style = P._$imgCur[0].style;
        var eL = P._toNum(style.left),
          eT = P._toNum(style.top),
          eW = P._toNum(style.width),
          eH = P._toNum(style.height),
          L, T;
        //console.log('eL='+eL+',eT='+eT+',eW='+eW+',eH='+eH+',x='+x+',y='+y+',wh.w='+wh.w+',wh.h='+wh.h+',maxX='+limit.maxX+',maxY='+limit.maxY+',minX='+limit.minX+',minY='+limit.minY);
        //转换clientY，clientX为定位坐标系
        x = x - oset.left;
        y = y - oset.top;
        if ((x < eL + eW) && (x > eL) && (y < eT + eH) && (y > eT)) {
          //鼠标点缩放
          L = eL + (x - eL) * (eW - wh.w) / eW;
          T = eT + (y - eT) * (eH - wh.h) / eH;
        } else {
          //居中缩放
          L = eL + (eW - wh.w) / 2;
          T = eT + (eH - wh.h) / 2;
        }
        //边界溢出处理
        L > limit.maxX && (L = limit.maxX);
        L < limit.minX && (L = limit.minX);
        T > limit.maxY && (T = limit.maxY);
        T < limit.minY && (T = limit.minY);
        P._touchCache(4, {
          'w': wh.w,
          'h': wh.h,
          'mh': mh,
          'L': L,
          'T': T
        });
      }
      P._$imgCur.data('limit', limit);
      if (!P._isMove) {
        P._atomScroll();
      }
    });
  }
};