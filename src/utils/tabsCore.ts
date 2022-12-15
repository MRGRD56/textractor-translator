import {v4} from 'uuid';
import indexArrayBy from './indexArrayBy';
import getMapValues from './getMapValues';
import ref from './ref';
import {ReplaySubject, Subscription} from 'rxjs';

export interface ProfileTab {
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

export interface ProfileTabs {
    activeId?: string;
    list: ProfileTab[];
}

export const createTab = (name: string, options: Omit<ProfileTab, 'id' | 'name' | 'index'> = {}): ProfileTab => {
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
    tab: ProfileTab;
}

export interface TabsApi {
    getTabs(): ProfileTab[];

    getTabsObject(): ProfileTabs;

    setTabsObject(tabs: ProfileTabs): void;

    getTabsMap(): Map<string, ProfileTab>;

    getActiveTab(): ProfileTab | undefined;

    getActiveTabId(): string | undefined;

    setActiveTabId(tabId: string): void;

    isTabActive(tabId: string): boolean;

    getTab(tabId: string): ProfileTab;

    addTab(tab: ProfileTab): ProfileTab;

    closeTab(tabId: string): ProfileTab;

    renameTab(tabId: string, newName: string): ProfileTab;

    getTabIndex(tabId: string): number;

    setTabIndex(tabId: string, index: number): void;

    setTabClassName(tabId: string, className: string | undefined): void;

    setTabIcon(tabId: string, icon: ProfileTab['icon']): void;

    onChange(callback: (tabsChanges: TabsChange[]) => void): Subscription;
}

const tabsCore = (initialTabs: ProfileTabs): TabsApi => {
    const {
        list: tabs
    } = initialTabs;

    let i = 0
    for (; i < tabs.length; i++) {
        tabs[i].index = i;
    }

    const nextIndexRef = ref(i + 1);

    const activeIdRef = ref<string | undefined>(initialTabs.activeId || tabs[0]?.id);
    const tabsMapRef = ref<Map<string, ProfileTab>>(indexArrayBy(tabs, 'id'));

    const change$ = new ReplaySubject<TabsChange[]>();

    const api: TabsApi = {
        getTabs(): ProfileTab[] {
            return getMapValues(tabsMapRef.current).sort((a, b) => {
                return a.index - b.index;
            });
        },
        getTabsObject(): ProfileTabs {
            return {
                list: this.getTabs(),
                activeId: this.getActiveTabId()
            };
        },
        setTabsObject(tabs: ProfileTabs): void {
            tabsMapRef.current = indexArrayBy(tabs.list, 'id');
            activeIdRef.current = tabs.activeId;
            change$.next([{cause: TabsChangeCause.TABS_CHANGED}]);
        },
        getTabsMap(): Map<string, ProfileTab> {
            return tabsMapRef.current;
        },
        getActiveTab(): ProfileTab | undefined {
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
        getTab(tabId: string): ProfileTab {
            return tabsMapRef.current.get(tabId)!;
        },
        addTab(tab: ProfileTab) {
            const newTab = {
                ...tab,
                index: (tab.index == null || tab.index < 0) ? nextIndexRef.current++ : tab.index
            };
            tabsMapRef.current.set(tab.id, newTab);
            change$.next([{cause: TabsChangeCause.TAB_ADDED, tab}]);
            return newTab;
        },
        closeTab(tabId: string): ProfileTab {
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
        renameTab(tabId: string, newName: string): ProfileTab {
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
        setTabIcon(tabId: string, icon: ProfileTab['icon']) {
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