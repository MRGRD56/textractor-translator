import React, {FC, MouseEventHandler} from 'react';
import {Tab, TabsApi} from '../../../../utils/tabsCore';
import classNames from 'classnames';
import type {IpcRenderer} from 'electron';

const ipcRenderer: IpcRenderer = (window as any).nodeApi.ipcRenderer;

interface Props {
    tab: Tab;
    active: boolean;
    api: TabsApi;
    onMakeActiveProfile: () => void;
}

const PanelTab: FC<Props> = ({tab, active: isActive, api, onMakeActiveProfile}) => {
    const handleTabClick = () => {
        api.setActiveTabId(tab.id);
    };

    const handleTabAuxClick: React.MouseEventHandler<HTMLElement> = (event) => {
        if (event.button !== 1) {
            return;
        }

        if (!tab.isPinned) {
            api.closeTab(tab.id);
        }
    };

    const handleCloseClick: React.MouseEventHandler<HTMLElement> = (event) => {
        event.stopPropagation();
        api.closeTab(tab.id);
    };

    const handleContextMenu: React.MouseEventHandler<HTMLElement> = (event) => {
        event.preventDefault();
        ipcRenderer.invoke('show-profile-tab-context-menu', tab)
            .then((value: 'close' | 'make-active' | 'rename') => {
                switch (value) {
                case 'close':
                    api.closeTab(tab.id);
                    break;
                case 'make-active':
                    onMakeActiveProfile()
                    break;
                case 'rename':
                    // TODO
                    break;
                }
            });
    };

    return (
        <div
            className={classNames('tab', isActive && 'active', tab.isPinned && 'pinned', tab.className)}
            onClickCapture={handleTabClick}
            onAuxClick={handleTabAuxClick}
            onContextMenu={handleContextMenu}
        >
            {tab.icon && (
                <div className={classNames('tab-icon', tab.icon.className)}>
                    <span className="material-symbols-rounded">{tab.icon.name}</span>
                </div>
            )}
            {tab.name}
            {tab.isPinned ? (
                <div className="tab-action tab-pin">
                    <span className="material-symbols-rounded">push_pin</span>
                </div>
            ) : (
                <button className="tab-action tab-close" onClick={handleCloseClick}>
                    <span className="material-symbols-rounded">close</span>
                </button>
            )}
        </div>
    );
};

export default PanelTab;