// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import '../../../node_modules/material-symbols/index.css';
import '../../style/basic.css';
import './styles/main.css';

const initializeScaling = () => {
    const body = document.body;
    const textContainer: HTMLElement = document.querySelector('.text-container')!;

    const isCtrlRef = {current: false};

    body.addEventListener('keydown', event => {
        if (event.key === 'Control') {
            isCtrlRef.current = true;
        }
    });

    body.addEventListener('keyup', event => {
        if (event.key === 'Control') {
            isCtrlRef.current = false;
        }
    });

    body.addEventListener('wheel', event => {
        if (!isCtrlRef.current) {
            return;
        }

        const fontSize = Number.parseInt(textContainer.style.fontSize || window.getComputedStyle(textContainer).fontSize);
        textContainer.style.fontSize = Math.max(8, Math.min(72, fontSize - Math.sign(event.deltaY))) + 'px';
    });
};

window.addEventListener('DOMContentLoaded', () => {
    initializeScaling();
});