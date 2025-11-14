"use client";

import React, { useState } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import { UserIcon } from "@heroicons/react/24/solid";

interface AvatarProps extends Omit<ImageProps, "src"> {
  src: string | StaticImageData | undefined;
}

const Avatar = (props: AvatarProps) => {
  const { src, className, alt, ...rest } = props;
  const [showFallback, setShowFallback] = useState(false);
  console.log("src", src);
  return !showFallback && src ? (
    <Image
      {...rest}
      src={src}
      alt={alt}
      className={className}
      width={256}
      height={256}
      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw,20vw"
      onError={() => {
        setShowFallback(true);
      }}
    />
  ) : (
    <UserIcon className={className} />
  );
};

export default Avatar;
