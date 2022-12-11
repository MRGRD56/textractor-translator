import React, {FC, useCallback, useState} from 'react';
import {Tab, TabsApi} from '../../../../utils/tabsCore';
import classNames from 'classnames';
import type {IpcRenderer} from 'electron';
import AutosizeInput from 'react-input-autosize';
import useCallbackRef from '../../../../hooks/useCallbackRef';

const ipcRenderer: IpcRenderer = (window as any).nodeApi.ipcRenderer;

interface Props {
    tab: Tab;
    active: boolean;
    api: TabsApi;
    onMakeActiveProfile: () => void;
}

const PanelTab: FC<Props> = ({tab, active: isActive, api, onMakeActiveProfile}) => {
    const [isRenaming, setIsRenaming] = useState<boolean>(false);
    const [newProfileName, setNewProfileName] = useState<string>();

    const [tabRenameInputRef, tabRenameInputRefCallback] = useCallbackRef<HTMLInputElement>((tabRenameInput) => {
        tabRenameInput.focus();
    });

    const handleTabClick = () => {
        if (!isActive) {
            api.setActiveTabId(tab.id);
        }
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
                    setNewProfileName(tab.name);
                    setIsRenaming(true);
                    break;
                }
            });
    };

    const confirmProfileRename = useCallback((newName: string, isBlur: boolean) => {
        if (!isRenaming) {
            return;
        }

        if (!newName?.trim()) {
            if (isBlur) {
                setIsRenaming(false);
            }

            return;
        }

        api.renameTab(tab.id, newName.trim());

        setIsRenaming(false);
    }, [api, isRenaming, tab]);

    const handleProfileNameInputBlur = useCallback<React.FocusEventHandler<HTMLInputElement>>((event) => {
        if (!isRenaming) {
            return;
        }

        confirmProfileRename(event.currentTarget.value, true);
    }, [isRenaming, confirmProfileRename]);

    const handleProfileNameInputKeyDown = useCallback<React.KeyboardEventHandler<HTMLInputElement>>((event) => {
        if (!isRenaming) {
            return;
        }

        if (event.key === 'Enter') {
            confirmProfileRename(event.currentTarget.value, false);
        } else if (event.key === 'Escape') {
            setIsRenaming(false);
        }
    }, [isRenaming, confirmProfileRename]);

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
            {isRenaming ? (
                <AutosizeInput
                    inputRef={tabRenameInputRefCallback}
                    className="tab-renaming-name"
                    value={newProfileName}
                    onChange={event => setNewProfileName(event.currentTarget.value)}
                    onBlur={handleProfileNameInputBlur}
                    onKeyDown={handleProfileNameInputKeyDown}
                />
            ) : (
                <div>{tab.name}</div>
            )}
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