#!/usr/bin/env python3
"""测试模式2：主色用于"选定候选项文字"的颜色生成结果"""
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

def adjust_l(hex_color, delta_l):
    h, s, l = hex_to_hsl(hex_color)
    new_l = max(0, min(100, l + delta_l))
    return hsl_to_hex(h, s, new_l)

def mix_hex(c1, c2, ratio):
    r1, g1, b1 = int(c1[0:2], 16), int(c1[2:4], 16), int(c1[4:6], 16)
    r2, g2, b2 = int(c2[0:2], 16), int(c2[2:4], 16), int(c2[4:6], 16)
    r = round(r1 * (1 - ratio) + r2 * ratio)
    g = round(g1 * (1 - ratio) + g2 * ratio)
    b = round(b1 * (1 - ratio) + b2 * ratio)
    return ('00' + format((r << 16) | (g << 8) | b, 'x'))[-6:].upper()

# 测试主色
primary = 'CD276E'
h, s, l = hex_to_hsl(primary)
print(f"主色: #{primary}")
print(f"HSL: h={h:.1f}°, s={s:.1f}%, l={l:.1f}%")

# 模拟之前算法生成的背景色
# 中等亮度策略：targetL = l - min(8, s*0.08)
# 对 #CD276E (l=47.8, s=68): targetL = 47.8 - 5.44 = 42.4
# backL = max(15, min(30, 42.4)) = 30
# backS = min(68*0.45, 18) = 18
# 自动模式 + l<=50 -> 深色基调 (useLight=false)
back_l = 30
back_s = 18
back = hsl_to_hex(h, back_s, back_l)
print(f"\n小视窗背景 (back): #{back}  (l={back_l}, s={back_s})")

# === 模式2：主色用于"选定候选项文字" ===
print("\n" + "="*50)
print("模式2：主色用于'选定候选项文字'")
print("="*50)

# 1. 选定候选项文字 = 主色
hilited_text = primary
print(f"1. 选定候选项文字: #{hilited_text} (主色)")

# 2. 选定候选项背景
use_light = False  # 深色模式
is_dark = False
is_medium = True
is_bright = False

if use_light:
    hilited_back = adjust_l(back, -8)
else:
    back_boost = 35 if is_dark else (20 if is_medium else 12)
    boosted = adjust_l(back, back_boost)
    b_h, b_s, b_l = hex_to_hsl(boosted)
    b_s = min(b_s, 8)
    hilited_back = hsl_to_hex(b_h, b_s, b_l)
print(f"2. 选定候选项背景: #{hilited_back}  (深色模式：box背景+8)")

# 3. 选定候选项序号
hilited_label = mix_hex(primary, hilited_back, 0.35)
print(f"3. 选定候选项序号: #{hilited_label}  (主色与背景混合35%)")

# 4. 选定候选词提示
hilited_comment = mix_hex(primary, hilited_back, 0.55)
print(f"4. 选定候选词提示: #{hilited_comment}  (主色与背景混合55%)")

# 对比度检查
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

print(f"\n对比度检查:")
print(f"  文字 vs 背景: {contrast_ratio(hilited_text, hilited_back):.2f}:1  (阈值4.5)")
print(f"  序号 vs 背景: {contrast_ratio(hilited_label, hilited_back):.2f}:1  (阈值2.5)")
print(f"  提示 vs 背景: {contrast_ratio(hilited_comment, hilited_back):.2f}:1  (阈值2.0)")

# 触发兜底降级
if contrast_ratio(hilited_back, hilited_text) < 4.5:
    print(f"\n⚠️  触发兜底：文字降级为对比色")
    def get_contrast_color(hex_color):
        lum = relative_luminance(hex_color)
        return '000000' if lum > 0.179 else 'FFFFFF'
    final_text = get_contrast_color(hilited_back)
    print(f"  文字最终: #{final_text}")
    print(f"  新对比度: {contrast_ratio(final_text, hilited_back):.2f}:1")

if contrast_ratio(hilited_back, hilited_comment) < 2.0:
    print(f"\n⚠️  触发兜底：提示降级为对比色")
    final_comment = '000000' if relative_luminance(hilited_back) > 0.179 else 'FFFFFF'
    print(f"  提示最终: #{final_comment}")
    print(f"  新对比度: {contrast_ratio(final_comment, hilited_back):.2f}:1")

if contrast_ratio(hilited_back, hilited_label) < 2.5:
    print(f"\n⚠️  触发兜底：序号降级为对比色")
    final_label = '000000' if relative_luminance(hilited_back) > 0.179 else 'FFFFFF'
    print(f"  序号最终: #{final_label}")
    print(f"  新对比度: {contrast_ratio(final_label, hilited_back):.2f}:1")