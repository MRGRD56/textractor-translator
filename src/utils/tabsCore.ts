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
    },
    isActivated?: boolean;
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
    TABS_CHANGED = 'TABS_CHANGED',
    ACTIVE_TAB_CHANGED = 'ACTIVE_TAB_CHANGED',
    TAB_ADDED = 'TAB_ADDED',
    TAB_CLOSED = 'TAB_CLOSED',
    TAB_RENAMED = 'TAB_RENAMED',
    TAB_MOVED = 'TAB_MOVED',
    TAB_CLASSNAME_CHANGED = 'TAB_CLASSNAME_CHANGED',
    TAB_ICON_CHANGED = 'TAB_ICON_CHANGED'
}

// interface TabsChangesByCause {
//     // eslint-disable-next-line @typescript-eslint/ban-types
//     [TabsChangeCause.INIT]: {},
//     [TabsChangeCause.ACTIVE_TAB_CHANGED]: {}
// }

export type TabsChange = {
    cause: TabsChangeCause.INIT | TabsChangeCause.TABS_CHANGED;
} | {
    cause: TabsChangeCause.ACTIVE_TAB_CHANGED;
    activeTabId: string;
} | {
    cause:
        TabsChangeCause.TAB_ADDED |
        TabsChangeCause.TAB_CLOSED |
        TabsChangeCause.TAB_RENAMED |
        TabsChangeCause.TAB_CLASSNAME_CHANGED |
        TabsChangeCause.TAB_ICON_CHANGED |
        TabsChangeCause.TAB_MOVED;
    tab: Tab;
}

export interface TabsApi {
    getTabs(): Tab[];
    getTabsObject(): Tabs;
    setTabsObject(tabs: Tabs): void;
    getTabsMap(): Map<string, Tab>;
    getActiveTab(): Tab | undefined;
    getActiveTabId(): string | undefined;
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

    onChange(callback: (tabsChanges: TabsChange[]) => void): Subscription;
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
    const tabsMapRef = ref<Map<string, Tab>>(indexArrayBy(tabs, 'id'));

    const change$ = new ReplaySubject<TabsChange[]>();

    const api: TabsApi = {
        getTabs(): Tab[] {
            return getMapValues(tabsMapRef.current).sort((a, b) => {
                return a.index - b.index;
            });
        },
        getTabsObject(): Tabs {
            return {
                list: this.getTabs(),
                activeId: this.getActiveTabId()
            };
        },
        setTabsObject(tabs: Tabs): void {
            tabsMapRef.current = indexArrayBy(tabs.list, 'id');
            activeIdRef.current = tabs.activeId;
            change$.next([{cause: TabsChangeCause.TABS_CHANGED}]);
        },
        getTabsMap(): Map<string, Tab> {
            return tabsMapRef.current;
        },
        getActiveTab(): Tab | undefined {
            if (activeIdRef.current) {
                return tabsMapRef.current.get(activeIdRef.current);
            }
        },
        getActiveTabId(): string | undefined {
            return activeIdRef.current;
        },
        setActiveTabId(tabId: string): void {
            activeIdRef.current = tabId;
            change$.next([{cause: TabsChangeCause.ACTIVE_TAB_CHANGED, activeTabId: tabId}]);
        },
        isTabActive(tabId: string): boolean {
            return activeIdRef.current === tabId;
        },
        getTab(tabId: string): Tab {
            return tabsMapRef.current.get(tabId)!;
        },
        addTab(tab: Tab) {
            const newTab = {
                ...tab,
                index: (tab.index == null || tab.index < 0) ? nextIndexRef.current++ : tab.index
            };
            tabsMapRef.current.set(tab.id, newTab);
            change$.next([{cause: TabsChangeCause.TAB_ADDED, tab}]);
            return newTab;
        },
        closeTab(tabId: string): Tab {
            const changes: TabsChange[] = [];

            const tab = tabsMapRef.current.get(tabId)!;
            tabsMapRef.current.delete(tabId);
            if (activeIdRef.current === tab.id) {
                const tabsList = this.getTabs();
                activeIdRef.current = tabsList[tabsList.length - 1]?.id;
                changes.push({cause: TabsChangeCause.ACTIVE_TAB_CHANGED, activeTabId: activeIdRef.current});
            }
            changes.push({cause: TabsChangeCause.TAB_CLOSED, tab});
            change$.next(changes);
            return tab;
        },
        renameTab(tabId: string, newName: string): Tab {
            const tab = tabsMapRef.current.get(tabId)!;
            tab.name = newName;
            change$.next([{cause: TabsChangeCause.TAB_RENAMED, tab}]);
            return tab;
        },
        getTabIndex(tabId: string): number {
            const tab = tabsMapRef.current.get(tabId)!;
            return tab.index;
        },
        setTabIndex(tabId: string, index: number) {
            const tab = tabsMapRef.current.get(tabId)!;
            tab.index = index;
            change$.next([{cause: TabsChangeCause.TAB_MOVED, tab}]);
        },
        setTabClassName(tabId: string, className: string | undefined) {
            const tab = tabsMapRef.current.get(tabId)!;
            tab.className = className;
            change$.next([{cause: TabsChangeCause.TAB_CLASSNAME_CHANGED, tab}]);
        },
        setTabIcon(tabId: string, icon: Tab['icon']) {
            const tab = tabsMapRef.current.get(tabId)!;
            tab.icon = icon;
            change$.next([{cause: TabsChangeCause.TAB_ICON_CHANGED, tab}]);
        },

        onChange(callback) {
            return change$.subscribe(callback);
        }
    };

    change$.next([{cause: TabsChangeCause.INIT}]);

    return api;
};

export default tabsCore;