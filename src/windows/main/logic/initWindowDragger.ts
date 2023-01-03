import {ipcRenderer} from 'electron';
import ref, {NullableRef} from '../../../utils/ref';

const LEFT_MOUSE_BUTTON_CODE = 1;

const STRING_TO_BOOLEAN_MAP = {
    true: true,
    false: false
} as Record<string, boolean>;

const setMainWindowDraggableBackground = (isDraggable: boolean) => {
    ipcRenderer.invoke('set-main-window-draggable', isDraggable);
};

const setMainWindowDraggableTopPanelOnly = (isDraggable: boolean) => {
    ipcRenderer.invoke('set-main-window-draggable-top-panel-only', isDraggable);
};

const isDraggableElement = (element: HTMLElement | null): boolean | undefined => {
    if (!element) {
        return;
    }

    const draggableAttribute = element.getAttribute('data-mw-drag');
    if (!draggableAttribute) {
        return;
    }

    return STRING_TO_BOOLEAN_MAP[draggableAttribute];
};

const handleDragElementChange = (event: MouseEvent, element: HTMLElement, lmbUpListenerRef: NullableRef<(event: MouseEvent) => void>, setIsDraggable: (isDraggable: boolean) => void) => {
    const isDraggable = isDraggableElement((element as HTMLElement)?.closest('[data-mw-drag]')) ?? false;

    const isLeftButtonPressed = Boolean(event.buttons & LEFT_MOUSE_BUTTON_CODE);

    if (isDraggable && isLeftButtonPressed) {
        if (!lmbUpListenerRef.current) {
            lmbUpListenerRef.current = (event) => {
                // if left mouse button is still pressed
                if (event.buttons & LEFT_MOUSE_BUTTON_CODE) {
                    return;
                }

                const isDraggable = isDraggableElement((event.target as HTMLElement)?.closest('[data-mw-drag]')) ?? false;

                setIsDraggable(isDraggable);

                if (lmbUpListenerRef.current) {
                    window.removeEventListener('mouseup', lmbUpListenerRef.current);
                    lmbUpListenerRef.current = undefined;
                }
            };

            window.addEventListener('mouseup', lmbUpListenerRef.current);
        }

        return;
    }

    setIsDraggable(isDraggable);
};

const handleDragElementEvents = (dragElement: HTMLElement, setIsDraggable: (isDraggable: boolean) => void) => {
    const lmbUpListenerRef = ref<((event: MouseEvent) => void)>();

    dragElement.addEventListener('mouseenter', (event) => {
        handleDragElementChange(event, event.target as HTMLElement, lmbUpListenerRef, setIsDraggable);
    });
    dragElement.addEventListener('mouseleave', (event) => {
        handleDragElementChange(event, event.relatedTarget as HTMLElement, lmbUpListenerRef, setIsDraggable);
    });
};

const initWindowDragger = () => {
    handleDragElementEvents(document.getElementById('move-mw-button')!, setMainWindowDraggableTopPanelOnly);

    const dragElements: NodeListOf<HTMLElement> = document.querySelectorAll('[data-mw-drag=true], [data-mw-drag=false]');
    dragElements.forEach(dragElement => handleDragElementEvents(dragElement, setMainWindowDraggableBackground));
};

export default initWindowDragger;