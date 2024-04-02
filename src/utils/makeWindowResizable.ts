import {BrowserWindow} from 'electron';

const WM_MOUSEMOVE = 0x0200;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mousemove
const WM_LBUTTONUP = 0x0202;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-lbuttonup

const MK_LBUTTON = 0x0001;

// const makeWindowResizable = (browserWindow: BrowserWindow, edgeWidth: number) => {
//     let resizeDirection: string | undefined = undefined;
//
//     const initialPos = {
//         x: 0,
//         y: 0,
//         height: 0,
//         width: 0,
//     };
//
//     const getCursorEdgePosition = (x: number, y: number): string | undefined => {
//         const bounds = browserWindow.getBounds();
//         if (x < bounds.x + edgeWidth) {
//             if (y < bounds.y + edgeWidth) return 'top-left';
//             else if (y > bounds.y + bounds.height - edgeWidth) return 'bottom-left';
//             else return 'left';
//         } else if (x > bounds.x + bounds.width - edgeWidth) {
//             if (y < bounds.y + edgeWidth) return 'top-right';
//             else if (y > bounds.y + bounds.height - edgeWidth) return 'bottom-right';
//             else return 'right';
//         } else if (y < bounds.y + edgeWidth) {
//             return 'top';
//         } else if (y > bounds.y + bounds.height - edgeWidth) {
//             return 'bottom';
//         }
//         return undefined;
//     };
//
//     browserWindow.hookWindowMessage(WM_LBUTTONUP, () => {
//         resizeDirection = undefined;
//     });
//
//     browserWindow.hookWindowMessage(WM_MOUSEMOVE, (wParam: Buffer, lParam: Buffer) => {
//         if (!resizeDirection) {
//             const wParamNumber = wParam.readInt16LE(0);
//             if (!(wParamNumber & MK_LBUTTON)) {
//                 return;
//             }
//
//             const screenX = lParam.readInt16LE(0);
//             const screenY = lParam.readInt16LE(2);
//             resizeDirection = getCursorEdgePosition(screenX, screenY);
//             if (resizeDirection) {
//                 resizing = true;
//                 initialClickPosition = { x: screenX, y: screenY }; // Запоминаем позицию начала изменения размера
//                 const {x, y} = browserWindow.getBounds();
//                 initialClickPosition.x -= x; // Преобразуем глобальные координаты в локальные
//                 initialClickPosition.y -= y;
//             }
//         }
//
//         if (resizeDirection) {
//             const screenX = lParam.readInt16LE(0);
//             const screenY = lParam.readInt16LE(2);
//             const {x, y, width, height} = browserWindow.getBounds();
//
//             const dx = screenX - x - initialClickPosition.x; // Вычисляем изменение координаты X
//             const dy = screenY - y - initialClickPosition.y; // Вычисляем изменение координаты Y
//
//             switch (resizeDirection) {
//             // case 'top-left':
//             //     browserWindow.setBounds({x: screenX, y: screenY, width: width - dx, height: height - dy});
//             //     break;
//             case 'top':
//                 browserWindow.setBounds({y: screenY, height: height - dy});
//                 break;
//             // case 'top-right':
//             //     browserWindow.setBounds({width: width + dx, height: height - dy});
//             //     break;
//             case 'right':
//                 browserWindow.setBounds({width: width + dx});
//                 break;
//             // case 'bottom-right':
//             //     browserWindow.setBounds({width: width + dx, height: height + dy});
//             //     break;
//             case 'bottom':
//                 browserWindow.setBounds({height: height + dy});
//                 break;
//             // case 'bottom-left':
//             //     browserWindow.setBounds({x: screenX, width: width - dx, height: height + dy});
//             //     break;
//             case 'left':
//                 browserWindow.setBounds({x: screenX, width: width - dx});
//                 break;
//             }
//         }
//     });
// };

const makeWindowResizable = (browserWindow: BrowserWindow, edgeWidth: number): void => {
    const initialPos = {
        x: 0,
        y: 0
    };
    let initialBounds: Electron.Rectangle = {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    };

    let resizeDirection: string | undefined = undefined;

    const getCursorEdgePosition = (bounds: Electron.Rectangle, x: number, y: number): string | undefined => {
        if (x <= edgeWidth) {
            if (y <= edgeWidth) return 'top-left';
            else if (y >= bounds.height - edgeWidth) return 'bottom-left';
            else return 'left';
        } else if (x >= bounds.width - edgeWidth) {
            if (y <= edgeWidth) return 'top-right';
            else if (y >= bounds.height - edgeWidth) return 'bottom-right';
            else return 'right';
        } else if (y <= edgeWidth) {
            return 'top';
        } else if (y >= bounds.height - edgeWidth) {
            return 'bottom';
        }
        return undefined;
    };

    browserWindow.hookWindowMessage(WM_LBUTTONUP, () => {
        resizeDirection = undefined;
    });
    browserWindow.hookWindowMessage(WM_MOUSEMOVE, (wParam: Buffer, lParam: Buffer) => {
        if (!browserWindow) {
            return;
        }

        const wParamNumber: number = wParam.readInt16LE(0);

        if (!(wParamNumber & MK_LBUTTON)) {
            return;
        }

        const bounds = browserWindow.getBounds();

        console.log({bounds, position: browserWindow.getPosition(), size: browserWindow.getSize()})

        const relativeX = lParam.readInt16LE(0);
        const relativeY = lParam.readInt16LE(2);

        const absoluteX = bounds.x + relativeX;
        const absoluteY = bounds.y + relativeY;

        if (!resizeDirection) {
            console.log('getCursorEdgePosition ->', {bounds, absoluteX, absoluteY, relativeX, relativeY, edgeWidth});
            resizeDirection = getCursorEdgePosition(bounds, relativeX, relativeY);
            console.log('getCursorEdgePosition <-', {resizeDirection});
            if (resizeDirection) {
                initialPos.x = absoluteX;
                initialPos.y = absoluteY;
                initialBounds = bounds;
            }
            return;
        }

        const dx = absoluteX - initialPos.x; // Вычисляем изменение координаты X
        const dy = absoluteY - initialPos.y; // Вычисляем изменение координаты Y

        console.log('makeWindowResizable', {x: absoluteX, y: absoluteY, dx, dy, initialPos, resizeDirection})

        switch (resizeDirection) {
            // case 'top-left':
            //     browserWindow.setBounds({x: screenX, y: screenY, width: width - dx, height: height - dy});
            //     break;
        case 'top':
            browserWindow.setBounds({y: initialBounds.y + dy, height: initialBounds.height - dy});
            break;
            // case 'top-right':
            //     browserWindow.setBounds({width: width + dx, height: height - dy});
            //     break;
        case 'right':
            browserWindow.setBounds({width: initialBounds.width + dx});
            break;
            // case 'bottom-right':
            //     browserWindow.setBounds({width: width + dx, height: height + dy});
            //     break;
        case 'bottom':
            browserWindow.setBounds({height: initialBounds.height + dy});
            break;
            // case 'bottom-left':
            //     browserWindow.setBounds({x: screenX, width: width - dx, height: height + dy});
            //     break;
        case 'left':
            browserWindow.setBounds({x: initialBounds.x + dx, width: initialBounds.width - dx});
            break;
        }
    });
}

    // browserWindow.setBounds({
    //     x: x + browserWindow.getPosition()[0] - initialPos.x,
    //     y: y + browserWindow.getPosition()[1] - initialPos.y,
    //     height: initialPos.height,
    //     width: initialPos.width,
    // });


export default makeWindowResizable;