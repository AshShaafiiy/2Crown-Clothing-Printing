import ImageKit from "imagekit";

// DEFERRED: ImageKit integration is deferred until file upload functionality is built out
export const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "your_public_key",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "your_private_key",
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/your_endpoint"
});
