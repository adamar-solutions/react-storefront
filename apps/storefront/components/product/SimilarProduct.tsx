import React from "react";

// eslint-disable-next-line import/no-extraneous-dependencies
import { Slider } from "@/components/product/SlideShow";
// import { getGalleryMedia } from "@/lib/media";
import { ProductDetailsFragment } from "@/saleor/api";

export interface SimilarProduct {
  product: ProductDetailsFragment;
}

export const SimilarProduct = ({ product }: SimilarProduct) => (
    <div className="flex flex-col gap-4">
      <h4>Похожие модели</h4>
      <div className="col-span-1">
        <Slider product={product} />
      </div>
    </div>
  );

export default SimilarProduct;
