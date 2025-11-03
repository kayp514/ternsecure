"use client";

import { type FC, Fragment, type ReactNode, useMemo, useState, useRef, type ComponentProps } from "react";
import { usePathname } from "next/navigation";
import type * as PageTree from "fumadocs-core/page-tree";
import { cn } from "@/lib/utils";
import {
  SidebarFolder,
  SidebarFolderContent,
  SidebarFolderLink,
  SidebarFolderTrigger,
  SidebarItem,
  SidebarSeparator,
} from "./sidebar";
import Link from "fumadocs-core/link";

import { ChevronRight } from "lucide-react";
import { useSidebar } from "fumadocs-ui/contexts/sidebar";
import { ScrollArea, ScrollViewport } from "@/components/ui/scroll-area";
import { Presence } from "@radix-ui/react-presence";

// SDK/Framework Tab Configuration
export interface SidebarTab {
  title: string;
  description?: string;
  url: string;
  icon?: React.ReactNode;
  sdk: string;
}

// Navigation Item (can contain nested items)
export interface NavigationItem {
  title: string;
  url?: string;
  icon?: React.ReactNode;
  items?: NavigationItem[];
  sdk?: string[];
  collapsible?: boolean;
}

// Main Navigation Structure
export interface SidebarNavigation {
  title: string;
  url?: string;
  icon?: React.ReactNode;
  items: NavigationItem[];
  collapsible?: boolean;
}

interface CustomSidebarComponents {
  Item: FC<{ item: PageTree.Item }>;
  Folder: FC<{
    item: PageTree.Folder;
    level: number;
    children: ReactNode;
    collapsible?: boolean;
  }>;
  Separator: FC<{ item: PageTree.Separator }>;
}

// TernSidebarContent now accepts children like fumadocs SidebarContent
export function TernSidebarContent(props: ComponentProps<"aside">) {
  const { collapsed } = useSidebar();
  const [hover, setHover] = useState(false);
  const timerRef = useRef(0);
  const closeTimeRef = useRef(0);

  return (
    <aside
      id="nd-sidebar"
      {...props}
      data-collapsed={collapsed}
      className={cn(
        "fixed left-0 rtl:left-auto rtl:right-(--removed-body-scroll-bar-size,0) flex flex-col items-end top-(--fd-sidebar-top) bottom-(--fd-sidebar-margin) z-20 bg-fd-card text-sm border-e transition-[top,opacity,translate,width] duration-200 max-md:hidden *:w-(--fd-sidebar-width)",
        collapsed && [
          "rounded-xl border translate-x-(--fd-sidebar-offset) rtl:-translate-x-(--fd-sidebar-offset)",
          hover ? "z-50 shadow-lg" : "opacity-0",
        ],
        props.className
      )}
      style={
        {
          ...props.style,
          "--fd-sidebar-offset": hover
            ? "calc(var(--spacing) * 2)"
            : "calc(16px - 100%)",
          "--fd-sidebar-margin": collapsed ? "0.5rem" : "0px",
          "--fd-sidebar-top": `calc(var(--fd-banner-height) + var(--fd-nav-height) + var(--fd-sidebar-margin))`,
          width: collapsed
            ? "var(--fd-sidebar-width)"
            : "calc(var(--spacing) + var(--fd-sidebar-width) + var(--fd-layout-offset))",
        } as object
      }
      onPointerEnter={(e) => {
        if (
          !collapsed ||
          e.pointerType === "touch" ||
          closeTimeRef.current > Date.now()
        )
          return;
        window.clearTimeout(timerRef.current);
        setHover(true);
      }}
      onPointerLeave={(e) => {
        if (!collapsed || e.pointerType === "touch") return;
        window.clearTimeout(timerRef.current);

        timerRef.current = window.setTimeout(
          () => {
            setHover(false);
            closeTimeRef.current = Date.now() + 150;
          },
          Math.min(e.clientX, document.body.clientWidth - e.clientX) > 100
            ? 0
            : 500
        );
      }}
    >
      {props.children}
    </aside>
  );
}

export function TernSidebarHeader(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-col gap-3 p-4 pb-2", props.className)}
    >
      {props.children}
    </div>
  );
}

