import type {BrowserWindow} from 'electron';
// import ref, {alloc, types} from 'ref-napi';
// import StructTypeConstructor from 'ref-struct-di';
// import ffi from 'ffi-napi';
import ffi, {createPointer, DataType} from 'ffi-rs';

ffi.open({
    library: 'user32',
    path: 'user32.dll'
});

ffi.open({
    library: 'kernel32',
    path: 'kernel32.dll'
});

// const StructType = StructTypeConstructor(ref);

// const user32 = ffi.Library('user32.dll', {
//     'TrackMouseEvent': ['bool', ['pointer']]
// });
//
// const TRACKMOUSEEVENT = StructType({
//     cbSize: types.uint32,
//     dwFlags: types.uint32,
//     hwndTrack: types.uint32,
//     dwHoverTime: types.uint32
// });
//
const WM_MOUSEHOVER   = 0x02A1;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mousehover
const WM_MOUSELEAVE   = 0x02a3;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-mouseleave
const WM_NCMOUSEHOVER = 0x02a0;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-ncmousehover
const WM_NCMOUSELEAVE = 0x02a2;  // https://learn.microsoft.com/en-us/windows/win32/inputdev/wm-ncmouseleave

const TME_CANCEL = 0x80000000;
const TME_HOVER = 0x00000001;
const TME_LEAVE = 0x00000002;
const TME_NONCLIENT = 0x00000010;

const TRACKMOUSEEVENT = {
    cbSize: DataType.I32,
    dwFlags: DataType.I32,
    hwndTrack: DataType.U64,
    dwHoverTime: DataType.I32
};

const trackWindowHover = (browserWindow: BrowserWindow, onChange: (isHover: boolean) => void): void => {
    const hwnd = browserWindow.getNativeWindowHandle();

    console.log()

    // const byteSize = hwnd.byteLength;
    // const trackMouseEvent = Buffer.alloc(4 + 4 + byteSize + 4);
    // trackMouseEvent.writeUint32LE(4 * 4, 0 * 4);
    // trackMouseEvent.writeUint32LE(TME_LEAVE, 1 * 4);
    // hwnd.copy(trackMouseEvent, 2 * 4);
    // trackMouseEvent.writeUint32LE(300, (2 + byteSize) * 4);

    const trackMouseEvent = {
        cbSize: 5 * 4,
        dwFlags: TME_LEAVE,
        hwndTrack: hwnd.readBigUInt64LE(),
        dwHoverTime: 300
    };

    const trackMouseEventPtr = createPointer({
        paramsType: [TRACKMOUSEEVENT],
        paramsValue: [trackMouseEvent]
    })[0];

    const isSuccess = ffi.load({
        library: 'user32',
        funcName: 'TrackMouseEvent',
        retType: DataType.Boolean,
        paramsType: [DataType.External],
        paramsValue: [trackMouseEventPtr]
    });

    if (!isSuccess) {
        const errorCode = ffi.load({
            library: 'kernel32',
            funcName: 'GetLastError',
            retType: DataType.I32,
            paramsType: [],
            paramsValue: []
        });

        console.error(`Error calling TrackMouseEvent. Error code: ${errorCode} (0x${errorCode.toString(16)})`);
        return;
    }

    let isHover = false;

    browserWindow.hookWindowMessage(WM_MOUSELEAVE, () => {
        console.log('WM_MOUSELEAVE');
        if (isHover) {
            onChange(false);
        }
        isHover = false;
    });

    browserWindow.hookWindowMessage(WM_MOUSEHOVER, () => {
        console.log('WM_MOUSEHOVER');
        if (!isHover) {
            onChange(true);
        }
        isHover = true;
    });

    browserWindow.hookWindowMessage(WM_NCMOUSEHOVER, () => {
        console.log('WM_NCMOUSEHOVER');
    });

    browserWindow.hookWindowMessage(WM_NCMOUSELEAVE, () => {
        console.log('WM_NCMOUSELEAVE');
    });

    console.log('listening for trackWindowHover')
}

export default trackWindowHover;