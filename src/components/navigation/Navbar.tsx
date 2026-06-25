'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Target, Swords, Map, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Hunt Mode', href: '/dashboard', icon: Target },
  { name: 'Weaponry', href: '/forge', icon: Swords },
  { name: 'Territory', href: '/territory', icon: Map },
  { name: 'Vault', href: '/vault', icon: Lock },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md h-20 flex items-center px-6">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-[#b154f8]">
            <span className="material-symbols-outlined text-4xl leading-none">token</span>
          </div>
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
            HYDRA<span className="text-[#b154f8]">HUNT</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#b154f8]",
                pathname === item.href ? "text-[#b154f8]" : "text-white/70"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="bg-gradient-to-r from-[#b154f8] to-[#6d28d9] px-6 py-2.5 rounded-lg text-sm font-bold text-white hover:opacity-90 transition-opacity shadow-lg shadow-[#b154f8]/20"
        >
          Unleash Hunt Mode
        </Link>
      </div>
    </nav>
  );
}
