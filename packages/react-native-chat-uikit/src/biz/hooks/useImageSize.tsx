import * as React from 'react';

export type UseImageSizeProps = {};
export function useImageSize(props: UseImageSizeProps) {
  const {} = props;
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
  };
}
