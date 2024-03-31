import {BrowserWindow} from 'electron';

const WM_MOUSEMOVE = 0x0200;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mousemove
const WM_MOUSELEAVE = 0x02a3;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mouseleave

const trackWindowHover = (browserWindow: BrowserWindow, onChange: (isHover: boolean) => void): void => {
    let isHover = false;

    browserWindow.hookWindowMessage(WM_MOUSELEAVE, () => {
        console.log('WM_MOUSELEAVE');
        if (isHover) {
            onChange(false);
        }
        isHover = false;
    });

    browserWindow.hookWindowMessage(WM_MOUSEMOVE, () => {
        console.log('WM_MOUSEMOVE');
        if (!isHover) {
            onChange(true);
        }
        isHover = true;
    });

    console.log('listening for WM_MOUSELEAVE, WM_MOUSEMOVE')
}

export default trackWindowHover;