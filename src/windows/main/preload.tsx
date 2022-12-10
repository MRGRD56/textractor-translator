import workTextractorServer from './logic/workTextractorServer';
import {ipcRenderer} from 'electron';

const isHistoryShownRef = {current: false};

const initToolbar = () => {
    const textContainerWrapper = document.getElementById('text-wrapper');
    const textContainer = document.querySelector('.text-container');

    const mainToolbar = document.querySelector('.main-toolbar');
    const closeAppButton = document.getElementById('close-app-button');
    const minimizeAppButton = document.getElementById('minimize-window-button');
    const settingsButton = document.getElementById('settings-button');
    const historyButton = document.getElementById('history-button');

    closeAppButton.addEventListener('click', () => ipcRenderer.invoke('main-window.close'));

    minimizeAppButton.addEventListener('click', () => ipcRenderer.invoke('main-window.minimize'));

    settingsButton.addEventListener('click', () => ipcRenderer.invoke('open-settings-window'));

    historyButton.addEventListener('click', () => {
        isHistoryShownRef.current = !isHistoryShownRef.current;
        if (isHistoryShownRef.current) {
            historyButton.classList.add('active');
            textContainer.classList.add('history-visible');
            textContainerWrapper.scrollTo(0, textContainerWrapper.scrollHeight);
        } else {
            historyButton.classList.remove('active');
            textContainer.classList.remove('history-visible');
        }
    });

    mainToolbar.classList.add('force-visible');
    setTimeout(() => {
        mainToolbar.classList.remove('force-visible');
    }, 2000);
};

window.addEventListener('DOMContentLoaded', () => {
    initToolbar();
    workTextractorServer();
});
