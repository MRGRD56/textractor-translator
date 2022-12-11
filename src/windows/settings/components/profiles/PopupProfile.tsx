import React, {FC, useCallback} from 'react';
import SavedProfile from '../../profiles/SavedProfile';
import {TabsApi} from '../../../../utils/tabsCore';
import classNames from 'classnames';
import {profileToTab} from '../../profiles/profileTabConversions';

interface Props {
    tabsApi: TabsApi;
    profile: SavedProfile;
    active: boolean;
    open: boolean;
    onDelete: () => void;
    onPopupClose: () => void;
}

const PopupProfile: FC<Props> = ({tabsApi, profile, active: isActive, open: isOpen, onDelete, onPopupClose}) => {
    const isActiveTab = tabsApi.isTabActive(profile.id);

    const handleClick = useCallback(() => {
        const tab = tabsApi.getTab(profile.id) ?? tabsApi.addTab(profileToTab(profile, isActive));
        tabsApi.setActiveTabId(tab.id);
        onPopupClose();
    }, [tabsApi, isOpen, isActive, onPopupClose]);

    const handleDeleteClick = () => {
        onDelete();
        onPopupClose();
    };

    return (
        <button
            className={classNames(
                'profiles-popup-item',
                isActiveTab && 'profiles-popup-item-selected',
                isOpen && 'profiles-popup-item-open'
            )}
            onClick={handleClick}
        >
            <div className="profiles-popup-item-main">
                <div className="profiles-popup-item-main-icon-wrapper">
                    {profile.isPredefined ? (
                        <div className="profiles-popup-item-main-icon tab-icon-yellow">
                            <span className="material-symbols-rounded">
                                star
                            </span>
                        </div>
                    ) : isActive ? (
                        <div className="profiles-popup-item-main-icon tab-icon-blue">
                            <span className="material-symbols-rounded">
                                check
                            </span>
                        </div>
                    ) : null}
                </div>
                <div className="profiles-popup-item-main-name">
                    {profile.name}
                </div>
            </div>
            <div className="profiles-popup-item-controls">
                <div className="profiles-popup-item-delete" onClickCapture={handleDeleteClick}>
                    <span className="material-symbols-rounded">
                        close
                    </span>
                </div>
            </div>
        </button>
    );
};

export default PopupProfile;