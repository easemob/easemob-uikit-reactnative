import * as React from 'react';

import { ComponentArea, ComponentArea1, ComponentArea2 } from './types';

export function useContextMenu() {
  const convertComponentCoordinate = React.useCallback(
    (params: ComponentArea): ComponentArea1 => {
      if (params.hasOwnProperty('x')) {
        const {
          x: x,
          y: y,
          width: width,
          height: height,
        } = params as ComponentArea2;
        const leftTop = { x: x, y: y };
        const rightTop = { x: x + width, y: y };
        const leftBottom = { x: x, y: y + height };
        const rightBottom = {
          x: x + width,
          y: y + height,
        };
        return {
          leftTop,
          rightTop,
          leftBottom,
          rightBottom,
        };
      } else {
        return params as ComponentArea1;
      }
    },
    []
  );

  // If there is enough height above the restricted overlay area, the component is displayed above the restricted overlay area, setting the bottom value
  // If there is enough height below the restricted overlay area, the component is displayed below the restricted overlay area, setting the top value
  // If there is enough width to the left of the restricted overlay area, the component is displayed to the left of the restricted overlay area, setting the right value
  // If there is enough width to the right of the restricted overlay area, the component is displayed to the right of the restricted overlay area, setting the left value
  const reviseComponentPosition = React.useCallback(
    (params: {
      screenWidth: number;
      screenHeight: number;
      componentWidth: number;
      componentHeight: number;
      noCoverageArea?: ComponentArea;
      position: {
        left?: number;
        top?: number;
        right?: number;
        bottom?: number;
      };
    }) => {
      const {
        screenHeight,
        screenWidth,
        componentHeight,
        componentWidth,
        noCoverageArea,
        position,
      } = params;
      if (noCoverageArea) {
        const c = convertComponentCoordinate(noCoverageArea);
        const left = c.leftTop.x;
        const top = c.leftTop.y;
        const right = c.rightBottom.x;
        const bottom = c.rightBottom.y;
        if (top >= componentHeight) {
          position.bottom = screenHeight - top;
          position.top = undefined;
        } else if (screenHeight - bottom >= componentHeight) {
          position.top = bottom;
          position.bottom = undefined;
        } else if (left >= componentWidth) {
          position.right = screenWidth - left;
          position.left = undefined;
        } else if (screenWidth - right >= componentWidth) {
          position.left = right;
          position.right = undefined;
        }
      }
      return position;
    },
    [convertComponentCoordinate]
  );

  // Calculate the position of the component.
  // By pressing the screen coordinate position, calculate the top, bottom, left, and right positions of the component on the screen based on the component's width and height.
  // Since the component may exceed the screen bounds due to its width or height, the position of the component needs to be adjusted.
  // If the distance from the left side of the component to the right side of the screen is less than the component's width, set the left value to undefined and the right value to the mouse click position.
  // If the distance from the right side of the component to the left side of the screen is less than the component's width, set the right value to undefined and the left value to the mouse click position.
  // If the distance from the top side of the component to the bottom side of the screen is less than the component's height, set the top value to undefined and the bottom value to the mouse click position.
  // If the distance from the bottom side of the component to the top side of the screen is less than the component's height, set the bottom value to undefined and the top value to the mouse click position.
  const calculateComponentPosition = React.useCallback(
    (params: {
      pressedX: number;
      pressedY: number;
      screenWidth: number;
      screenHeight: number;
      componentWidth: number;
      componentHeight: number;
      noCoverageArea?: ComponentArea;
    }) => {
      const {
        pressedX,
        pressedY,
        screenWidth,
        screenHeight,
        componentWidth,
        componentHeight,
      } = params;
      let left: number | undefined = pressedX;
      let top: number | undefined = pressedY;
      let right: number | undefined;
      let bottom: number | undefined;
      if (pressedX + componentWidth > screenWidth) {
        if (pressedX > componentWidth) {
          left = undefined;
          right = screenWidth - pressedX;
        } else {
          left = (screenWidth - componentWidth) / 2;
          right = undefined;
        }
      }
      if (pressedY + componentHeight > screenHeight) {
        if (pressedY > componentHeight) {
          top = undefined;
          bottom = screenHeight - pressedY;
        } else {
          top = (screenHeight - componentHeight) / 2;
          bottom = undefined;
        }
      }
      return reviseComponentPosition({
        ...params,
        position: { left, top, right, bottom },
      });
    },
    [reviseComponentPosition]
  );

  // Calculate the screen coordinates of the 4 vertices of the component.
  // By using the screen coordinates of the pressed position, get the current screen coordinates of the component (one of the 4 vertices).
  // The component is divided into 4 quadrants: top-left, top-right, bottom-left, and bottom-right. If the pressed coordinates are in one of these quadrants, return the coordinates of the vertex in that quadrant.
  const getComponentVerticesCoordinate = React.useCallback(
    (params: {
      pressedX: number;
      pressedY: number;
      componentX: number;
      componentY: number;
      componentWidth: number;
      componentHeight: number;
    }): { x: number; y: number } => {
      const {
        pressedX,
        pressedY,
        componentX,
        componentY,
        componentWidth,
        componentHeight,
      } = params;
      const leftTop = { x: componentX, y: componentY };
      const rightTop = { x: componentX + componentWidth, y: componentY };
      const leftBottom = { x: componentX, y: componentY + componentHeight };
      const rightBottom = {
        x: componentX + componentWidth,
        y: componentY + componentHeight,
      };
      const center = {
        x: componentX + componentWidth / 2,
        y: componentY + componentHeight / 2,
      };

      const inLeftTop =
        pressedX >= leftTop.x &&
        pressedX <= center.x &&
        pressedY >= leftTop.y &&
        pressedY <= center.y;
      const inRightTop =
        pressedX >= center.x &&
        pressedX <= rightTop.x &&
        pressedY >= rightTop.y &&
        pressedY <= center.y;
      const inLeftBottom =
        pressedX >= leftBottom.x &&
        pressedX <= center.x &&
        pressedY >= center.y &&
        pressedY <= leftBottom.y;
      const inRightBottom =
        pressedX >= center.x &&
        pressedX <= rightBottom.x &&
        pressedY >= center.y &&
        pressedY <= rightBottom.y;
      if (inLeftTop) {
        return leftTop;
      } else if (inRightTop) {
        return rightTop;
      } else if (inLeftBottom) {
        return leftBottom;
      } else if (inRightBottom) {
        return rightBottom;
      } else {
        return { x: 0, y: 0 };
      }
    },
    []
  );

  return {
    calculateComponentPosition,
    getComponentVerticesCoordinate,
    convertComponentCoordinate,
  };
}
