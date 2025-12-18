"use client";
import React, { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import "./carousel.css";

interface Props {
  children?: React.ReactNode;
}

function Carousel({ children }: Props) {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <Swiper
      style={{ overflow: "visible" }}
      lazyPreloadPrevNext={2}
      loop={true}
      modules={[Navigation]}
      slidesPerView="auto"
      onBeforeInit={(swiper) => {
        swiperRef.current = swiper;
      }}
    >
      {React.Children.count(children) > 0 &&
        React.Children.map(children, (child) => (
          <SwiperSlide>{child}</SwiperSlide>
        ))}
      <button
        className="absolute -left-4 lg:-left-10 top-0 w-8 lg:w-10 h-full z-50 flex flex-col justify-center cursor-pointer bg-background/80 text-muted-foreground hover:text-foreground"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="previous slide"
      >
        <ChevronLeftIcon />
      </button>
      <button
        className="absolute -right-4 lg:-right-10 top-0 w-8 lg:w-10 h-full z-50 flex flex-col justify-center cursor-pointer bg-background/80 text-muted-foreground hover:text-foreground"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="next slide"
      >
        <ChevronRightIcon />
      </button>
    </Swiper>
  );
}

export default Carousel;
