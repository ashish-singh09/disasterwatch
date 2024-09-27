"use client";

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HelpCircle, LogIn, Mail, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from "next-auth/react";
import Image from 'next/image';
import { signOut } from "next-auth/react"

export default function Navbar() {
    const { push } = useRouter();
    const { data: session, status } = useSession();

    return (
        <div>
            <header className="bg-white shadow-sm hidden md:block w-full">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">DisasterWatch</h1>
                        </div>
                        <div className="flex items-center space-x-4 w-full justify-end">
                            <Button variant="ghost"><HelpCircle className="mr-2 h-4 w-4" />Help</Button>
                            <Button variant="ghost"><Mail className="mr-2 h-4 w-4" />Contact</Button>
                            {status === 'authenticated' ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='outline-none border-none flex items-center flex-col justify-center'>
                                        <Image src={session?.user?.image ?? ''} alt='' width={40} height={40} className='rounded-full' />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='mr-2 z-[99999]'>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className='hover:!bg-transparent'>
                                            <p className='text-sm max-w-24 overflow-y-hidden'>{session?.user?.name}</p>
                                        </DropdownMenuItem>
                                        {session?.user?.role === 'admin' && (
                                            <DropdownMenuItem className='cursor-pointer' onClick={() => push('/admin')}>
                                                <p className='text-sm max-w-24 overflow-y-hidden'>Admin</p>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem>
                                            <Button onClick={() => signOut()} variant="ghost" className='px-0.5 w-full hover:bg-accent focus:bg-accent justify-start'><LogIn className="mr-2 h-4 w-4" />Logout</Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button onClick={() => push('/login')}><LogIn className="mr-2 h-4 w-4" />Login</Button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className='md:hidden'>
                <DropdownMenu>
                    <header className="bg-white shadow-sm">
                        <div className='flex justify-between items-center py-4 px-2'>
                            <h1 className="text-2xl font-bold text-gray-900">DisasterWatch</h1>
                            <DropdownMenuTrigger className='outline-none border-none'>
                                <Menu className="h-6 w-6" />
                            </DropdownMenuTrigger>
                        </div>
                        <DropdownMenuContent className='mr-2 z-[99999]'>
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                                <Button variant="ghost" className='px-0.5 w-full hover:bg-accent focus:bg-accent justify-start'><HelpCircle className="mr-2 h-4 w-4" />Help</Button>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Button variant="ghost" className='px-0.5 w-full hover:bg-accent focus:bg-accent justify-start'><Mail className="mr-2 h-4 w-4" />Contact</Button>
                            </DropdownMenuItem>
                            {status === 'authenticated' ? (
                                <DropdownMenu>
                                    <DropdownMenuTrigger className='outline-none w-full pb-1.5 border-none flex items-center flex-col justify-center'>
                                        <Image src={session?.user?.image ?? ''} alt='' width={40} height={40} className='rounded-full' />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className='z-[99999]'>
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className='hover:!bg-transparent'>
                                            <p className='text-sm max-w-24 overflow-y-hidden'>{session?.user?.name}</p>
                                        </DropdownMenuItem>
                                        {session?.user?.role === 'admin' && (
                                            <DropdownMenuItem className='cursor-pointer' onClick={() => push('/admin')}>
                                                <p className='text-sm max-w-24 overflow-y-hidden'>Admin</p>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem>
                                            <Button onClick={() => signOut()} variant="ghost" className='px-0.5 w-full hover:bg-accent focus:bg-accent justify-start'><LogIn className="mr-2 h-4 w-4" />Logout</Button>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            ) : (
                                <Button onClick={() => push('/login')}><LogIn className="mr-2 h-4 w-4" />Login</Button>
                            )}
                        </DropdownMenuContent>
                    </header>
                </DropdownMenu>
            </div>
        </div>
    )
}
