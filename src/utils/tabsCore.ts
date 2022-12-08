import { v4 } from "uuid";
import indexArrayBy from './indexArrayBy';
import getMapValues from './getMapValues';
import ref from './ref';
import {ReplaySubject, Subject, Subscription} from 'rxjs';

export interface Tab {
    id: string;
    name: string;
    index: number;
    isRenameable?: boolean;
    isPinned?: boolean;
    className?: string;
    icon?: {
        name: string;
        className?: string;
    }
}

export interface Tabs {
    activeId?: string;
    list: Tab[];
}

export const createTab = (name: string, options: Omit<Tab, 'id' | 'name' | 'index'> = {}): Tab => {
    return {
        id: v4(),
        name,
        index: -1,
        ...options
    };
};

export enum TabsChangeCause {
    INIT = 'INIT',
    ACTIVE_TAB_CHANGED = 'ACTIVE_TAB_CHANGED',
    TAB_ADDED = 'TAB_ADDED',
    TAB_CLOSED = 'TAB_CLOSED',
    TAB_RENAMED = 'TAB_RENAMED',
    TAB_MOVED = 'TAB_MOVED',
    TAB_CLASSNAME_CHANGED = 'TAB_CLASSNAME_CHANGED',
    TAB_ICON_CHANGED = 'TAB_ICON_CHANGED'
}

export interface TabsChange {
    cause: TabsChangeCause;
}

export interface TabsApi {
    getTabs(): Tab[];
    getTabsMap(): Map<string, Tab>;
    getActiveTab(): Tab;
    getActiveTabId(): string;
    setActiveTabId(tabId: string): void;
    isTabActive(tabId: string): boolean;
    getTab(tabId: string): Tab;
    addTab(tab: Tab): Tab;
    closeTab(tabId: string): Tab;
    renameTab(tabId: string, newName: string): Tab;
    getTabIndex(tabId: string): number;
    setTabIndex(tabId: string, index: number): void;
    setTabClassName(tabId: string, className: string | undefined): void;
    setTabIcon(tabId: string, icon: Tab['icon']): void;

    onChange?(callback: (tabsChange: TabsChange) => void): Subscription;
}

const tabsCore = (initialTabs: Tabs): TabsApi => {
    const {
        list: tabs
    } = initialTabs;

    let i = 0
    for (; i < tabs.length; i++) {
        tabs[i].index = i;
    }

    const nextIndexRef = ref(i + 1);

    const activeIdRef = ref<string | undefined>(initialTabs.activeId || tabs[0]?.id);
    const tabsMap = indexArrayBy(tabs, 'id');

    const change$ = new ReplaySubject<TabsChange>();

    const api: TabsApi = {
        getTabs(): Tab[] {
            return getMapValues(tabsMap).sort((a, b) => {
                return a.index - b.index;
            });
        },
        getTabsMap(): Map<string, Tab> {
            return tabsMap;
        },
        getActiveTab(): Tab {
            return tabsMap.get(activeIdRef.current);
        },
        getActiveTabId(): string {
            return activeIdRef.current;
        },
        setActiveTabId(tabId: string): void {
            activeIdRef.current = tabId;
            change$.next({cause: TabsChangeCause.ACTIVE_TAB_CHANGED});
        },
        isTabActive(tabId: string): boolean {
            return activeIdRef.current === tabId;
        },
        getTab(tabId: string): Tab {
            return tabsMap.get(tabId);
        },
        addTab(tab: Tab) {
            const newTab = {
                ...tab,
                index: (tab.index == null || tab.index < 0) ? nextIndexRef.current++ : tab.index
            };
            tabsMap.set(tab.id, newTab);
            change$.next({cause: TabsChangeCause.TAB_ADDED});
            return newTab;
        },
        closeTab(tabId: string): Tab {
            const tab = tabsMap.get(tabId);
            tabsMap.delete(tabId);
            if (activeIdRef.current === tab.id) {
                const tabsList = this.getTabs();
                activeIdRef.current = tabsList[tabsList.length - 1]?.id;
            }
            change$.next({cause: TabsChangeCause.TAB_CLOSED});
            return tab;
        },
        renameTab(tabId: string, newName: string): Tab {
            const tab = tabsMap.get(tabId);
            tab.name = newName;
            change$.next({cause: TabsChangeCause.TAB_RENAMED});
            return tab;
        },
        getTabIndex(tabId: string): number {
            const tab = tabsMap.get(tabId);
            return tab.index;
        },
        setTabIndex(tabId: string, index: number) {
            const tab = tabsMap.get(tabId);
            tab.index = index;
            change$.next({cause: TabsChangeCause.TAB_MOVED});
        },
        setTabClassName(tabId: string, className: string | undefined) {
            const tab = tabsMap.get(tabId);
            tab.className = className;
            change$.next({cause: TabsChangeCause.TAB_CLASSNAME_CHANGED});
        },
        setTabIcon(tabId: string, icon: Tab['icon']) {
            const tab = tabsMap.get(tabId);
            tab.icon = icon;
            change$.next({cause: TabsChangeCause.TAB_ICON_CHANGED});
        },

        onChange(callback) {
            return change$.subscribe(callback);
        }
    };

    change$.next({cause: TabsChangeCause.INIT});

    return api;
};

export default tabsCore;