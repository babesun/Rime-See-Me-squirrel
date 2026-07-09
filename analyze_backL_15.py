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
        else:
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

print("=" * 60)
print("分析：中等亮度主色何时会得到背景亮度 backL = 15")
print("=" * 60)
print()

print("算法逻辑：")
print("  targetL = l - min(8, s*0.08)")
print("  backL = max(15, min(30, targetL))")
print()

print("要使 backL = 15，需要满足：")
print("  targetL <= 15")
print("  即：l - min(8, s*0.08) <= 15")
print()

print("=" * 60)
print("按饱和度分析：")
print("=" * 60)

# 不同饱和度下的临界亮度
saturation_values = [100, 80, 70, 60, 50, 40, 30, 20, 10, 0]

print("\n饱和度(s)  |  临界亮度(l)  |  说明")
print("-" * 60)

for s in saturation_values:
    if s * 0.08 >= 8:
        min_val = 8
        critical_l = 23  # l - 8 <= 15
        note = "饱和度极高时，固定减8"
    else:
        min_val = s * 0.08
        critical_l = 15 + min_val
        note = f"动态调整：l <= {critical_l:.1f}"
    
    print(f"  {s:3}%    |    l <= {critical_l:4.1f}%    |  {note}")

print()
print("=" * 60)
print("实例验证：")
print("=" * 60)

# 测试几个临界点
test_colors = [
    ('442211', '假设：低饱和度高亮度'),
    ('332222', '假设：极低饱和度中亮度'),
    ('1A0A0A', '假设：极高饱和度低亮度'),
]

for hex_color, desc in test_colors:
    h, s, l = hex_to_hsl(hex_color)
    rl = relative_luminance(hex_color)
    
    # 计算背景亮度
    target_l = l - min(8, s * 0.08)
    back_l = max(15, min(30, target_l))
    
    print(f"\n{desc}")
    print(f"  颜色: #{hex_color}")
    print(f"  HSL: h={h:.1f}°, s={s:.1f}%, l={l:.1f}%")
    print(f"  WCAG相对亮度: {rl:.3f}")
    print(f"  分类: {'中等亮度' if (0.12 <= rl <= 0.4 and l <= 50) else '其他'}")
    print(f"  targetL: {target_l:.1f}")
    print(f"  背景亮度 backL: {back_l:.1f}")
    
    if back_l == 15:
        print("  ✓ 确实得到了 backL = 15")

print()
print("=" * 60)
print("结论：")
print("=" * 60)
print()
print("背景亮度 backL = 15 的条件：")
print("1. 主色被判定为中等亮度（primaryRL 在 0.12-0.4 之间）")
print("2. 主色亮度 l <= 50（使用深色基调）")
print("3. 主色亮度 l - min(8, s*0.08) <= 15")
print()
print("简化理解：")
print("  - 高饱和度(s>=100): 主色亮度 l <= 23 时，背景 l=15")
print("  - 中饱和度(s=70):   主色亮度 l <= 20.6 时，背景 l=15")
print("  - 低饱和度(s=30):   主色亮度 l <= 17.4 时，背景 l=15")
print("  - 零饱和度(s=0):    主色亮度 l <= 15 时，背景 l=15")
print()
print("实际影响：由于中等亮度要求 primaryRL >= 0.12")
print("这意味着主色要有足够的明度，所以实际很难触发 backL=15")