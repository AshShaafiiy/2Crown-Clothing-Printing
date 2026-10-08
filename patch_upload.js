const fs = require('fs');
const file = 'src/services/api/index.ts';
let code = fs.readFileSync(file, 'utf8');

const oldUpload = `  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    const result = await apiClient<{url: string}>('/upload', {
      method: 'POST',
      body: formData
    });
    return result.url;
  }`;

const newUpload = `  async uploadImage(file: File): Promise<{url: string, imageFileId: string}> {
    const authRes = await apiClient<{token: string, expire: number, signature: string}>('/upload/imagekit-auth');
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name || 'product');
    formData.append('folder', '/2crown/products/');
    formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || '');
    formData.append('signature', authRes.signature);
    formData.append('expire', authRes.expire.toString());
    formData.append('token', authRes.token);

    const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });

    if (!uploadRes.ok) throw new Error('ImageKit upload failed');
    const data = await uploadRes.json();
    return { url: data.url, imageFileId: data.fileId };
  }`;

code = code.replace(oldUpload, newUpload);
fs.writeFileSync(file, code);
