// 计算主色 #CD276E 的背景色值

function hexToHsl(hex) {
    var r = parseInt(hex.slice(0, 2), 16) / 255;
    var g = parseInt(hex.slice(2, 4), 16) / 255;
    var b = parseInt(hex.slice(4, 6), 16) / 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [h * 360, s * 100, l * 100];
}

function relativeLuminance(hex) {
    hex = hex.replace('#', '');
    var r = parseInt(hex.slice(0, 2), 16) / 255;
    var g = parseInt(hex.slice(2, 4), 16) / 255;
    var b = parseInt(hex.slice(4, 6), 16) / 255;
    var rs = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
    var gs = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
    var bs = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hslToHex(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    var r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        var hue = function (p, q, t) {
            if (t < 0) t += 1; if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };
        r = hue(p, q, h + 1 / 3);
        g = hue(p, q, h);
        b = hue(p, q, h - 1 / 3);
    }
    var toHex = function (x) {
        var n = Math.round(x * 255).toString(16);
        return n.length === 1 ? '0' + n : n;
    };
    return (toHex(r) + toHex(g) + toHex(b)).toUpperCase();
}

// 主色分析
var primaryHex = 'CD276E';
console.log('主色:', primaryHex);

// HSL值
var hsl = hexToHsl(primaryHex);
var h = hsl[0], s = hsl[1], l = hsl[2];
console.log('HSL:', 'h=' + h.toFixed(1) + '°, s=' + s.toFixed(1) + '%, l=' + l.toFixed(1) + '%');

// WCAG相对亮度
var primaryRL = relativeLuminance(primaryHex);
console.log('WCAG相对亮度:', primaryRL.toFixed(3));

// 分类判断
var isBright = primaryRL > 0.4;
var isDark = primaryRL < 0.12;
var isMedium = !isBright && !isDark;
console.log('分类:', isBright ? '亮色' : (isDark ? '暗色' : '中等亮度'));

// 深浅模式判断（auto模式）
var useLight = l > 50;
console.log('深浅模式:', useLight ? '浅色基调' : '深色基调');

// 背景色计算
var backL, backS;
if (useLight) {
    console.log('（不会进入浅色模式，因为 l=' + l.toFixed(1) + '<50）');
} else {
    if (isDark) {
        backL = Math.min(35, l + 15);
        backS = Math.min(s * 0.55, 20);
        console.log('暗主色策略');
    } else if (isMedium) {
        var targetL = l - Math.min(8, s * 0.08);
        backL = Math.max(15, Math.min(30, targetL));
        backS = Math.min(s * 0.45, 18);
        console.log('中等亮度策略');
        console.log('targetL:', targetL.toFixed(1));
    } else {
        backL = 12;
        backS = Math.min(s * 0.5, 15);
        console.log('其他策略');
    }
}

console.log('背景亮度 backL:', backL.toFixed(1));
console.log('背景饱和度 backS:', backS.toFixed(1));

var back = hslToHex(h, backS, backL);
console.log('\n最终背景色值:', back);