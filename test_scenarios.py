#!/usr/bin/env python3
"""测试不同主色下，模式2的生成效果"""
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

def test_mode2(primary):
    h, s, l = hex_to_hsl(primary)
    primary_rl = relative_luminance(primary)
    is_bright = primary_rl > 0.4
    is_dark = primary_rl < 0.12
    is_medium = not is_bright and not is_dark

    use_light = l > 50

    # 模拟 box 背景生成
    if use_light:
        back_l = 97 if not is_bright else max(l + 18, 95)
        back_s = min(s * 0.08, 4) if is_bright else min(s * 0.1, 5)
    else:
        if is_dark:
            back_l = min(35, l + 15)
            back_s = min(s * 0.55, 20)
        elif is_medium:
            target_l = l - min(8, s * 0.08)
            back_l = max(15, min(30, target_l))
            back_s = min(s * 0.45, 18)
        else:
            back_l = 12
            back_s = min(s * 0.5, 15)
    back = hsl_to_hex(h, back_s, back_l)

    # 模式2: 主色用于文字
    hilited_text = primary
    if use_light:
        hilited_back = adjust_l(back, -8)
    else:
        back_boost = 30 if is_dark else (25 if is_medium else 15)
        boosted = adjust_l(back, back_boost)
        b_h, b_s, b_l = hex_to_hsl(boosted)
        b_s = min(b_s, 8)
        hilited_back = hsl_to_hex(b_h, b_s, b_l)

    hilited_label = mix_hex(primary, hilited_back, 0.35)
    hilited_comment = mix_hex(primary, hilited_back, 0.55)

    # 兜底
    text_fallback = False
    if contrast_ratio(hilited_back, hilited_text) < 4.5:
        hilited_text = get_contrast_color(hilited_back)
        text_fallback = True
    if contrast_ratio(hilited_back, hilited_comment) < 2.0:
        hilited_comment = get_contrast_color(hilited_back)
    if contrast_ratio(hilited_back, hilited_label) < 2.5:
        hilited_label = get_contrast_color(hilited_back)

    print(f"\n主色: #{primary}  HSL: h={h:.0f} s={s:.0f} l={l:.0f}  RL={primary_rl:.3f}  [{'亮' if is_bright else ('暗' if is_dark else '中')}]")
    print(f"  box背景: #{back}  (l={back_l:.0f})")
    print(f"  hilited_back: #{hilited_back}  (提亮+去饱和)")
    print(f"  hilited_text: #{hilited_text} {'(降级为对比色)' if text_fallback else '(主色保留)'}")
    print(f"  hilited_label: #{hilited_label}")
    print(f"  hilited_comment: #{hilited_comment}")
    print(f"  文字对比度: {contrast_ratio(hilited_text, hilited_back):.2f}:1")
    print(f"  序号对比度: {contrast_ratio(hilited_label, hilited_back):.2f}:1")
    print(f"  提示对比度: {contrast_ratio(hilited_comment, hilited_back):.2f}:1")

print("="*60)
print("模式2：主色用于'选定候选项文字' — 各种主色场景测试")
print("="*60)

# 测试各种类型的主色
test_cases = [
    ('CD276E', '中等亮度粉红 (用户测试色)'),
    ('E91E63', '亮色粉红 (Material Pink)'),
    ('2196F3', '亮色蓝 (Material Blue)'),
    ('FF5722', '亮色橙红 (Material Deep Orange)'),
    ('3F51B5', '中等亮度蓝紫'),
    ('0D47A1', '暗色深蓝'),
    ('FFEB3B', '亮色黄 (高亮度低饱和度)'),
    ('4CAF50', '中等亮度绿'),
    ('1B5E20', '暗色深绿'),
    ('795548', '暗色棕'),
]

for color, desc in test_cases:
    print(f"\n--- {desc} ---")
    test_mode2(color)