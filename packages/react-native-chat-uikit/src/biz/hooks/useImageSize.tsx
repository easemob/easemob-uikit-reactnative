import * as React from 'react';

export type UseImageSizeProps = {};
export function useImageSize(props: UseImageSizeProps) {
  const {} = props;

  /**
   * Calculate the size of an image to fit within a container while maintaining aspect ratio (contain mode)
   * Similar to CSS object-fit: contain - image is scaled to fit within container, may have empty space
   * @param imageWidth - Original image width
   * @param imageHeight - Original image height
   * @param maxWidth - Maximum container width
   * @param maxHeight - Maximum container height
   * @returns Calculated size that fits within container while maintaining aspect ratio
   */
  const getImageSizeContain = React.useCallback(
    (
      imageWidth: number,
      imageHeight: number,
      maxWidth: number,
      maxHeight: number
    ) => {
      if (
        imageWidth <= 0 ||
        imageHeight <= 0 ||
        maxWidth <= 0 ||
        maxHeight <= 0
      ) {
        return { width: 0, height: 0 };
      }

      // Calculate aspect ratios
      const imageAspectRatio = imageWidth / imageHeight;
      const containerAspectRatio = maxWidth / maxHeight;

      let resultWidth: number;
      let resultHeight: number;

      if (imageAspectRatio > containerAspectRatio) {
        resultWidth =
          imageWidth < maxWidth
            ? Math.max(imageWidth, maxWidth)
            : Math.min(imageWidth, maxWidth);
        resultHeight = resultWidth / imageAspectRatio;
      } else {
        resultHeight =
          imageHeight < maxHeight
            ? Math.max(imageHeight, maxHeight)
            : Math.min(imageHeight, maxHeight);
        resultWidth = resultHeight * imageAspectRatio;
      }

      return { width: resultWidth, height: resultHeight };
    },
    []
  );

  /**
   * Calculate the size of an image to cover a container while maintaining aspect ratio (cover mode)
   * Similar to CSS object-fit: cover - image is scaled to cover entire container, may overflow
   * @param imageWidth - Original image width
   * @param imageHeight - Original image height
   * @param minWidth - Minimum container width to cover
   * @param minHeight - Minimum container height to cover
   * @returns Calculated size that covers the container while maintaining aspect ratio
   */
  const getImageSizeCover = React.useCallback(
    (
      imageWidth: number,
      imageHeight: number,
      minWidth: number,
      minHeight: number
    ) => {
      if (
        imageWidth <= 0 ||
        imageHeight <= 0 ||
        minWidth <= 0 ||
        minHeight <= 0
      ) {
        return { width: 0, height: 0 };
      }

      const imageAspectRatio = imageWidth / imageHeight;
      const containerAspectRatio = minWidth / minHeight;

      let resultWidth: number;
      let resultHeight: number;

      if (imageAspectRatio > containerAspectRatio) {
        resultHeight =
          imageHeight > minHeight
            ? Math.min(imageHeight, minHeight)
            : Math.max(imageHeight, minHeight);
        resultWidth = resultHeight * imageAspectRatio;
      } else {
        resultWidth =
          imageWidth > minWidth
            ? Math.min(imageWidth, minWidth)
            : Math.max(imageWidth, minWidth);
        resultHeight = resultWidth / imageAspectRatio;
      }

      return { width: resultWidth, height: resultHeight };
    },
    []
  );

  // Keep the old function for backward compatibility
  const getImageSize = React.useCallback(
    (
      imageHight: number,
      imageWidth: number,
      maxHeight: number,
      maxWidth: number
    ) => {
      // !!! Save the original proportions of the image, with the height and width not exceeding the screen
      const ratio = imageHight / imageWidth;
      if (maxWidth < imageWidth) {
        const w = maxWidth;
        const h = maxWidth * ratio;
        if (maxHeight < h) {
          return { width: maxHeight / ratio, height: maxHeight };
        }
        return { width: w, height: h };
      } else if (maxHeight < imageHight) {
        const h = maxHeight;
        const w = maxHeight / ratio;
        if (maxWidth < w) {
          return { width: maxWidth, height: maxWidth * ratio };
        }
        return { width: w, height: h };
      } else {
        return { width: imageWidth, height: imageHight };
      }
    },
    []
  );

  return {
    getImageSize,
    getImageSizeContain,
    getImageSizeCover,
  };
}
