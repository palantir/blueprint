"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, MenuItem, MenuDivider } from "./blueprint-client";
import type { PageTree } from "fumadocs-core/server";

interface SidebarProps {
    tree: PageTree.Root;
}

export function Sidebar({ tree }: SidebarProps) {
    const pathname = usePathname();

    return (
        <nav className="docs-sidebar-nav">
            <Menu large>
                <SidebarItems items={tree.children} pathname={pathname} />
            </Menu>
        </nav>
    );
}

interface SidebarItemsProps {
    items: PageTree.Node[];
    pathname: string;
}

function SidebarItems({ items, pathname }: SidebarItemsProps) {
    return (
        <>
            {items.map((item, index) => (
                <SidebarItem key={index} item={item} pathname={pathname} />
            ))}
        </>
    );
}

interface SidebarItemProps {
    item: PageTree.Node;
    pathname: string;
}

function SidebarItem({ item, pathname }: SidebarItemProps) {
    if (item.type === "separator") {
        return <MenuDivider title={item.name} />;
    }

    if (item.type === "folder") {
        return (
            <div className="docs-nav-section">
                <div className="docs-nav-section-title">{item.name}</div>
                <SidebarItems items={item.children} pathname={pathname} />
            </div>
        );
    }

    // item.type === "page"
    const isActive = pathname === item.url;

    return (
        <MenuItem
            text={item.name}
            href={item.url}
            active={isActive}
            className={isActive ? "active" : ""}
            tagName={Link as unknown as "a"}
        />
    );
}
