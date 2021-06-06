const startUrl = process.env.NWJS_START_URL || '../build/index.html';
const nw = global.nw;
nw.Window.open(startUrl, { }, function(win) {});