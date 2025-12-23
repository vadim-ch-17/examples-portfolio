"use client";

import cn from "classnames";
import { useState } from "react";

type Size = "sm" | "md" | "lg" | "xl" | "2xl";

const STAR_SIZE_MAP: Record<Size, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 80,
  "2xl": 96,
};

const calculateStarValue = (
  e: React.MouseEvent<HTMLButtonElement>,
  index: number,
  precision: number
): number => {
  if (precision === 1) {
    return index + 1;
  }

  const rect = e.currentTarget.getBoundingClientRect();
  const relativeX = e.clientX - rect.left;
  const percentage = Math.min(Math.max(relativeX / rect.width, 0), 1);

  const fractionalValue = Math.ceil(percentage * precision) / precision;
  return index + fractionalValue;
};

export type RatingStarsProps = {
  className?: string;
  value: number;
  items?: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: Size;
  fillColor?: string;
  emptyFillColor?: string;
  emptyStrokeColor?: string;
  strokeWidth?: number;
  precision?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
};

export const RatingStars = ({
  items = 5,
  value,
  size = "md",
  className,
  onChange,
  readonly = false,
  fillColor = "var(--color-brand-orange)",
  emptyFillColor = "var(--color-brand-gray-3)",
  emptyStrokeColor = "transparent",
  strokeWidth = 2,
  precision = 1,
}: RatingStarsProps) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const sizeInPixels = STAR_SIZE_MAP[size];
  const displayValue = hoverValue ?? value;

  const getFillPercentage = (index: number): number => {
    const starStart = index;
    const starEnd = index + 1;

    if (displayValue >= starEnd) return 100;
    if (displayValue <= starStart) return 0;

    return (displayValue - starStart) * 100;
  };

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (readonly || !onChange) return;

    const newValue = calculateStarValue(e, index, precision);

    if (precision === 1) {
      const clickedStar = index + 1;
      const isDeselectingStar = value === clickedStar;
      if (isDeselectingStar) {
        onChange(clickedStar - 1);
      } else {
        onChange(clickedStar);
      }
      return;
    }

    const tolerance = 1 / precision + 0.05;
    const isSameValue = Math.abs(newValue - value) < tolerance;

    if (isSameValue) {
      const decreasedValue = Math.floor(value);
      const finalValue =
        value === Math.ceil(value) ? Math.max(0, value - 1) : decreasedValue;
      onChange(finalValue);
    } else {
      onChange(newValue);
    }
  };

  const handleHover = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (readonly) return;
    setHoverValue(calculateStarValue(e, index, precision));
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2",
        !readonly && "cursor-pointer",
        className
      )}
      onMouseLeave={() => !readonly && setHoverValue(null)}>
      {Array.from({ length: items }, (_, index) => {
        const fillPercentage = getFillPercentage(index);
        const gradientId = `star-gradient-${index}-${size}`;
        const strokeColor = emptyStrokeColor; //fillPercentage > 0 ? fillColor : emptyStrokeColor;

        return (
          <button
            key={index}
            type="button"
            className={cn(
              "focus:outline-none",
              readonly ? "cursor-default" : "cursor-pointer"
            )}
            onClick={(e) => handleClick(e, index)}
            onMouseMove={(e) => handleHover(e, index)}
            disabled={readonly}>
            <svg
              width={sizeInPixels}
              height={sizeInPixels}
              viewBox="0 0 52 52"
              fill="none"
              className="transition-all duration-300">
              <defs>
                <linearGradient id={gradientId}>
                  <stop offset={`${fillPercentage}%`} stopColor={fillColor} />
                  <stop
                    offset={`${fillPercentage}%`}
                    stopColor={emptyFillColor}
                  />
                </linearGradient>
              </defs>

              <path
                d="M24.2063 7.96725C24.9399 6.48091 27.0594 6.48091 27.7931 7.96724L32.2298 16.9555C32.5209 17.5452 33.0832 17.9541 33.7339 18.0492L43.6588 19.4999C45.2986 19.7396 45.9522 21.7553 44.765 22.9116L37.5866 29.9033C37.1148 30.3628 36.8995 31.0251 37.0108 31.6741L38.7045 41.5492C38.9848 43.1832 37.2697 44.4291 35.8024 43.6575L26.9306 38.9919C26.3478 38.6854 25.6515 38.6854 25.0688 38.9919L16.1969 43.6575C14.7297 44.4291 13.0146 43.1832 13.2948 41.5492L14.9885 31.6741C15.0998 31.0251 14.8845 30.3628 14.4128 29.9033L7.23436 22.9116C6.04718 21.7553 6.70075 19.7396 8.34057 19.4999L18.2654 18.0492C18.9161 17.9541 19.4785 17.5452 19.7696 16.9555L24.2063 7.96725Z"
                fill={`url(#${gradientId})`}
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
};