export function TernSidebarFooter(props: ComponentProps<"div">) {
  return (
    <div
      {...props}
      className={cn("flex flex-col border-t p-4 pt-2", props.className)}
    >
      {props.children}
    </div>
  );
}

export function TernSidebarContentMobile({
  className,
  children,
  ...props
}: ComponentProps<"aside">) {
  const { open, setOpen } = useSidebar();
  const state = open ? "open" : "closed";

  return (
    <>
      <Presence present={open}>
        <div
          data-state={state}
          className="fixed z-40 inset-0 backdrop-blur-xs data-[state=open]:animate-fd-fade-in data-[state=closed]:animate-fd-fade-out"
          onClick={() => setOpen(false)}
        />
      </Presence>
      <Presence present={open}>
        {({ present }) => (
          <aside
            id="nd-sidebar-mobile"
            {...props}
            data-state={state}
            className={cn(
              "fixed text-[15px] flex flex-col shadow-lg border-s end-0 inset-y-0 w-[85%] max-w-[380px] z-40 bg-fd-background data-[state=open]:animate-fd-sidebar-in data-[state=closed]:animate-fd-sidebar-out",
              !present && "invisible",
              className
            )}
          >
            {children}
          </aside>
        )}
      </Presence>
    </>
  );
}

export function TernSidebarSeparator(props: ComponentProps<'p'>) {
  return (
    <p
      {...props}
      className={cn(
        'inline-flex items-center gap-2 mb-1.5 px-2 ps-(--sidebar-item-offset) empty:mb-0 [&_svg]:size-4 [&_svg]:shrink-0',
        props.className,
      )}
    >
      {props.children}
    </p>
  );
}

export const TernSidebarMobile = TernSidebarContentMobile;



/**
 * Converts navigation items structure to fumadocs PageTree format
 */
export function convertNavigationToPageTree(
  navItems: NavigationItem[],
  selectedSdk: string
): PageTree.Node[] {
  const resolveUrl = (url: string): string => {
    return url.replace(/\$\{sdk\}/g, selectedSdk);
  };

  const processItem = (item: NavigationItem): PageTree.Node[] => {
    // Check if item should be shown for this SDK
    if (item.sdk && !item.sdk.includes(selectedSdk)) {
      return [];
    }

    const resolvedUrl = item.url ? resolveUrl(item.url) : "#";

    // If item has children
    if (item.items && item.items.length > 0) {
      // Process children recursively
      const processedChildren = item.items
        .flatMap(processItem);

      // If collapsible is true, return as folder
      if (item.collapsible === true) {
        return [{
          type: "folder",
          name: item.title,
          icon: item.icon,
          index: undefined,
          children: processedChildren,
          defaultOpen: false,
          $collapsible: true,
        } as PageTree.Folder & { $collapsible: boolean }];
      }

      // Default: render all as links (no folder)
      // Return parent as link
      const parentItem: PageTree.Item = {
        type: "page",
        name: item.title,
        url: resolvedUrl,
        icon: item.icon,
        external: false,
      };
      
      // Return both parent and children as separate items (flatten)
      return [parentItem, ...processedChildren];
    }

    // Return as simple Item (no children)
    return [{
      type: "page",
      name: item.title,
      url: resolvedUrl,
      icon: item.icon,
      external: false,
    } as PageTree.Item];
  };

  return navItems.flatMap(processItem);
}

/**
 * Custom PageTree renderer with navigation structure
 */
