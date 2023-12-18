import React from "react";
import Image, { ImageProps } from "next/image";

const base_imageUrl = "https://image.tmdb.org/t/p/original";
// eslint-disable-next-line react/display-name
const ImageWithTmdbUrl = React.forwardRef(
  ({ src, ...props }: ImageProps, ref) => (
    <Image {...props} src={`${base_imageUrl}/${src}`} />
  )
);

export default ImageWithTmdbUrl;
