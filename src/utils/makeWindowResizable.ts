import {BrowserWindow} from 'electron';

const WM_MOUSEMOVE = 0x0200;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mousemove
const WM_LBUTTONUP = 0x0202;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-lbuttonup

const MK_LBUTTON = 0x0001;

const makeWindowResizable = (browserWindow: BrowserWindow, edgeWidth: number) => {
    let resizing = false;
    let resizeDirection = '';

    browserWindow.hookWindowMessage(WM_LBUTTONUP, () => {
        resizing = false;
        resizeDirection = '';
    });

    const getCursorEdgePosition = (x: number, y: number) => {
        const bounds = browserWindow.getBounds();
        if (x < bounds.x + edgeWidth) {
            if (y < bounds.y + edgeWidth) return 'top-left';
            else if (y > bounds.y + bounds.height - edgeWidth) return 'bottom-left';
            else return 'left';
        } else if (x > bounds.x + bounds.width - edgeWidth) {
            if (y < bounds.y + edgeWidth) return 'top-right';
            else if (y > bounds.y + bounds.height - edgeWidth) return 'bottom-right';
            else return 'right';
        } else if (y < bounds.y + edgeWidth) {
            return 'top';
        } else if (y > bounds.y + bounds.height - edgeWidth) {
            return 'bottom';
        }
        return '';
    };

    browserWindow.hookWindowMessage(WM_MOUSEMOVE, (wParam: Buffer, lParam: Buffer) => {
        if (resizeDirection === '' && !resizing) {
            const wParamNumber: number = wParam.readInt16LE(0);
            // if left mouse button is not being pressed
            if (!(wParamNumber & MK_LBUTTON)) {
                return;
            }

            const screenX = lParam.readInt16LE(0);
            const screenY = lParam.readInt16LE(2);
            const [windowX, windowY] = browserWindow.getPosition();

            const x = screenX - windowX;
            const y = screenY - windowY;

            resizeDirection = getCursorEdgePosition(x, y);
            if (resizeDirection) {
                resizing = true;
            }
        }

        if (resizing) {
            const screenX = lParam.readInt16LE(0);
            const screenY = lParam.readInt16LE(2);
            // const [windowX, windowY] = browserWindow.getPosition();

            // const relativeX = screenX - windowX;
            // const relativeY = screenY - windowY;

            const {x, y, width, height} = browserWindow.getBounds();

            switch (resizeDirection) {
            case 'top-left':
                browserWindow.setBounds({x: screenX, y: screenY, width: width + x - screenX, height: height + y - screenY});
                break;
            case 'top':
                browserWindow.setBounds({y: screenY, height: height + y - screenY});
                break;
            case 'top-right':
                browserWindow.setBounds({y: screenY, width: screenX - x, height: height + y - screenY});
                break;
            case 'right':
                browserWindow.setBounds({width: screenX - x});
                break;
            case 'bottom-right':
                browserWindow.setBounds({width: screenX - x, height: screenY - y});
                break;
            case 'bottom':
                browserWindow.setBounds({height: screenY - y});
                break;
            case 'bottom-left':
                browserWindow.setBounds({x: screenX, width: width + x - screenX, height: screenY - y});
                break;
            case 'left':
                browserWindow.setBounds({x: screenX, width: width + x - screenX});
                break;
            }
        }
    });
};


export default makeWindowResizable;