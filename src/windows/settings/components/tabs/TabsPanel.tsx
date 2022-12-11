import React, {FC, useCallback, useState} from 'react';
import {createTab, Tab, Tabs, TabsApi, TabsChange} from '../../../../utils/tabsCore';
import {useDidMount} from 'rooks';
import PanelTab from './PanelTab';
import useAutoRef from '../../../../utils/useAutoRef';
import {NEW_PROFILE_NAME} from '../../profiles/constants';

interface Props {
    api: TabsApi;
    onChange?: (tabs: Tabs, changes: TabsChange[]) => void;
    onProfileActivate?: (profileId: string) => void;
}

const TabsPanel: FC<Props> = ({api, onChange, onProfileActivate}) => {
    const [tabs, setTabs] = useState<Tabs>(api.getTabsObject());
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
    );
};

export default TabsPanel;