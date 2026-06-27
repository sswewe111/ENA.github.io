---
title: "OpenCV 01：读取和处理、ROI区域、边界填充、数值计算"
description: "OpenCV 学习笔记第 1 篇：图像读取、ROI 区域、边界填充与数值计算。"
pubDate: 2026-06-01
tags: ["计算机视觉", "Python", "OpenCV"]
series: "OpenCV 学习笔记"
---
# 读取、ROI、边界填充与数值计算

本节主要介绍 OpenCV 中最基础的图像操作，包括图像读取与显示、视频逐帧读取、ROI 区域截取、颜色通道处理、边界填充以及图像数值计算。

这些操作是后续图像阈值、滤波、边缘检测、轮廓分析等内容的基础。

## 核心知识点

| 模块 | 作用 | 常用函数 |
| --- | --- | --- |
| 图像读取与显示 | 读取、展示、保存图像 | `cv2.imread()`、`cv2.imshow()`、`cv2.imwrite()` |
| 视频读取 | 从视频中逐帧读取图像 | `cv2.VideoCapture()`、`read()` |
| ROI 区域 | 截取图像中的指定区域 | NumPy 切片 |
| 颜色通道 | 拆分或合并 BGR 通道 | `cv2.split()`、`cv2.merge()` |
| 边界填充 | 给图像四周补边 | `cv2.copyMakeBorder()` |
| 数值计算 | 对图像像素做加减、融合等操作 | `cv2.add()`、`cv2.addWeighted()` |

# 图像读取、显示与保存

OpenCV 读取图像后，默认颜色通道顺序是 **BGR**，不是常见的 RGB。

```python
import cv2

# 读取图像
img = cv2.imread("test.jpg")

# 判断图像是否读取成功
if img is None:
    print("图像读取失败")
else:
    # 显示图像
    cv2.imshow("Image", img)

    # 等待按键，0 表示一直等待
    cv2.waitKey(0)

    # 关闭所有窗口
    cv2.destroyAllWindows()

    # 保存图像
    cv2.imwrite("result.png", img)
```

## 常用读取方式

```python
# 彩色图像，默认方式
img_color = cv2.imread("test.jpg", cv2.IMREAD_COLOR)

# 灰度图像，常用于阈值处理、边缘检测等单通道操作
img_gray = cv2.imread("test.jpg", cv2.IMREAD_GRAYSCALE)

# 保留原始通道，例如 PNG 的透明通道 Alpha
img_unchanged = cv2.imread("test.png", cv2.IMREAD_UNCHANGED)
```

注意：

- `cv2.imread()` 读取失败时会返回 `None`；
- 路径错误、文件不存在、中文路径兼容问题都可能导致读取失败；
- `cv2.imshow()` 必须配合 `cv2.waitKey()` 使用，否则窗口可能一闪而过。

# 图像尺寸调整

使用 `cv2.resize()` 可以调整图像大小。

```python
# 调整为指定宽高，格式是 (width, height)
resized = cv2.resize(img, (300, 200))

# 按比例缩放，fx 和 fy 分别控制宽、高缩放比例
small = cv2.resize(img, None, fx=0.5, fy=0.5)
```

注意：`cv2.resize(img, (300, 200))` 中的尺寸顺序是 **宽、高**，而 `img.shape` 返回的是 **高、宽、通道数**。

# 视频读取

视频可以看成是一帧一帧连续的图像。**OpenCV 使用 `cv2.VideoCapture()` 打开视频，再通过 `read()` 逐帧读取**。

```python
import cv2

cap = cv2.VideoCapture("test.mp4")

if not cap.isOpened():
    print("视频打开失败")
else:
    while True:
        ret, frame = cap.read()

        # ret 为 False 表示读取失败或视频结束
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        cv2.imshow("Video", gray)

        # 按 Esc 键退出
        if cv2.waitKey(1) & 0xFF == 27:
            break

cap.release()
cv2.destroyAllWindows()
```

重点：

- `ret` 表示当前帧是否读取成功；
- `frame` 是当前读取到的一帧图像；
- 循环结束后要使用 `cap.release()` 释放视频资源。

# ROI 区域

ROI（Region of Interest）表示图像中的感兴趣区域。OpenCV 图像本质上是 NumPy 数组，所以可以直接用切片截取局部区域。

