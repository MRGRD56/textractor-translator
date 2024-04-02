import * as electron from 'electron';
import {BrowserWindow, Point, Rectangle} from 'electron';
import ref from './ref';

const isWithin = (point: Point, rectangle: Rectangle): boolean => {
    return (point.x >= rectangle.x)
        && (point.x <= rectangle.x + rectangle.width)
        && (point.y >= rectangle.y)
        && (point.y <= rectangle.y + rectangle.height);
};

const trackWindowHover = (browserWindow: BrowserWindow, onChange: (isHover: boolean) => void): void => {
    const boundsRef = ref<Rectangle>(browserWindow.getBounds());
    const isHoverRef = ref(isWithin(electron.screen.getCursorScreenPoint(), boundsRef.current));
    const isMinimizedRef = ref(browserWindow.isMinimized());

    const isRepositioningRef = ref<boolean>(false);
    const repositioningTimeoutRef = ref<ReturnType<typeof setTimeout>>();

    const onRepositioning = () => {
        boundsRef.current = browserWindow.getBounds();

        isRepositioningRef.current = true;

        const repositioningTimeout = repositioningTimeoutRef.current;
        if (repositioningTimeout !== undefined) {
            clearTimeout(repositioningTimeout);
        }
        repositioningTimeoutRef.current = setTimeout(() => {
            isRepositioningRef.current = false;
            repositioningTimeoutRef.current = undefined;
        }, 150);
    };

    browserWindow.on('minimize', () => {
        isMinimizedRef.current = true;
    });

    browserWindow.on('restore', () => {
        isMinimizedRef.current = false;
    });

    browserWindow.on('move', () => {
        onRepositioning();
    });

    browserWindow.on('resize', () => {
        onRepositioning();
    });

    setInterval(() => {
        let isHover: boolean;

        if (isMinimizedRef.current) {
            isHover = false;
        } else if (isRepositioningRef.current) {
            isHover = true;
        } else {
            const cursorPosition = electron.screen.getCursorScreenPoint();
            const windowBounds = boundsRef.current;

            isHover = isWithin(cursorPosition, windowBounds);
        }

        if (isHoverRef.current !== isHover) {
            isHoverRef.current = isHover;
            onChange(isHover);
        }
    }, 100);

    onChange(isHoverRef.current);
};

export default trackWindowHover;