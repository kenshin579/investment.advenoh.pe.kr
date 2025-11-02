'use client'

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Menu, X, ChartLine, Sun, Moon, BookOpen, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/components/theme-provider";

interface Category {
  category: string;
  count: number;
}

export function Header() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Static navigation items for SSG
  const navItems = [
    { href: "/", label: "전체" },
    { href: "/?category=Stock", label: "Stock" },
    { href: "/?category=ETF", label: "ETF" },
    { href: "/?category=Weekly", label: "Weekly" },
    { href: "/?category=Etc", label: "Etc" }
  ];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <ChartLine className="text-primary text-2xl" />
            <span className="text-xl font-bold text-primary">투자 인사이트</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.includes(item.href);
              
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors ${
                    isActive ? "text-primary" : ""
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </div>

          {/* Search, Tags, Series & Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            {/* Search component removed for now */}

            {/* Tags Button */}
            <Link href="/tags">
              <Button
                variant="ghost"
                size="sm"
                className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <span className="sr-only">태그</span>
                <Hash className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" />
              </Button>
            </Link>

            {/* Series Button */}
            <Link href="/series">
              <Button
                variant="ghost"
                size="sm"
                className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
              >
                <span className="sr-only">시리즈</span>
                <BookOpen className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" />
              </Button>
            </Link>

            {/* Dark Mode Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="relative w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <span className="sr-only">다크 모드 토글</span>
              <div className="relative w-5 h-5 overflow-hidden flex items-center justify-center">
                <Sun className={`absolute w-5 h-5 text-yellow-500 transition-all duration-300 ${
                  theme === 'light' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
                }`} />
                <Moon className={`absolute w-5 h-5 text-blue-600 transition-all duration-300 ${
                  theme === 'dark' ? 'rotate-0 scale-100' : 'rotate-90 scale-0'
                }`} />
              </div>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : pathname.includes(item.href);
                
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    className={`block px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors ${
                      isActive ? "text-primary" : ""
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                );
              })}
              {/* Mobile search removed for now */}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
