# -*- coding: utf-8 -*-
r"""
Calm 贴图加工（rembg 版）：白底 JPG → 透明底 webp。

阈值抠图无法根除照片软阴影（阴影与奶油色字母本体色域重叠），
改用 rembg(u2net) AI 抠图：字母为前景主体，阴影/背景/水印统一归入背景。

模型：C:\Users\jizaI\.rembg\models\u2net\u2net.onnx（首次运行自动下载，需代理）
"""
from pathlib import Path
from PIL import Image
import numpy as np
from rembg import remove, new_session

SRC = Path(r'C:\Users\jizaI\.workbuddy\clipboard-images')
OUT = Path(r'D:\AI\my-blog\public\landing')

JOBS = [
    # —— 第一批：Calm ——
    ('12-28-58-925Z-c771da22.jpg', 'calm-00-a.webp'),  # 毛线 C
    ('12-28-58-927Z-b49901df.jpg', 'calm-00-b.webp'),  # 格纹 C
    ('12-28-58-958Z-e56d79ee.jpg', 'calm-01-a.webp'),  # 荧光绿 a
    ('12-28-58-963Z-7a4bf8f6.jpg', 'calm-01-b.webp'),  # 红底刺绣 a
    ('12-28-58-922Z-ce23ff39.jpg', 'calm-02-a.webp'),  # 丹宁 L
    ('12-28-58-930Z-381a58e1.jpg', 'calm-02-b.webp'),  # 吊牌 L
    ('12-28-58-932Z-8d4b5e78.jpg', 'calm-03-a.webp'),  # 鲸鱼邮票 m
    ('12-28-58-961Z-1c3562a7.jpg', 'calm-03-b.webp'),  # 格纹 m
    # —— 第二批：wraps 里的 p ——
    ('13-21-06-429Z-47705957.jpg', 'calm-08-a.webp'),  # 灯芯绒 p
    ('13-21-06-432Z-d49ff82a.jpg', 'calm-08-b.webp'),  # 梨形吊牌 p
    # —— 第三批：fleeting 里的 f / e / i ——
    ('13-33-05-234Z-69ecbe0c.jpg', 'calm-11-a.webp'),  # 橙色书签 f
    ('13-33-05-236Z-94597402.jpg', 'calm-11-b.webp'),  # 绿色圆毡 f
    ('13-33-05-239Z-9e9592c6.jpg', 'calm-13-a.webp'),  # 云朵 e
    ('13-33-05-242Z-a9c54636.jpg', 'calm-13-b.webp'),  # 小鱼邮票 e
    ('13-33-05-245Z-aea1ff33.jpg', 'calm-14-a.webp'),  # 贝壳 e
    ('13-33-05-248Z-6847779f.jpg', 'calm-14-b.webp'),  # 青绿缠线 e
    ('13-33-05-251Z-5f62ec4c.jpg', 'calm-16-a.webp'),  # 热气球 i
    ('13-33-05-254Z-3d8c5975.jpg', 'calm-16-b.webp'),  # 蓝色小包 i
    # —— 第四批：t / g ——
    ('14-01-51-745Z-e0af63c0.jpg', 'calm-18-a.webp'),  # 鱼形毛毡 g
    ('14-01-51-751Z-8f8c4874.jpg', 'calm-18-b.webp'),  # 皮革钥匙扣 g
    ('14-01-51-748Z-7943b1a2.jpg', 'calm-15-a.webp'),  # 云朵 t
    ('14-01-51-753Z-06d8be4c.jpg', 'calm-15-b.webp'),  # 邮筒 t
]


def find_src(fragment: str) -> Path:
    hits = list(SRC.glob(f'*{fragment}*'))
    if len(hits) != 1:
        raise FileNotFoundError(f'{fragment}: {len(hits)} hits')
    return hits[0]


session = new_session('u2net')

for frag, out_name in JOBS:
    src = find_src(frag)
    rgba = remove(Image.open(src).convert('RGB'), session=session)
    alpha = np.asarray(rgba)[:, :, 3]
    bbox = Image.fromarray(alpha, 'L').getbbox()
    if bbox:
        pad = 6
        w, h = rgba.size
        bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad),
                min(w, bbox[2] + pad), min(h, bbox[3] + pad))
        rgba = rgba.crop(bbox)
    scale = 512 / max(rgba.size)
    if scale < 1:
        rgba = rgba.resize((round(rgba.width * scale), round(rgba.height * scale)),
                           Image.LANCZOS)
    rgba.save(OUT / out_name, 'WEBP', quality=90)
    a = np.asarray(rgba)[:, :, 3]
    print(f'{out_name}: {rgba.size[0]}x{rgba.size[1]} 透明占比 {((a < 10).mean()*100):.1f}%')
print('done')
