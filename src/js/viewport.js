(function (win, doc) {
  function setHtmlFont () {
    var clientW = win.innerWidth;
    doc.querySelector('html').style.fontSize = clientW + 'px';
  }
  setHtmlFont();
  win.onresize = setHtmlFont;
})(window, document);