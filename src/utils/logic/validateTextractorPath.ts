import {ValidateTextractorPath} from '../../windows/settings/types';
import fs from 'fs';
import path from 'path';
import {TextractorStatus} from '../../windows/settings/tabs/settingsTextractor/types';

const validateTextractorPath: ValidateTextractorPath = (exePath) => {
    if (fs.existsSync(exePath)) {
        if (fs.statSync(exePath).isFile()) {
            if (path.basename(exePath) === 'Textractor.exe') {
                return TextractorStatus.SUCCESS;
            }
        }
    }

    return TextractorStatus.ERROR;
};

export default validateTextractorPath;