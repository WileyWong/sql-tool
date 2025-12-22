(function (win) {
    const doc = win.document;
    const html = doc.documentElement;
    const option = html.getAttribute('data-use-rem');
    if (option === null) return;
    // defaut 750px；
    const baseWidth = option === 'default' || option === '' || parseInt(option) <= 0 ? 750 : parseInt(option);
    const grids = baseWidth / 100;
    const resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize';
    const recalc = function () {
      const clientWidth = html.clientWidth || 375; // default to 375 if can't get device-width
      html.style.fontSize = `${clientWidth / grids}px`;
    };
    // Abort if browser does not support addEventListener
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();
  }(window));
  