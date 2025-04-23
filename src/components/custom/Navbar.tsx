"use client"
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '../ui/button'

import { LogOut, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
    const { data: session } = useSession()
    const user: User = session?.user

    return (
        <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <h1 className="font-bold text-2xl md:text-3xl bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text transition-all duration-300 hover:from-pink-500 hover:to-purple-600">
                            Secret Scribbles
                        </h1>
                    </Link>

                    {/* Navigation */}
                    <div className="flex items-center gap-4">
                        {session ? (
                            <>
                                <span className="hidden md:block font-medium text-gray-700 dark:text-gray-300">
                                    Welcome, <span className="text-purple-600 dark:text-purple-400">{user.username}</span>
                                </span>
                                
                                <Link href="/dashboard">
                                    <Button variant="outline" className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-gray-800">
                                        <LayoutDashboard size={18} />
                                        <span className="hidden md:inline">Dashboard</span>
                                    </Button>
                                </Link>
                                
                                <Button 
                                    onClick={() => signOut()} 
                                    variant="ghost" 
                                    className="flex items-center gap-2 hover:text-red-600 hover:bg-red-50 dark:hover:bg-gray-800"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden md:inline">Logout</span>
                                </Button>
                            </>
                        ) : (
                            <Link href='/sign-in'>
                                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar