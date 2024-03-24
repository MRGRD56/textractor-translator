import SavedProfiles from '../windows/settings/profiles/SavedProfiles';
import {v4} from 'uuid';
import {COMMON_PROFILE_ID} from '../windows/settings/profiles/constants';

const initialSavedProfiles = ((): SavedProfiles => {
    const firstProfileId = v4();

    return {
        profiles: [
            {
                id: COMMON_PROFILE_ID,
                name: 'Common',
                isPredefined: true,
                configSource: `
config.languages = {
    source: 'auto',
    target: 'en'
};

config.translator = DefinedTranslators.GOOGLE_TRANSLATE;
`.trim()
            },
            {
                id: firstProfileId,
                name: 'New profile',
                configSource: `
config.transformOriginal = ({text, meta}) => {
    return text;
};`.trim(),
            }
        ],
        activeProfileId: firstProfileId,
        tabs: {
            tabIds: [COMMON_PROFILE_ID, firstProfileId],
            activeId: firstProfileId
        }
    };
})();

export default initialSavedProfiles;