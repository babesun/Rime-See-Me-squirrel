#!/usr/bin/env python3
"""测试 #CD276E 模式2 的输出"""
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
        else:
            h = (r - g) / d + 4.0
        h /= 6.0
    return h * 360, s * 100, l * 100

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

def mix_hex(c1, c2, ratio):
    r1, g1, b1 = int(c1[0:2], 16), int(c1[2:4], 16), int(c1[4:6], 16)
    r2, g2, b2 = int(c2[0:2], 16), int(c2[2:4], 16), int(c2[4:6], 16)
    r = round(r1 * (1 - ratio) + r2 * ratio)
    g = round(g1 * (1 - ratio) + g2 * ratio)
    b = round(b1 * (1 - ratio) + b2 * ratio)
    return ('00' + format((r << 16) | (g << 8) | b, 'x'))[-6:].upper()

def relative_luminance(hex_color):
    hex_color = hex_color.replace('#', '')
    r = int(hex_color[0:2], 16) / 255.0
    g = int(hex_color[2:4], 16) / 255.0
    b = int(hex_color[4:6], 16) / 255.0
    def adjust(c):
        return c / 12.92 if c <= 0.03928 else math.pow((c + 0.055) / 1.055, 2.4)
    return 0.2126 * adjust(r) + 0.7152 * adjust(g) + 0.0722 * adjust(b)

def contrast_ratio(c1, c2):
    L1 = relative_luminance(c1)
    L2 = relative_luminance(c2)
    a, b = max(L1, L2), min(L1, L2)
    return (a + 0.05) / (b + 0.05)

def get_contrast_color(hex_color):
    lum = relative_luminance(hex_color)
    return '000000' if lum > 0.179 else 'FFFFFF'

# === 测试 #CD276E ===
primary = 'CD276E'
h, s, l = hex_to_hsl(primary)
primary_l = l
primary_is_bright = primary_l > 50

print(f"主色: #{primary}")
print(f"HSL: h={h:.1f} s={s:.1f} l={l:.1f}")
print(f"主色明度 > 50: {primary_is_bright}")

# 模拟 box 背景（中等亮度 → 中等亮度策略）
back_l = 30
back_s = 18
use_light = False  # 深色基调
back = hsl_to_hex(h, back_s, back_l)
print(f"\nbox 背景: #{back} (l={back_l}, s={back_s})")

# 模式2 颜色
hilited_text = primary

if use_light:
    hilited_back_l = back_l - 6
else:
    if primary_is_bright:
        hilited_back_l = max(back_l - 5, 18)
    else:
        hilited_back_l = min(back_l + 60, 95)
hilited_back_s = min(back_s * 0.3, 3)
hilited_back = hsl_to_hex(h, hilited_back_s, hilited_back_l)

print(f"\n选定候选项背景: #{hilited_back} (l={hilited_back_l}, s={hilited_back_s})")
print(f"选定候选项文字: #{hilited_text} (主色)")

hilited_label = mix_hex(primary, hilited_back, 0.35)
hilited_comment = mix_hex(primary, hilited_back, 0.55)
print(f"序号: #{hilited_label}")
print(f"提示: #{hilited_comment}")

# 兜底
text_fallback = False
if contrast_ratio(hilited_back, hilited_text) < 3.0:
    hilited_text = get_contrast_color(hilited_back)
    text_fallback = True
if contrast_ratio(hilited_back, hilited_comment) < 1.5:
    hilited_comment = get_contrast_color(hilited_back)
if contrast_ratio(hilited_back, hilited_label) < 2.0:
    hilited_label = get_contrast_color(hilited_back)

print(f"\n=== 最终输出 ===")
print(f"文字: #{hilited_text} {'(降级)' if text_fallback else '(保留主色)'}")
print(f"背景: #{hilited_back}")
print(f"序号: #{hilited_label}")
print(f"提示: #{hilited_comment}")

print(f"\n=== 对比度 ===")
print(f"文字 vs 背景: {contrast_ratio(hilited_text, hilited_back):.2f}:1")
print(f"序号 vs 背景: {contrast_ratio(hilited_label, hilited_back):.2f}:1")
print(f"提示 vs 背景: {contrast_ratio(hilited_comment, hilited_back):.2f}:1")