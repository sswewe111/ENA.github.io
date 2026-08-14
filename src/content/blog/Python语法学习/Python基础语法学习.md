---
title: "Python基础语法学习"
description: "Python基础语法学习"
pubDate: 2026-08-14
tags: ["Python","基础语法"]
series: "Python语法学习"
---

# Python 七大基础数据类型
**数字类型**：<br>
1、整数 int：没有小数点的数字，正数、负数、0都支持<br>
2、浮点数 float：带小数点的数字，用于存储小数、精度计算<br>
```python
num1 = 666      # 整数
num2 = 88.9     # 浮点数
```

**字符串类型**：<br>
字符串是用来存储文本内容的数据类型，所有文字、符号、中文都属于字符串。定义方式：使用单引号、双引号、三引号。
```python
str1 = 'Python'
str2 = "基础语法学习"
str3 = '''多行
字符串内容'''
```

**布尔类型**：<br>
只有两个固定值：True（真）、False（假），主要用于条件判断、逻辑运算，是循环和分支语句的核心依据。
```python
flag1 = True
flag2 = False
```

**列表List**：<br>
可以存放任意类型数据，**元素可以修改**、增加、删除，用中括号 [] 定义，是开发中使用频率最高的容器类型。
```python
list_data = [10, "Python", True, 99.9]

my_list = ['abcd', 786, 2.23, 'runoob', 70.2]  # 避免使用 list 作为变量名，会覆盖内置类型
tinylist = [123, 'runoob']

print(my_list)             # 打印整个列表：['abcd', 786, 2.23, 'runoob', 70.2]
print(my_list[0])          # 打印第一个元素（索引 0）：abcd
print(my_list[1:3])        # 打印索引 1 和 2 的元素（不含索引 3）：[786, 2.23]
print(my_list[2:])         # 打印从索引 2 开始到末尾的所有元素：[2.23, 'runoob', 70.2]
print(tinylist * 2)        # 重复打印 tinylist 两次：[123, 'runoob', 123, 'runoob']
print(my_list + tinylist)  # 拼接两个列表
```

**元组**：<br>
用小括号() 定义，元素**不可修改**，数据安全性更高，适合存储固定不变的一组数据。
```python
tuple_data = (1, 2, 3, "固定数据")

my_tuple = ('abcd', 786, 2.23, 'runoob', 70.2)  # 避免使用 tuple 作为变量名
tinytuple = (123, 'runoob')

print(my_tuple)               # 输出完整元组
print(my_tuple[0])            # 输出第一个元素：abcd
print(my_tuple[1:3])          # 输出索引 1 和 2 的元素：(786, 2.23)
print(my_tuple[2:])           # 输出从索引 2 开始的所有元素
print(tinytuple * 2)          # 输出两次 tinytuple
print(my_tuple + tinytuple)   # 连接两个元组
```

**字典**：<br>
以键值对形式存储数据，用大括号 {} 定义，查询效率极高，适合存储具有对应关系的数据，比如用户信息、配置参数。
```python
user_info = {"name": "新手", "age": 20, "gender": "男"}
```
**集合Set**：<br>
集合（Set）是一种无序、可变的数据类型，用于存储唯一的元素。集合中的元素不会重复，并且可以进行交集、并集、差集等常见的集合操作。
```python
sites = {'Google', 'Taobao', 'Runoob', 'Facebook', 'Zhihu', 'Baidu'}

a = set('abracadabra')
b = set('alacazam')
print(a)           # a 中的唯一字符
print(a - b)       # a 和 b 的差集（在 a 中但不在 b 中）
print(a | b)       # a 和 b 的并集（在 a 或 b 中）
print(a & b)       # a 和 b 的交集（同时在 a 和 b 中）
print(a ^ b)       # a 和 b 的对称差集（在 a 或 b 中，但不同时存在）
```
# 条件判断语句
条件判断语句的作用：满足指定条件就执行对应代码，不满足则跳过。
```py
if age >= 18:
    print("成年")
else:
    print("未成年")

if score >= 90:
    print("优秀")
elif score >= 70:
    print("良好")
elif score >= 60:
    print("及格")
else:
    print("不及格")
```

# 循环结构语法
Python 包含 while 循环和 for 循环两种。

while循环：<br>
适合不确定循环次数的场景，只要条件成立，代码就会无限循环执行，语法结构：
```py
while 循环条件:
    循环体代码
```

for循环：<br>
适合遍历数据、确定循环次数的场景：
```py
# 遍历字符串
for char in "Python":
    print(char)
```

**break**：直接终止整个循环，跳出循环结构<br>
**continue**：跳过当前这一次循环，直接进入下一次循环

# 字符串常用基础操作
**字符串取值与切片**：<br>
通过下标可以单独获取字符串单个字符，切片可以截取字符串指定区间内容
```py
str='123456789'
print(str)                 # 输出字符串
print(str[0:-1])           # 输出第一个到倒数第二个的所有字符
print(str[0])              # 输出字符串第一个字符
print(str[2:5])            # 输出从第三个开始到第六个的字符（不包含）
print(str[2:])             # 输出从第三个开始后的所有字符
print(str[1:5:2])          # 输出从第二个开始到第五个且每隔一个的字符（步长为2）
print(str * 2)             # 输出字符串两次
print(str + '你好')         # 连接字符串
```

**字符串内置方法**：<br>
```py
len()：获取字符串长度
upper()：全部转为大写
lower()：全部转为小写
replace()：替换指定内容
split()：字符串分割
```

# 容器类型核心用法
**列表常用操作**：<br>
```py
增加：append()、insert()
删除：del、pop()、remove()
修改：通过下标直接赋值
查询：下标取值、遍历查询
```
