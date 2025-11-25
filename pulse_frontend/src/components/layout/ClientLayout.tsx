'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, User, LogOut, Settings, Ticket, Heart } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/stores/auth.store';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { dmSans, spaceGrotesk } from '@/lib/fonts';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { isAuthenticated, user, logout } = useAuthStore();
    const [isScrolled, setIsScrolled] = useState(false);

    // Detect scroll to add shadow to navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Don't show navbar on auth pages
    if (pathname?.startsWith('/login') || pathname?.startsWith('/register')) {
        return <>{children}</>;
    }

    const handleLogout = () => {
        logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navbar */}
            <nav className={`glass-strong sticky top-0 z-50 border-b border-border/50 transition-shadow duration-300 ${isScrolled ? 'shadow-lg shadow-black/10 glass-strong backdrop-blur-xl' : ''
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left side */}
                        <div className="flex justify-start items-center gap-6">
                            {/* Logo */}
                            <Link href="/" className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full gradient-primary flex items-center justify-center">
                                    <span className={`${spaceGrotesk.className} text-white font-bold text-sm`}>P</span>
                                </div>
                                <span className={`${spaceGrotesk.className} text-sm font-bold text-gradient-primary hidden sm:block`}>
                                    Pulse
                                </span>
                            </Link>

                            {/* Nav Links - Desktop */}
                            <div className="hidden md:flex justify-start items-center gap-3 text-sm">
                                <Link
                                    href="/events"
                                    className={`${spaceGrotesk.className} hover:text-purple-500 text-sm transition-colors ${pathname === '/events' ? 'text-purple-500 font-medium' : ''
                                        }`}
                                >
                                    Events
                                </Link>
                                <Link
                                    href="/organizations"
                                    className={`${spaceGrotesk.className} hover:text-purple-500 text-sm transition-colors ${pathname === '/organizations' ? 'text-purple-500 font-medium' : ''
                                        }`}
                                >
                                    Organizations
                                </Link>
                                {isAuthenticated && user?.role === 'ORGANIZER' && (
                                    <Link
                                        href="/dashboard"
                                        className={`hover:text-purple-500 ${spaceGrotesk.className} text-sm transition-colors ${pathname === '/dashboard' ? 'text-purple-500 font-medium' : ''
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="flex items-center gap-3">
                            {isAuthenticated ? (
                                <>
                                    {/* User Menu */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className={`${spaceGrotesk.className} gap-2`}>
                                                {user?.avatar ? (
                                                    <img
                                                        src={user.avatar}
                                                        alt={user.name}
                                                        className="w-8 h-8 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                                                        <span className="text-white text-sm font-bold">
                                                            {user?.name?.[0]?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="hidden sm:block">{user?.name}</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className={`${spaceGrotesk.className} glass w-56`}>
                                            <DropdownMenuLabel>
                                                {user?.email}
                                                <div className="text-xs text-muted-foreground font-normal mt-1">
                                                    {user?.rewardPoints || 0} Points
                                                </div>
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                                <User className="w-4 h-4 mr-2" />
                                                Profile
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push('/bookings')}>
                                                <Ticket className="w-4 h-4 mr-2" />
                                                My Bookings
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push('/wishlist')}>
                                                <Heart className="w-4 h-4 mr-2" />
                                                Wishlist
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push('/settings')}>
                                                <Settings className="w-4 h-4 mr-2" />
                                                Settings
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Logout
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" className={`${spaceGrotesk.className} sm:flex}`}>
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button className={`${spaceGrotesk.className} gradient-primary text-white hover:opacity-90`}>
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}

                            {/* Mobile Menu */}
                            <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-card border-t border-border mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className={`${spaceGrotesk.className} font-bold text-lg mb-4 text-gradient-primary`}>Pulse</h3>
                            <p className={`${dmSans.className} text-sm text-muted-foreground`}>
                                AI-powered event marketplace connecting people with amazing experiences
                            </p>
                        </div>
                        <div>
                            <h4 className={`${dmSans.className} font-semibold mb-4`}>Platform</h4>
                            <ul className={`${dmSans.className} space-y-2 text-sm text-muted-foreground`}>
                                <li>
                                    <Link href="/events" className="hover:text-primary">
                                        Browse Events
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/organizations" className="hover:text-primary">
                                        For Organizers
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/pricing" className="hover:text-primary">
                                        Pricing
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`${dmSans.className} font-semibold mb-4`}>Company</h4>
                            <ul className={`${dmSans.className} space-y-2 text-sm text-muted-foreground`}>
                                <li>
                                    <Link href="/about" className="hover:text-primary">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/blog" className="hover:text-primary">
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/careers" className="hover:text-primary">
                                        Careers
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className={`${dmSans.className} font-semibold mb-4`}>Support</h4>
                            <ul className={`${dmSans.className} space-y-2 text-sm text-muted-foreground`}>
                                <li>
                                    <Link href="/help" className="hover:text-primary">
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="hover:text-primary">
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="hover:text-primary">
                                        Terms
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={`${dmSans.className} mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground`}>
                        <p>© 2024 Pulse. All rights reserved. Built with ❤️ for event lovers.</p>
                    </div>
                </div>
            </footer>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    className: 'glass-strong',
                    duration: 3000,
                    style: {
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: '#fff',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                    },
                }}
            />
        </div>
    );
}
