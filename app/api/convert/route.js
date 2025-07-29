import { NextResponse } from 'next/server';
import busboy from 'busboy';
import sharp from 'sharp';
import { Readable } from 'stream';

export const POST = async (req) => {
  const contentType = req.headers.get('content-type');

  if (!contentType?.includes('multipart/form-data')) {
    return NextResponse.json({ error: 'Invalid content-type' }, { status: 400 });
  }

  const bb = busboy({ headers: { 'content-type': contentType } });

  let imageBuffer = null;
  let targetFormat = 'png';

  const stream = Readable.fromWeb(req.body);

  const result = new Promise((resolve, reject) => {
    bb.on('file', (_, file) => {
      const chunks = [];
      file.on('data', (data) => chunks.push(data));
      file.on('end', () => {
        imageBuffer = Buffer.concat(chunks);
      });
    });

    bb.on('field', (name, value) => {
      if (name === 'format') targetFormat = value.toLowerCase();
    });

    bb.on('finish', resolve);
    bb.on('error', reject);

    stream.pipe(bb);
  });

  try {
    await result;

    if (!imageBuffer) {
      return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
    }

    const supportedFormats = ['png', 'jpg', 'jpeg', 'webp', 'tiff', 'avif', 'bmp'];
    if (!supportedFormats.includes(targetFormat)) {
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
    }

    const convertedBuffer = await sharp(imageBuffer).toFormat(targetFormat).toBuffer();

    return new NextResponse(convertedBuffer, {
      status: 200,
      headers: {
        'Content-Type': `image/${targetFormat === 'jpg' ? 'jpeg' : targetFormat}`,
        'Content-Disposition': `inline; filename=converted.${targetFormat}`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json({ error: 'Image conversion failed' }, { status: 500 });
  }
};
