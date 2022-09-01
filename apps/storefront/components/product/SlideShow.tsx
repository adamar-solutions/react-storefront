// eslint-disable-next-line import/no-extraneous-dependencies
import "react-slideshow-image/dist/styles.css";

import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Slide } from "react-slideshow-image";

import { getGalleryMedia } from "@/lib/media";
import { ProductDetailsFragment, ProductMediaFragment } from "@/saleor/api";

const properties = {
  prevArrow: (
    <button
      type="button"
      className="w-20 flex justify-center h-full items-center focus-visible:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"
        />
      </svg>
    </button>
  ),
  nextArrow: (
    <button
      type="button"
      className="w-20 flex justify-center h-full items-center focus-visible:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"
        />
      </svg>
    </button>
  ),
};

export interface SliderProps {
  product: ProductDetailsFragment;
}

export const Slider = ({ product }: SliderProps) => {
  const galleryMedia = getGalleryMedia({ product });
  return (
    <Slide autoplay={false} transitionDuration={250} {...properties}>
      {galleryMedia?.map((media: ProductMediaFragment) => (
        <div className="each-slide-effect" key={media.url}>
          {media.type === "IMAGE" && <div style={{ backgroundImage: `url(${media.url})` }} />}
        </div>
      ))}
    </Slide>
  );
};

export default Slider;
