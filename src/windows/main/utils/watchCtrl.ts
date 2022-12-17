import ref, {Ref} from '../../../utils/ref';

const watchCtrl = (): Ref<boolean> => {
    const body = document.body;

    const isCtrlRef = ref<boolean>(false);

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

    return isCtrlRef;
};

export default watchCtrl;