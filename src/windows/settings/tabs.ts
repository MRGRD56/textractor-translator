import tabsCore, {createTab, ProfileTab, ProfileTabs, TabsApi} from '../../utils/tabsCore';
import {NEW_PROFILE_NAME} from './profiles/constants';

/** @deprecated */
export const initTabs = (element: HTMLElement, initialTabs: ProfileTabs): TabsApi => {
    element.classList.add('tabs');

    const tabsApi = tabsCore(initialTabs);

    const renderTab = (tab: ProfileTab, newTabElement: HTMLElement) => {
        const tabElement = document.createElement('div');
        tabElement.classList.add('tab');
        if (tabsApi.isTabActive(tab.id)) {
            tabElement.classList.add('active');
        }
        if (tab.className) {
            tabElement.classList.add(tab.className);
        }
        if (tab.icon) {
            const iconElement = document.createElement('div');
            iconElement.classList.add('tab-icon', tab.icon.className!);
            iconElement.innerHTML = `<span class="material-symbols-rounded">${tab.icon.name}</span>`;
            tabElement.append(iconElement);
        }
        tabElement.append(tab.name);

        if (tab.isPinned) {
            const pinIcon = document.createElement('div');
            pinIcon.classList.add('tab-action', 'tab-pin');
            pinIcon.innerHTML = '<span class="material-symbols-rounded">push_pin</span>';
            tabElement.append(pinIcon);
        } else {
            const closeButton = document.createElement('button');
            closeButton.classList.add('tab-action', 'tab-close');
            closeButton.innerHTML = '<span class="material-symbols-rounded">close</span>';
            closeButton.addEventListener('click', () => {
                tabsApi.closeTab(tab.id);
            });
            tabElement.append(closeButton);
        }

        tabElement.addEventListener('click', () => {
            tabsApi.setActiveTabId(tab.id);
        });

        tabElement.addEventListener('auxclick', event => {
            if (event.button !== 1) {
                return;
            }

            if (!tab.isPinned) {
                tabsApi.closeTab(tab.id);
            }
        });

        element.insertBefore(tabElement, newTabElement);
    };

    tabsApi.onChange((changes) => {
        element.innerHTML = '';

        const newTabElement = document.createElement('div');
        newTabElement.classList.add('tab', 'new-tab');
        newTabElement.innerHTML = '<span class="material-symbols-rounded">add</span>';
        newTabElement.addEventListener('click', () => {
            const newTab = tabsApi.addTab(createTab(NEW_PROFILE_NAME));
            tabsApi.setActiveTabId(newTab.id);
        });
        element.append(newTabElement);

        const tabsList = tabsApi.getTabs();
        tabsList.forEach(tab => {
            renderTab(tab, newTabElement);
        });
    });

    return tabsApi;
};