export function TernSidebarPageTree({
  tabs,
  navigation,
  components,
}: {
  tabs: SidebarTab[];
  navigation: SidebarNavigation[];
  components?: Partial<CustomSidebarComponents>;
}) {
  const pathname = usePathname();
  const [activeNavIndex, setActiveNavIndex] = useState<number | null>(null);

  // Determine selected SDK from pathname
  const selectedTab = useMemo(() => {
    return (
      tabs.find(
        (tab) => pathname === tab.url || pathname.startsWith(`${tab.url}/`)
      ) || tabs[0]
    );
  }, [tabs, pathname]);

  // Find which navigation contains the current path (for highlighting)
  const currentNavIndex = useMemo(() => {
    const sdk = selectedTab?.sdk || tabs[0]?.sdk || "";
    const resolveUrl = (url: string) => url.replace(/\$\{sdk\}/g, sdk);
    
    return navigation.findIndex((nav) => {
      // Check if the navigation's own URL matches
      if (nav.url) {
        const resolved = resolveUrl(nav.url);
        if (pathname === resolved || pathname.startsWith(`${resolved}/`)) {
          return true;
        }
      }
      
      // Check if any item in the navigation matches
      return nav.items.some((item) => {
        if (item.url) {
          const resolved = resolveUrl(item.url);
          if (pathname === resolved || pathname.startsWith(`${resolved}/`)) {
            return true;
          }
        }
        if (item.items) {
          return item.items.some((subItem) => {
            if (subItem.url) {
              const resolved = resolveUrl(subItem.url);
              return pathname === resolved || pathname.startsWith(`${resolved}/`);
            }
            return false;
          });
        }
        return false;
      });
    });
  }, [navigation, pathname, selectedTab, tabs]);

  // Get the active navigation's items - use clicked index or current path index
  const displayNavIndex = activeNavIndex !== null ? activeNavIndex : currentNavIndex;

  const pageTree = useMemo(() => {
    const sdk = selectedTab?.sdk || tabs[0]?.sdk || "";
    const navIndex = displayNavIndex !== -1 ? displayNavIndex : 0;
    const activeNav = navigation[navIndex];
    
    if (!activeNav) return [];
    return convertNavigationToPageTree(activeNav.items, sdk);
  }, [displayNavIndex, navigation, selectedTab, tabs]);

  const sdk = selectedTab?.sdk || tabs[0]?.sdk || "";

  // Check if current navigation is collapsible
  const isActiveNavCollapsible = displayNavIndex !== -1 && navigation[displayNavIndex]?.collapsible === true;

  // Render navigation items content
  const navigationItemsContent = useMemo(() => {
    if (isActiveNavCollapsible) return null;
    
    const { Separator, Item, Folder } = components ?? {};

    function renderSidebarList(
      items: PageTree.Node[],
      level: number
    ): ReactNode[] {
      return items.map((item, i) => {
        if (item.type === "separator") {
          if (Separator) return <Separator key={i} item={item} />;
          return (
            <SidebarSeparator key={i} className={cn(i !== 0 && "mt-6")}>
              {item.icon}
              {item.name}
            </SidebarSeparator>
          );
        }

        if (item.type === "folder") {
          const folderItem = item as PageTree.Folder & {
            $collapsible?: boolean;
          };
          const children = renderSidebarList(folderItem.children, level + 1);

          if (Folder)
            return (
              <Folder
                key={i}
                item={folderItem}
                level={level}
                collapsible={folderItem.$collapsible}
              >
                {children}
              </Folder>
            );

          return (
            <TernPageTreeFolder
              key={i}
              item={folderItem}
              level={level}
              collapsible={folderItem.$collapsible}
            >
              {children}
            </TernPageTreeFolder>
          );
        }

        const pageItem = item as PageTree.Item;

        if (Item) return <Item key={pageItem.url} item={pageItem} />;

        return (
          <SidebarItem
            key={pageItem.url}
            href={pageItem.url}
            external={pageItem.external}
            icon={pageItem.icon}
          >
            {pageItem.name}
          </SidebarItem>
        );
      });
    }

    return renderSidebarList(pageTree, 1);
  }, [isActiveNavCollapsible, components, pageTree]);

  return (
    <Fragment>
      {/* Navigation Buttons/Folders */}
      <div className="flex flex-col gap-1 mb-4">
        {navigation.map((nav, index) => {
          // Check if this navigation matches the current URL path
          const isCurrentPath = currentNavIndex === index;

          const resolvedNavUrl = nav.url ? nav.url.replace(/\$\{sdk\}/g, sdk) : undefined;

          // If collapsible, render as a folder in the navigation area
          if (nav.collapsible === true) {
            const navPageTree = convertNavigationToPageTree(nav.items, sdk);
            
            const renderNavItems = (items: PageTree.Node[]): ReactNode[] => {
              return items.map((item, i) => {
                if (item.type === "folder") {
                  const folderItem = item as PageTree.Folder & {
                    $collapsible?: boolean;
                  };
                  const children = renderNavItems(folderItem.children);
                  
                  return (
                    <TernPageTreeFolder
                      key={i}
                      item={folderItem}
                      level={1}
                      collapsible={folderItem.$collapsible}
                    >
                      {children}
                    </TernPageTreeFolder>
                  );
                }
                
                const pageItem = item as PageTree.Item;
                return (
                  <SidebarItem
                    key={pageItem.url}
                    href={pageItem.url}
                    external={pageItem.external}
                    icon={pageItem.icon}
                  >
                    {pageItem.name}
                  </SidebarItem>
                );
              });
            };
            
            return (
              <SidebarFolder key={index} defaultOpen={isCurrentPath}>
                <SidebarFolderTrigger
                  className={cn(
                    isCurrentPath && "font-medium text-fd-accent-foreground"
                  )}
                >
                  {nav.icon}
                  {nav.title}
                </SidebarFolderTrigger>
                <SidebarFolderContent>
                  <div className="space-y-1">
                    {renderNavItems(navPageTree)}
                  </div>
                </SidebarFolderContent>
              </SidebarFolder>
            );
          }

          // Otherwise render as a link
          return (
            <SidebarItem
              key={index}
              href={resolvedNavUrl || "#"}
              icon={nav.icon}
              onClick={() => setActiveNavIndex(null)}
              className={cn(
                "data-[active=true]:font-medium",
                isCurrentPath && "bg-fd-accent font-medium text-fd-accent-foreground"
              )}
            >
              {nav.title}
            </SidebarItem>
          );
        })}
      </div>

      {/* Navigation Items - only show for non-collapsible navigations */}
      {!isActiveNavCollapsible && navigationItemsContent && (
        <>
          {/* Separator */}
          {pageTree.length > 0 && (
            <div className="border-t border-fd-border mb-4" />
          )}

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navigationItemsContent}
          </nav>
        </>
      )}
    </Fragment>
  );
}

