"use client";

import React from "react";
import { LazyMotion } from "framer-motion";

const loadFeatures = () =>
  import("../../../framerFeatures.js").then((res) => {
    return res.default;
  });
interface Props {
  children: React.ReactNode;
}

function FramerWrapper({ children }: Props) {
  return <LazyMotion features={loadFeatures}>{children}</LazyMotion>;
}

export default FramerWrapper;
