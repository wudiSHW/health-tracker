#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
生成PWA应用所需的各种尺寸图标
需要安装: pip install cairosvg Pillow
"""

import os
import sys

try:
    import cairosvg
    from PIL import Image
    import io
except ImportError:
    print("请先安装依赖: pip install cairosvg Pillow")
    sys.exit(1)

# 需要生成的图标尺寸
ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

def generate_icons():
    """生成所有尺寸的图标"""
    svg_path = "icon.svg"
    
    if not os.path.exists(svg_path):
        print(f"错误: 找不到 {svg_path}")
        return False
    
    # 读取SVG文件
    with open(svg_path, 'rb') as f:
        svg_data = f.read()
    
    print("开始生成图标...")
    
    for size in ICON_SIZES:
        try:
            # 使用cairosvg将SVG转换为PNG
            png_data = cairosvg.svg2png(
                bytestring=svg_data,
                output_width=size,
                output_height=size
            )
            
            # 保存PNG文件
            output_path = f"icon-{size}x{size}.png"
            with open(output_path, 'wb') as f:
                f.write(png_data)
            
            print(f"✓ 生成 {output_path}")
            
        except Exception as e:
            print(f"✗ 生成 {size}x{size} 图标失败: {e}")
            return False
    
    print("\n所有图标生成完成！")
    return True

def create_simple_icons():
    """如果无法使用cairosvg，创建简单的彩色方块图标"""
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        print("使用PIL生成简单图标...")
        
        for size in ICON_SIZES:
            # 创建渐变背景
            img = Image.new('RGB', (size, size), color='#667eea')
            draw = ImageDraw.Draw(img)
            
            # 添加渐变效果（简化版）
            for y in range(size):
                r = int(102 + (118 - 102) * y / size)
                g = int(126 + (75 - 126) * y / size)
                b = int(234 + (162 - 234) * y / size)
                draw.line([(0, y), (size, y)], fill=(r, g, b))
            
            # 添加心形图案（简化版圆形）
            margin = size // 4
            draw.ellipse([margin, margin, size - margin, size - margin], 
                        fill='white', outline='white')
            
            # 添加十字（医疗符号）
            cross_width = size // 8
            cross_center = size // 2
            draw.rectangle([cross_center - cross_width, margin + size//8, 
                           cross_center + cross_width, size - margin - size//8], 
                          fill='#667eea')
            draw.rectangle([margin + size//8, cross_center - cross_width, 
                           size - margin - size//8, cross_center + cross_width], 
                          fill='#667eea')
            
            # 保存
            output_path = f"icon-{size}x{size}.png"
            img.save(output_path, 'PNG')
            print(f"✓ 生成 {output_path}")
        
        print("\n所有图标生成完成！")
        return True
        
    except Exception as e:
        print(f"生成图标失败: {e}")
        return False

if __name__ == "__main__":
    # 尝试使用cairosvg生成
    if not generate_icons():
        # 如果失败，使用PIL生成简单图标
        print("\n尝试使用备用方法生成图标...")
        create_simple_icons()
