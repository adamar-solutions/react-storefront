import { ChipButton } from "@saleor/ui-kit";
import React from "react";

// import { Box } from "../Box";
import { RichText } from "../RichText";

export interface PageHeroProps {
  title: string;
  description?: string;
  pills?: {
    label: string;
    onClick: () => void;
  }[];
}

export const PageHero = ({ title, description, pills = [] }: PageHeroProps) => (
  <div className="sm:text-left">
    <h1 className="text-lg font-bold" data-testid={`titleOf${title}`}>
      {title}
    </h1>

    {description && (
      <div className="inline-block sm:block text-main-1">
        <RichText jsonStringData={description} />
      </div>
    )}
    {pills.length > 0 && (
      <div className="flex gap-2 flex-wrap mt-2">
        {pills.map((pill) => (
          <ChipButton key={pill.label} label={pill.label} onClick={pill.onClick} />
        ))}
      </div>
    )}
  </div>
);

export default PageHero;