/**
 * Custom folder component that respects collapsible property
 */
function TernPageTreeFolder({
  item,
  collapsible = true,
  ...props
}: {
  item: PageTree.Folder;
  level: number;
  collapsible?: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Determine if folder should be open by default
  const shouldBeOpen = useMemo(() => {
    const checkPath = (nodes: PageTree.Node[]): boolean => {
      return nodes.some((node) => {
        if (node.type === "page") {
          return (
            pathname === node.url || pathname.startsWith(`${node.url}/`)
          );
        }
        if (node.type === "folder") {
          return checkPath(node.children);
        }
        return false;
      });
    };

    return (
      (item.index &&
        (pathname === item.index.url ||
          pathname.startsWith(`${item.index.url}/`))) ||
      checkPath(item.children)
    );
  }, [item, pathname]);

  // If collapsible is explicitly true, render as collapsible folder
  if (collapsible === true) {
    return (
      <SidebarFolder defaultOpen={shouldBeOpen}>
        {item.index ? (
          <SidebarFolderLink
            href={item.index.url}
            external={item.index.external}
            {...props}
          >
            {item.icon}
            {item.name}
          </SidebarFolderLink>
        ) : (
          <SidebarFolderTrigger {...props}>
            {item.icon}
            {item.name}
          </SidebarFolderTrigger>
        )}
        <SidebarFolderContent>{props.children}</SidebarFolderContent>
      </SidebarFolder>
    );
  }

  // Default: render as link only (no folder behavior)
  return (
    <SidebarItem
      href={item.index?.url || "#"}
      external={item.index?.external}
      icon={item.icon}
    >
      {item.name}
    </SidebarItem>
  );
}

/**
 * Props for the custom sidebar layout
 */
export interface TernSidebarConfig {
  tabs: SidebarTab[];
  navigation: SidebarNavigation[];
  components?: Partial<CustomSidebarComponents>;
}
