$(function(){
  FastClick.attach(document.body);
  //获取广告
  function getAd (callback) {
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: '//guess.union2.50bang.org/adsapi/v1',
      data: {
        reqid: getRandom(32),
        adsenseid: queryObj.adsenseid,
        url: dealUrl(location.href),
        userAgent: navigator.userAgent,
        width: window.innerWidth,
        height: window.innerHeight,
        aeid: queryObj.aeid,
        times: originCount - count + 1,
      },
      jsonp: 'jsonp',
      success: function (res) {
        ad_data = res;
        callback();
        //save result
        prize_list = prize_list.concat(res.adlist);
        console.log(prize_list)
        sessionStorage.setItem('prize_list', JSON.stringify(prize_list));
      },
      error: function(){
        cover.show();
        layer_nonetwork.show();
      }
    })
  }
  //外部广告上报
  function outerAdReport(type, evt) {
    function getAllAdPid (num) {
      var ad_ids = [];
      if(num !== undefined) {
        ad_ids = [ad_data.adlist[num].adsenseid];
      } else {
        ad_data.adlist.forEach(function (val) {
          ad_ids.push(val.adsenseid);
        })
      }
      return ad_ids.join('|');
    }
    function getAllAdid (num) {
      var ad_ids = [];
      if(num !== undefined) {
        ad_ids = [ad_data.adlist[num].adid + ':' + ++ ad_index];
      } else {
        ad_data.adlist.forEach(function (val) {
          ad_ids.push(val.adid + ':' + ++ ad_index);
        })
      }
      return ad_ids.join('|');
    }
    function getPvr() {
      var char = String.fromCharCode(parseInt(Math.random() * 26 + 97));
      var num = parseInt(Math.random() * 10);
      return char + num;
    }
    var data;
    if(type === 'show') {
      data = {
        type: 1,
        r: dealUrl(location.href),
        f: window.innerWidth + '*' + window.innerHeight,
        bidid: ad_data.bidid,
        i: getAllAdPid(0),
        ads: getAllAdid(0),
        isFirst: 1,
        loadcost: Date.now() - open_doc_time,
        e: ad_data.test || 0,
        q: ad_data.test || '',
        f0: ad_data.test || 0,
        pvr: getPvr(),
        ext: {
          aeid: queryObj.aeid,
        }

      }
    } else if(type === 'click'){
      data = {
        type: 2,
        r: dealUrl(location.href),
        f: window.innerWidth + '*' + window.innerHeight,
        bidid: ad_data.bidid,
        umd5: ad_data.adlist[0].md5,
        adid: ad_data.adlist[0].adid,
        d: ad_index,
        m: Date.now() - open_doc_time,
        p: ad_position,
        s: parseInt(evt.screenX) + '*' + parseInt(evt.screenY),
        e: ad_data.test || 0,
        q: ad_data.test || '',
        f0: ad_data.test || 0,
        pvr: getPvr(),
        ext: {
          aeid: queryObj.aeid,
        }

      }
    } else if(type === 'load') {
      data = {
        type: 4,
        aeid: queryObj.aeid || '',
        action: 'show'
      }
    }
    $.ajax({
      type: 'post',
      url: '//guess.union2.50bang.org/trrs',
      data: {
        adsenseid: queryObj.adsenseid,
        user: {
          uid: queryObj.uid || '',//留空
        },
        site: {
          url: dealUrl(location.href),
          referer: dealUrl(window.refer),
        },
        app: {
          appid: queryObj.appid || '',
          packageName: queryObj.packageName || '',
        },
        device: {
          userAgent: navigator.userAgent,
          width: window.innerWidth,
          height: window.innerHeight,
          idfa: queryObj.idfa || '',
          imei: queryObj.imei || '',
          deviceType: queryObj.deviceType || '',
          brand: queryObj.brand || '',
          model: queryObj.model || '',
          os: queryObj.os || '',
          osv: queryObj.osv || '',
          network: queryObj.network || '',
          operator: queryObj.operator || '',
          orientation: queryObj.orientation || '',
          lon: queryObj.lon || '',
          lat: queryObj.lat || '',
        },
        data: data,
      }
    })

  }
  //内部广告展示上报
  function innerAdShowReport () {
    //lo处理
    var lO = [];
    ad_data.adlist.forEach(function(val, i) {
      lO.push(val.adid + ':' + ++ ad_index);
    })
    lO = lO.join('|');

    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: '//union2.50bang.org/web/ajax132',
      data: {
        uId2: 'SPTNPQRLSX',
        r: dealUrl(location.href),
        lO: lO,//'adid:广告位置'多个|分隔
        f: 1,
        l: Date.now() - open_doc_time,//加载用时
        i: channel_id,//渠道号
        e: ad_data.test || 0,//第一条广告test字段
        q: ad_data.q || 0,//同上
        f0: ad_data.f0 || -1,//同上
        aeid: queryObj.aeid,
      }
   })
 }
 //内部广告点击上报
  function innerAdClickReport(evt) {
    $.ajax({
      type: 'get',
      dataType: 'jsonp',
      url: ' //union2.50bang.org/web/ajax131',
      data: {
        uId2: 'SPTNPQRLSX',
        r: encodeURIComponent(location.href),
        lO: ad_data.adlist[0].md5,//广告的 md5 字段
        l: ad_data.adlist[0].adid,//广告的 ggid 字段
        f: screen.width + '*' + screen.height,//客户端分辨率
        d: ad_index,//广告出现的位置
        p: ad_position,//点击时广告的坐标
        m: Date.now() - open_doc_time,//页面已打开的时长
        s: parseInt(evt.screenX) + '*' + parseInt(evt.screenY),//点击时鼠标的坐标
        a: localStorage.getItem('localUid'),//localStorage.getItem(‘localUid’)
        i: channel_id,//渠道号
        e: ad_data.test || 0,//请求广告时得到的 test 字段
        q: ad_data.q,//q字段
        f0: ad_data.f0,//f0字段
        u: '',//不用iframe时留空
        hang: ad_data.flid || '',//flid字段
        aeid: queryObj.aeid || '' ,
      }
   })
  }
   //转盘转动开关
   function prizeRotating (isRotate) {
     if(isRotate) {
       prize.addClass('dial-prize-rotate');
     }else{
       prize.removeClass('dial-prize-rotate');
     }
   }
   //转盘重置
   function resetDial () {
     //prizeRotating(true);
     setTimeout(function(){
       prize.css({
         transform: 'rotate(0deg)',
         transitionDuration: '0s',
       })
     }, 50)
   }


   //功能函数
      //获取随机数字函数
   function getRandom(num) {
     var str = ''
     for(var i = 0; i < num; i++) {
       str += parseInt(Math.random() * 10, 10);
     }
     return str
   }
     //获取query
   function getQuery() {
     var search = location.search.slice(1).split('&');
     var queryObj = {};
     search.forEach(function(val, i) {
       var value = val.split('=');
       queryObj[value[0]] = value[1];
     })
     return queryObj;
   }
   //url 编码  截取
   function dealUrl(url) {
     var url = encodeURIComponent(url);
     return url.length > 500 ? url.slice(0, 500) : url;
   }


   //点击抽奖函数
   function handleLottery () {
     //判断动画是否结束
     if(!isTransitionEnd){
       return
     }
     //无次数显示弹层
     if(count <= 0) {
       cover.show();
      return layer_notimes.show();
     }
     //隐藏手势
     hand.hide();
     circle.hide();
     isTransitionEnd = false;
     //更改btn状态
     btn.addClass('dial-click-btn-active');
     //请求抽奖结果
     getAd(function () {
       //抽奖次数处理
       count = --count < 0 ? 0 : count;
       sessionStorage.setItem('lottery_count', count);
       times.text(count);

       //停止转盘转动
       prizeRotating(false);
       //处理抽奖结果
       prize.one('transitionend, webkitTransitionEnd', function() {
         setTimeout(showResult, 500);
       });
       //转动转盘
       setTimeout(function(){
         prize.css({
           transform: 'rotate(' + (ad_data.ext.angle + rotateRound * 360) + 'deg)',
           transitionDuration: '6s',
         })
       }, 50)
     })

   }
   //抽奖动画结束回调
   function showResult() {
     isTransitionEnd = true;
     //重置转盘
     resetDial();
     //恢复手势和按钮
     if(count != 0){
       hand.show();
       circle.show();
       btn.removeClass('dial-click-btn-active');
     }
     //显示弹层
     var result_name = ad_data.ext.btnTitle,
     result_url = ad_data.adlist[0].url,
     result_img = ad_data.adlist[0].attachlist[0];
     cover.show();
     //if(Math.random() > 0.5) {
    if(true){
       layer_one.find('.layer-one-prize-name').text(result_name);
       layer_one.find('.layer-one-ad>img').attr('src', result_img );
       layer_one.find('.layer-one-prize-btn').attr('data-url', result_url);
       layer_one.addClass('scale-1');
     } else {
        layer_two.find('.layer-two-prize-name').text(result_name);
        layer_two.find('.layer-two-ad>img').attr('src', result_img );
        layer_two.find('.layer-two-prize-btn').attr('data-url', result_url);
        layer_two.addClass('scale-1');
     }
     //上报广告展示
     if(!ad_data.adlist[0].dspid){
       innerAdShowReport();
     } else {
       outerAdReport('show')
     }

   }

  var dial = $('#dial'),
  originCount = 8,
  rotateRound = 6,
  count = sessionStorage.getItem('lottery_count') || originCount,
  hand = dial.find('.dial-hand'),
  btn = dial.find('.dial-click-btn'),
  loop = dial.find('.dial-loop'),
  circle = dial.find('.dial-circle'),
  times = $('#prize-count'),
  isTransitionEnd = true,
  layer_one = $('#layer-one'),
  layer_two = $('#layer-two'),
  layer_notimes = $('#layer-notimes'),
  layer_nonetwork = $('#layer-nonetwork'),
  layer_rules = $('#layer-rules'),
  prize = dial.find('.dial-prize'),
  cover = $('#cover'),
  prize_list = [],
  queryObj = getQuery(),
  open_doc_time = Date.now(),
  ad_data,
  ad_position,
  channel_id = '' || 'cu1000411',
  ad_index = 0;
  console.log(queryObj)
  //初始化抽奖次数
  times.text(count);
  //初始化手势和按钮
  if(count <= 0) {
    hand.hide();
    circle.hide();
    btn.addClass('dial-click-btn-active');
  }
  //初始化转盘灯
  setInterval(function() {
    loop.toggleClass('dial-loop-active');
  }, 1000)
  //初始化banner,背景,title
  if(queryObj.bannerImg) {
    $('#banner').css({
      backgroundImage: 'url(' + decodeURIComponent(queryObj.bannerImg) + ')',
    })
  }
  if(queryObj.bgColor) {
    $('body').css({
      backgroundColor: '#' + queryObj.bgColor,
    })
  }
  if(queryObj.title) {
    document.title = decodeURIComponent(queryObj.title);
  }
  //页面加载完成上报
  window.addEventListener('load', function(evt) {
    outerAdReport('load', evt);
  })
  //抽奖事件绑定
  btn.add(hand).on('click',handleLottery);
  //关闭弹层事件绑定
  var transitionendEvt;
  if('ontransitionend' in window){
    transitionendEvt = 'transitionend';
  } else if('onwebkitTransitionEnd' in window) {
    transitionendEvt = 'webkitTransitionEnd';
  } else if('onmozTransitionEnd' in window) {
    transitionendEvt = 'mozTransitionEnd';
  }

  layer_one.on('click', '.layer-one-close-btn', function(){
    cover.hide();
    layer_one.addClass('scale-0')
    .one(transitionendEvt, function(){
      $(this).removeClass('scale-0').removeClass('scale-1');
    })

  });
  layer_two.on('click', '.layer-two-close-btn', function(){
    cover.hide();
    layer_two.addClass('scale-0')
    .one(transitionendEvt, function(){
      $(this).removeClass('scale-0').removeClass('scale-1');
    })

  });
  layer_notimes.on('click', '.layer-notimes-close', function(){
    cover.hide();
    layer_notimes.hide();
  });
  layer_nonetwork.on('click', '.layer-nonetwork-close', function(){
    cover.hide();
    layer_nonetwork.hide();

  });
  $('#rules').on('click', function() {
    layer_rules.show();

  })
  layer_rules.on('click', '.layer-rules-close', function(){
    layer_rules.hide();
  })
  //弹层1点击广告事件绑定
  function laywer_one_click_ad (evt) {
    var offset = layer_one.find('.layer-one-ad').offset();
    ad_position = parseInt(offset.left) + '*' + parseInt(offset.top);
    if(!ad_data.adlist[0].dspid) {
      innerAdClickReport(evt);
    } else {
      outerAdReport('click', evt)
    }
    location.href = layer_one.find('.layer-one-prize-btn').attr('data-url');
  }
  layer_one.find('.layer-one-prize-btn').on('click', laywer_one_click_ad);
  layer_one.find('.layer-one-ad').on('click', laywer_one_click_ad);
  //弹层2点击广告事件绑定
  function layer_two_click_ad (evt) {
    var offset = layer_two.find('.layer-two-ad').offset();
    ad_position = parseInt(offset.left) + '*' + parseInt(offset.top);
    if(!ad_data.adlist[0].dspid) {
      innerAdClickReport(evt);
    } else {
      outerAdReport('click', evt)
    }
    location.href = layer_two.find('.layer-two-prize-btn').attr('data-url');
  }
  layer_two.find('.layer-two-prize-btn').on('click', layer_two_click_ad);
  layer_two.find('.layer-two-ad').on('click', layer_two_click_ad);

})
