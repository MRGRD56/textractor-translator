import Store from 'electron-store';
import {StoreKeys} from '../../constants/store-keys';
import {TextractorType} from '../../configuration';
import {TextractorStatus} from '../../windows/settings/tabs/settingsTextractor/types';
import * as child_process from 'child_process';
import validateTextractorPath from './validateTextractorPath';

const autorunTextractor = (store: Store) => {
    try {
        const textractorAutorun = store.get(StoreKeys.TEXTRACTOR_AUTORUN) as TextractorType | null | undefined;
        if (!textractorAutorun) {
            return;
        }

        const textractorPath = (() => {
            if (textractorAutorun === 'x86') {
                return store.get(StoreKeys.TEXTRACTOR_X86_PATH) as string | undefined;
            }

            if (textractorAutorun == 'x64') {
                return store.get(StoreKeys.TEXTRACTOR_X64_PATH) as string | undefined;
            }
        })();

        if (!textractorPath) {
            return;
        }

        const textractorStatus = validateTextractorPath(textractorPath);
        if (textractorStatus !== TextractorStatus.SUCCESS) {
            return;
        }

        child_process.execFile(textractorPath);
    } catch (e) {
        console.error('Unable to autorun Textractor', e);
    }
};

export default autorunTextractor;