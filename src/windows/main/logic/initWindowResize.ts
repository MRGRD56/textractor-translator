// import type Interact from 'interactjs';
// import interact from 'interactjs';
// import {ipcRenderer} from 'electron';

// const initWindowResize = () => {
    // interact('#main-window-resize-frame')
    //     .resizable({
    //         edges: {top: true, right: true, bottom: true, left: true},
    //         listeners: {
    //             move(event: Interact.ResizeEvent) {
    //                 console.log('resizing mw', event);
    //                 ipcRenderer.invoke('main-window.resize', event.deltaRect as Interact.FullRect);
    //             }
    //         },
    //         margin: 10,
    //         ignoreFrom: '.main-toolbar-item',
    //         modifiers: [
    //             interact.modifiers.snap({
    //                 targets: [
    //                     interact.snappers.grid({
    //                         x: 1, y: 1
    //                     })
    //                 ],
    //                 range: Infinity,
    //                 relativePoints: [
    //                     {x: 0, y: 0}
    //                 ]
    //             })
    //         ]
    //     });
// };
//
// export default initWindowResize;