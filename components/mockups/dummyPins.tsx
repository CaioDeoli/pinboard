type Pin = {
  id: string | number;
  src: string;
  alt?: string;
  width?: number; // optional intrinsic width
  height?: number; // optional intrinsic height
  title?: string;
};

export const dummyPins: Pin[] = Array.from({ length: 100 }).map((_, i) => {
  // create variable aspect images from picsum
  const w = 600 + (i % 5) * 100;
  const h = 400 + ((i * 37) % 7) * 120;
  return {
  id: i + 1,
  src: `https://picsum.photos/id/${10 + i}/${w}/${h}`,
  alt: `Random ${i + 1}`,
  width: w,
  height: h,
  title: `Pin #${i + 1}`,
  };
});