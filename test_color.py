#!/usr/bin/env python3
import math

def hex_to_hsl(hex_color):
    hex_color = hex_color.replace('#', '')
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    
    max_val = max(r, g, b)
    min_val = min(r, g, b)
    l = (max_val + min_val) / 2.0
    
    if max_val == min_val:
        h = s = 0.0
    else:
        d = max_val - min_val
        s = d / (2 - max_val - min_val) if l > 0.5 else d / (max_val + min_val)
        
        if max_val == r:
            h = (g - b) / d + (6.0 if g < b else 0.0)
        elif max_val == g:
            h = (b - r) / d + 2.0
        else:  # max_val == b
            h = (r - g) / d + 4.0
        h /= 6.0
    
    return h * 360, s * 100, l * 100

def relative_luminance(hex_color):
    hex_color = hex_color.replace('#', '')
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    
    def adjust(c):
        return c / 12.92 if c <= 0.03928 else math.pow((c + 0.055) / 1.055, 2.4)
    
    rs = adjust(r)
    gs = adjust(g)
    bs = adjust(b)
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs

def hsl_to_hex(h, s, l):
    h = h / 360.0
    s = s / 100.0
    l = l / 100.0
    
    if s == 0:
        r = g = b = l
    else:
        def hue_to_rgb(p, q, t):
            if t < 0: t += 1
            if t > 1: t -= 1
            if t < 1/6: return p + (q - p) * 6 * t
            if t < 1/2: return q
            if t < 2/3: return p + (q - p) * (2/3 - t) * 6
            return p
        
        q = l * (1 + s) if l < 0.5 else l + s - l * s
        p = 2 * l - q
        r = hue_to_rgb(p, q, h + 1/3)
        g = hue_to_rgb(p, q, h)
        b = hue_to_rgb(p, q, h - 1/3)
    
    def to_hex(c):
        hex_str = hex(int(round(c * 255)))[2:]
        return hex_str if len(hex_str) == 2 else '0' + hex_str
    
    return (to_hex(r) + to_hex(g) + to_hex(b)).upper()

# 主色分析
primary_hex = 'CD276E'
print(f'主色: #{primary_hex}')

# HSL值
h, s, l = hex_to_hsl(primary_hex)
print(f'HSL: h={h:.1f}°, s={s:.1f}%, l={l:.1f}%')

# WCAG相对亮度
primary_rl = relative_luminance(primary_hex)
print(f'WCAG相对亮度: {primary_rl:.3f}')

# 分类判断
is_bright = primary_rl > 0.4
is_dark = primary_rl < 0.12
is_medium = not is_bright and not is_dark
print(f'分类: {("亮色" if is_bright else ("暗色" if is_dark else "中等亮度"))}')

# 深浅模式判断（auto模式）
use_light = l > 50
print(f'深浅模式: {"浅色基调" if use_light else "深色基调"}')

# 背景色计算
back_l, back_s = None, None
if not use_light:
    if is_dark:
        back_l = min(35, l + 15)
        back_s = min(s * 0.55, 20)
        print('策略: 暗主色')
    elif is_medium:
        target_l = l - min(8, s * 0.08)
        back_l = max(15, min(30, target_l))
        back_s = min(s * 0.45, 18)
        print('策略: 中等亮度')
        print(f'targetL: {target_l:.1f}')
    else:
        back_l = 12
        back_s = min(s * 0.5, 15)
        print('策略: 其他')

if back_l is not None:
    print(f'背景亮度 backL: {back_l:.1f}')
    print(f'背景饱和度 backS: {back_s:.1f}')
    
    back = hsl_to_hex(h, back_s, back_l)
    print(f'\n最终背景色值: #{back}')
else:
    print('（不会计算背景色，因为进入了浅色模式）')