import React, {FC, useCallback, useState} from 'react';
import SavedProfile from '../../profiles/SavedProfile';
import {TabsApi} from '../../../../utils/tabsCore';
import classNames from 'classnames';
import {profileToTab} from '../../profiles/profileTabConversions';
import {Popconfirm} from 'antd';

interface Props {
    tabsApi: TabsApi;
    profile: SavedProfile;
    active: boolean;
    open: boolean;
    onDelete: () => void;
    onPopupClose: () => void;
}

const PopupProfile: FC<Props> = ({tabsApi, profile, active: isActive, open: isOpen, onDelete, onPopupClose}) => {
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState<boolean>(false);

    const isActiveTab = tabsApi.isTabActive(profile.id);

    const handleClick = useCallback(() => {
        const tab = tabsApi.getTab(profile.id) ?? tabsApi.addTab(profileToTab(profile, isActive));
        tabsApi.setActiveTabId(tab.id);
        onPopupClose();
    }, [tabsApi, isOpen, isActive, onPopupClose]);

    const handleDeleteClick = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        onDelete();
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
            <div className="profiles-popup-item-controls" onClick={e => e.stopPropagation()}>
                <Popconfirm
                    placement="bottomLeft"
                    title="Are you sure to delete this profile?"
                    onConfirm={handleDeleteClick}
                    onCancel={e => e?.stopPropagation()}
                    open={isDeletePopupOpen}
                    onOpenChange={setIsDeletePopupOpen}
                    overlayClassName="settings-profiles-popup-part"
                >
                    {!profile.isPredefined && (
                        <div className="profiles-popup-item-delete" onClickCapture={e => {
                            e.stopPropagation();
                            setIsDeletePopupOpen(true);
                        }}>
                            <span className="material-symbols-rounded">
                                close
                            </span>
                        </div>
                    )}
                </Popconfirm>
            </div>
        </button>
    );
};

export default PopupProfile;