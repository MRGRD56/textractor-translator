import React, {FC, useCallback, useState} from 'react';
import {createTab, ProfileTab, ProfileTabs, TabsApi, TabsChange} from '../../../../utils/tabsCore';
import {useDidMount} from 'rooks';
import PanelTab from './PanelTab';
import useAutoRef from '../../../../utils/useAutoRef';
import {NEW_PROFILE_NAME} from '../../profiles/constants';
import AllProfilesPopup from '../profiles/AllProfilesPopup';
import SavedProfiles from '../../profiles/SavedProfiles';

interface Props {
    profiles: SavedProfiles;
    api: TabsApi;
    onChange?: (tabs: ProfileTabs, changes: TabsChange[]) => void;
    onProfileActivate?: (profileId: string) => void;
    onProfilesChange: (profiles: SavedProfiles) => void;
}

const TabsPanel: FC<Props> = ({profiles, api, onChange, onProfileActivate, onProfilesChange}) => {
    const [tabs, setTabs] = useState<ProfileTabs>(api.getTabsObject());
    const onChangeRef = useAutoRef(onChange);

    useDidMount(() => {
        api.onChange(changes => {
            const newTabs = api.getTabsObject();
            setTabs(newTabs);
            onChangeRef.current?.(newTabs, changes);
        });
    });

    const handleNewTabClick = () => {
        const newTab = api.addTab(createTab(NEW_PROFILE_NAME));
        api.setActiveTabId(newTab.id);
    };

    const handleMakeActiveProfile = useCallback((profileId: string) => () => {
        onProfileActivate?.(profileId);
    }, [onProfileActivate]);

    return (
        <div className="tabs">
            <div className="tabs-panel">
                {tabs.list.map(tab => (
                    <PanelTab
                        key={tab.id}
                        tab={tab}
                        active={tab.id === tabs.activeId}
                        api={api}
                        onMakeActiveProfile={handleMakeActiveProfile(tab.id)}
                    />
                ))}
                <div className="tab new-tab" onClick={handleNewTabClick}>
                    <span className="material-symbols-rounded">add</span>
                </div>
            </div>
            <div className="tabs-profiles">
                <AllProfilesPopup profiles={profiles} onProfilesChange={onProfilesChange} tabsApi={api}/>
            </div>
        </div>
    );
};

export default TabsPanel;