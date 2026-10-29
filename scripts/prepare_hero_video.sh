#!/usr/bin/env bash
# 首页人物视频预处理：可灵原片 → 网页鼠标擦洗专用版本
#
# 用法：
#   bash scripts/prepare_hero_video.sh <可灵导出的mp4>
#
# 产出：
#   public/landing/hero-character.mp4          擦洗用视频
#   public/landing/hero-character-poster.jpg   海报图（取视频中间的正面帧）
#
# 参数不可省的原因（改动前先读）：
#   delogo=x=1560:y=985:w=345:h=85  抹掉右下角"可灵"水印，坐标对应 1920×1080 源；
#                                   换分辨率源片必须重新定位水印区域
#   -g 5 -keyint_min 5              关键帧每 5 帧一密——seek 擦洗流畅度的前提，
#                                   默认导出只有片头一个关键帧，倒退 seek 会卡成幻灯片
#   -sc_threshold 0                 禁止场景切换插关键帧，保证间隔稳定
#   -crf 18                         画质档：2x 高分屏用户实测 CRF 22 整体发糊
#   -an -movflags +faststart        去音轨、moov 前置利于流式加载
#
# 源片要求：纯色背景（与站点米白同族最佳）、人物全身入画、
# 头从朝画面左匀速转到朝画面右且中间经过正对镜头、身体其他部位尽量静止。
set -euo pipefail

if [ $# -ne 1 ]; then
  echo "用法: bash scripts/prepare_hero_video.sh <可灵导出的mp4>" >&2
  exit 1
fi

src="$1"
out="public/landing/hero-character.mp4"
poster="public/landing/hero-character-poster.jpg"

ffmpeg -i "$src" \
  -vf "delogo=x=1560:y=985:w=345:h=85" \
  -c:v libx264 -crf 18 -preset slow -g 5 -keyint_min 5 -sc_threshold 0 \
  -an -movflags +faststart -pix_fmt yuv420p "$out" -y

# 海报帧：源片时长中点附近为正对镜头；换源片后若姿势不对，微调 -ss
ffmpeg -ss 2.5 -i "$out" -frames:v 1 -q:v 4 "$poster" -y

echo "完成: $(du -k "$out" | cut -f1) KB + 海报 $(du -k "$poster" | cut -f1) KB"