```python
# 截取 y=50 到 200、x=100 到 300 的区域
# 注意顺序是 img[行范围, 列范围]，也就是 img[y1:y2, x1:x2]
roi = img[50:200, 100:300]
```

切片顺序是：

```python
img[y1:y2, x1:x2]
```

也就是说，先写 **行范围 y**，再写 **列范围 x**。

## 修改 ROI

可以直接把某个区域替换为其他内容。

```python
# 将指定区域变成黑色
img[50:200, 100:300] = 0

# 将 ROI 复制到图像的另一个位置
roi = img[50:150, 100:200]
img[200:300, 300:400] = roi
```

注意：复制 ROI 时，目标区域和 ROI 的宽高必须一致。

# 颜色通道处理

OpenCV 彩色图像默认是 BGR 三通道。

```python
# 拆分 B、G、R 三个通道
b, g, r = cv2.split(img)
```

也可以重新合并通道：

```python
# 按 B、G、R 顺序重新合并为彩色图像
merged = cv2.merge((b, g, r))
```

## 单独修改某个通道

```python
# 去掉蓝色通道
img[:, :, 0] = 0

# 去掉绿色通道
img[:, :, 1] = 0

# 去掉红色通道
img[:, :, 2] = 0
```

通道索引对应关系：

| 索引 | 通道 |
| --- | --- |
| `0` | B 蓝色 |
| `1` | G 绿色 |
| `2` | R 红色 |

如果只是访问或修改某个通道，直接使用 `img[:, :, index]` 通常比 `cv2.split()` 更高效。

# 边界填充

边界填充用于在图像四周添加额外像素，常用于卷积、滤波、形态学处理等操作中，避免图像边缘信息丢失。

```python
top, bottom, left, right = 50, 50, 50, 50

# 在图像上下左右各填充 50 个像素
# BORDER_CONSTANT 表示使用固定颜色填充
border = cv2.copyMakeBorder(
    img,
    top,
    bottom,
    left,
    right,
    cv2.BORDER_CONSTANT,
    value=(0, 0, 0)
)
```

## 常见填充方式

| 填充方式 | 含义 |
| --- | --- |
| `cv2.BORDER_CONSTANT` | 常量填充 |
| `cv2.BORDER_REPLICATE` | 复制边缘像素 |
| `cv2.BORDER_REFLECT` | 镜像反射 |
| `cv2.BORDER_REFLECT_101` | 不重复边缘的镜像反射 |
| `cv2.BORDER_WRAP` | 环绕填充 |

# 图像数值计算

图像本质上是像素矩阵，所以可以进行加法、减法、融合等数值操作。

## NumPy 运算和 OpenCV 运算的区别

NumPy 直接相加时，超过 `255` 会取模；OpenCV 的 `cv2.add()` 会进行饱和处理，超过 `255` 会保持为 `255`。

```python
import numpy as np
import cv2

# uint8 的取值范围是 0~255
x = np.uint8([250])
y = np.uint8([10])

print(x + y)        # [4]，超过 255 后取模
print(cv2.add(x, y)) # [[255]]，超过 255 后截断为 255
```

因此，图像加法更推荐使用 `cv2.add()`。

```python
# OpenCV 加法会做饱和处理，超过 255 的结果会截断为 255
result = cv2.add(img1, img2)
```

注意：两张图像相加时，尺寸和通道数必须一致。

## 图像融合

图像融合用于把两张图按比例叠加。

```python
# 按权重融合两张图像，常用于图像叠加和透明混合
result = cv2.addWeighted(img1, 0.7, img2, 0.3, 0)
```

参数含义：

- `img1`：第一张图像；
- `0.7`：第一张图像的权重；
- `img2`：第二张图像；
- `0.3`：第二张图像的权重；
- `0`：亮度偏移量。

计算公式：

```text
result = img1 * 0.7 + img2 * 0.3 + 0
```

# 本节总结

- OpenCV 使用 `cv2.imread()` 读取图像，读取失败会返回 `None`；
- OpenCV 默认颜色顺序是 **BGR**；
- ROI 本质上是 NumPy 切片，格式是 `img[y1:y2, x1:x2]`；
- 彩色图像通道顺序是 `B、G、R`，索引分别是 `0、1、2`；
- 边界填充常用于滤波、卷积等操作前的边缘处理；
- 图像数值计算推荐使用 `cv2.add()` 和 `cv2.addWeighted()`，避免 NumPy 取模造成结果异常。

