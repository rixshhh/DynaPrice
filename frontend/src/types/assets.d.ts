declare module '*.jpeg' {
  const image: { src: string; height: number; width: number; blurDataURL?: string };
  export default image;
}

declare module '*.jpg' {
  const image: { src: string; height: number; width: number; blurDataURL?: string };
  export default image;
}

declare module '*.svg' {
  const image: { src: string; height: number; width: number; blurDataURL?: string };
  export default image;
}
