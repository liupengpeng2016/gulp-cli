(function (win, doc) {
  function setHtmlFont () {
    var clientW = win.innerWidth;
    doc.querySelector('html').style.fontSize = clientW + 'px';
  }
  doc.querySelector('body').style.fontSize = 'medium';
  setHtmlFont();
  win.onresize = setHtmlFont;
})(window, document);
