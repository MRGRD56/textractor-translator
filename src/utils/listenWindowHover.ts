// import type {BrowserWindow} from 'electron';
// import ref, {alloc, types} from 'ref-napi';
// import StructTypeConstructor from 'ref-struct-di';
// import ffi = require('ffi-napi');
//
// const StructType = StructTypeConstructor(ref);
//
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
// const trackWindowHover = (browserWindow: BrowserWindow) => {
//     const hwnd = browserWindow.getNativeWindowHandle();
//
//     const eventTrack = new TRACKMOUSEEVENT({
//         cbSize: TRACKMOUSEEVENT.size,
//         dwFlags: 0x00000002 | 0x00000010, // TME_LEAVE | TME_NONCLIENT
//         hwndTrack: hwnd.readInt32LE(0),
//         dwHoverTime: 0
//     });
//
//     const eventTrackPtr = alloc(TRACKMOUSEEVENT, eventTrack);
//
//     const result = user32.TrackMouseEvent(eventTrackPtr.ref());
//
//     if (!result) {
//         console.error('Error calling TrackMouseEvent');
//     }
// };
//
// export default trackWindowHover;