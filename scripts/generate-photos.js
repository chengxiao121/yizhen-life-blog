import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const photosDir = path.join(__dirname, '..', 'public', 'images', 'photos');
const outputFile = path.join(__dirname, '..', 'public', 'data', 'photos.json');

async function scanPhotos(dir) {
  const photos = [];
  let id = 1;

  async function walk(currentDir) {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(currentDir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(entry.name)) {
        try {
          const metadata = await sharp(fullPath).metadata();
          const relativePath = path.relative(path.join(__dirname, '..', 'public'), fullPath).replace(/\\/g, '/');

          photos.push({
            id: `photo-${String(id).padStart(3, '0')}`,
            filename: entry.name,
            path: `/${relativePath}`,
            title: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
            width: metadata.width,
            height: metadata.height,
            tags: []
          });
          id++;
        } catch (err) {
          console.warn(`无法读取 ${entry.name}: ${err.message}`);
        }
      }
    }
  }

  await walk(dir);
  return photos;
}

async function main() {
  console.log('扫描照片目录...');
  const photos = await scanPhotos(photosDir);

  // 按文件名排序
  photos.sort((a, b) => a.filename.localeCompare(b.filename));

  // 写入 JSON 文件
  fs.writeFileSync(outputFile, JSON.stringify({ photos }, null, 2), 'utf-8');

  console.log(`完成！共找到 ${photos.length} 张照片`);
  console.log(`已更新 ${outputFile}`);
}

main().catch(console.error);
