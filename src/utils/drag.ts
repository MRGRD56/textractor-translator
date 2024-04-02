// import remote from '@electron/remote'
// import BrowserWindow = Electron.CrossProcessExports.BrowserWindow;
// // @ts-ignore
// import mouseConstructor = require('win-mouse');
//
// /** @deprecated */
// const drag = function(element: HTMLElement) {
//     let offset: [number, number] | undefined;
//     let win: BrowserWindow | undefined;
//     let size: number[] | undefined;
//     const mouse = mouseConstructor();
//
//     const handleMouseDown = (e: MouseEvent) => {
//         win = remote.getCurrentWindow();
//         offset = [e.clientX, e.clientY];
//         size = win.getSize();
//     };
//
//     element.addEventListener('mousedown', handleMouseDown);
//
//     mouse.on('left-drag', (x: number, y: number) => {
//         if (!offset) {
//             return;
//         }
//
//         const screenScale = remote.screen.getDisplayNearestPoint({ x, y }).scaleFactor;
//         x = Math.round(x / screenScale - offset[0]);
//         y = Math.round(y / screenScale - offset[1]);
//
//         win?.setBounds({
//             width: size?.[0],
//             height: size?.[1],
//             x, y
//         });
//     });
//
//     mouse.on('left-up', function() {
//         offset = undefined;
//         win = undefined;
//         size = undefined;
//     });
//
//     return () => {
//         element.removeEventListener('mousedown', handleMouseDown);
//         mouse.destroy();
//     };
// };
//
// export default drag;