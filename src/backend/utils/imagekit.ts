import ImageKit from 'imagekit';

export const getImageKitClient = () => {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    throw new Error('ImageKit environment variables are missing');
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
};

export const deleteImageKitFile = async (fileId: string) => {
  if (!fileId) return;
  try {
    const ik = getImageKitClient();
    await ik.deleteFile(fileId);
  } catch (error) {
    console.error('Failed to delete ImageKit file:', fileId, error);
  }
};
