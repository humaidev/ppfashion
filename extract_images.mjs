import fs from 'fs';
import exportImages from 'pdf-export-images';

fs.mkdirSync('public/pdf-images', { recursive: true });

exportImages('public/Brochure-2.pdf', 'public/pdf-images')
  .then(images => console.log('Exported', images.length, 'images'))
  .catch(console.error);
