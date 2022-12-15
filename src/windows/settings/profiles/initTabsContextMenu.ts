import {BrowserWindow, ipcMain, Menu} from 'electron';
import {ProfileTab} from '../../../utils/tabsCore';
import {COMMON_PROFILE_ID} from './constants';

type MenuItem = (Electron.MenuItemConstructorOptions) | (Electron.MenuItem);

const initTabsContextMenu = () => {
    ipcMain.handle('show-profile-tab-context-menu', (event, tab: ProfileTab) => {
        return new Promise((resolve) => {
            const isActiveProfile = tab.isActivated === true;

            const finish = (item?: string) => () => {
                resolve(item);
                // event.sender.send(`profile-tab-context-menu-item-click_${tab.id}`, item);
            };

            const template: Array<MenuItem> = [
                ...(tab.id === COMMON_PROFILE_ID ? [] : [
                    {
                        label: 'Make active',
                        enabled: !isActiveProfile,
                        type: 'checkbox',
                        checked: isActiveProfile,
                        click: isActiveProfile ? undefined : finish('make-active')
                    },
                    {
                        label: 'Rename',
                        click: finish('rename')
                    }
                ] as MenuItem[]),
                {
                    label: 'Close',
                    click: finish('close')
                }
            ];

            const menu = Menu.buildFromTemplate(template);
            menu.popup({
                window: BrowserWindow.fromWebContents(event.sender) ?? undefined,
                callback: finish(undefined)
            })
        });
    });
};

export default initTabsContextMenu;