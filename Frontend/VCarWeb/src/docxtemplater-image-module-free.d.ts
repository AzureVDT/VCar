declare module 'docxtemplater-image-module-free' {
  // Cấu trúc tùy chỉnh cho options của ImageModule
  interface ImageModuleOptions {
    centered?: boolean;
    getImage: (tagValue: string) => Promise<ArrayBuffer> | ArrayBuffer;
    getSize: (img: ArrayBuffer) => [number, number];
  }

  // ImageModule là một class, cần xuất constructor
  class ImageModule {
    constructor(options: ImageModuleOptions);
  }

  export default ImageModule;
}
