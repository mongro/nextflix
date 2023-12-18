import React from "react";

function CarouselSkeleton() {
  return (
    <div className="my-6 mx-4 lg:mx-8 animate-pulse">
      <div className="h-9 my-3 bg-neutral-400 w-32"></div>
      <div className="flex flex-row relative overflow-hidden">
        {Array(6).fill(
          <div className="pr-3 flex-shrink-0 lg:pr-5 basis-4/12 md:basis-3/12 sm:basis-4/12 lg:basis-1/5 xl:basis-2/12">
            <div className="aspect-video bg-neutral-400 rounded "></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarouselSkeleton;
