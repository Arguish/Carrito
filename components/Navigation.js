"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/context/GameContext";

export default function Navigation() {
    const pathname = usePathname();
    const { unopenedBoosters = [] } = useGame();

    const navItems = [
        { href: "/shop", label: "Tienda" },
        { href: "/boosters", label: "Sobres", badge: unopenedBoosters.length },
        { href: "/collection", label: "Colección" },
    ];

    return (
        <nav className="bg-magic-dark border-b border-magic-gray">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex gap-2">
                    {navItems.map((item) => {
                        const isActive =
                            pathname === item.href ||
                            (pathname === "/" && item.href === "/shop");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-8 py-4 font-semibold uppercase tracking-wider text-sm relative transition-colors ${
                                    isActive
                                        ? "text-magic-white bg-magic-gray border-b-2 border-magic-orange"
                                        : "text-gray-400 hover:text-magic-white hover:bg-magic-gray"
                                }`}
                            >
                                {item.label}
                                {item.badge !== undefined && item.badge > 0 && (
                                    <span className="absolute top-2 -right-1 bg-magic-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
