import * as React from 'react';

export type useImageSizeProps = {};
export function useImageSize(props: useImageSizeProps) {
  const {} = props;
  const getImageSize = React.useCallback(
    (
      imageHight: number,
      imageWidth: number,
      maxHeight: number,
      maxWidth: number
    ) => {
      // todo: 保存图片原始比例，高度和宽度不超过屏幕
      const ratio = imageHight / imageWidth;
      // const maxWidth = winWidth;
      // const maxHeight = winHeight;
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
