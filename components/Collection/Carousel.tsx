"use client";
import React, { useRef } from "react";
import { Navigation, Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import "./carousel.css";

interface Props {
  children?: React.ReactChild[] | undefined;
}

function Carousel({ children }: Props) {
  const swiperRef = useRef<SwiperType>();

  return (
    <div>
      {
        <Swiper
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
          <div
            className="absolute left-0 top-0 w-10 h-full z-50 flex flex-col justify-center cursor-pointer bg-neutral-600/20 hover:bg-neutral-600/50 text-white"
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <ChevronLeftIcon />
          </div>
          <button
            className="absolute right-0 top-0 w-10 h-full z-50 flex flex-col justify-center cursor-pointer bg-neutral-600/20 hover:bg-neutral-600/50 text-white"
            onClick={() => swiperRef.current?.slideNext()}
          >
            <ChevronRightIcon />
          </button>
        </Swiper>
      }
    </div>
  );
}

export default Carousel;
