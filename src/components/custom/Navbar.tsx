"use client"

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from '../ui/button'

const Navbar = () => {

    // data is of type session
    const { data: session } = useSession()

    // We don't write data?.user but session?.user
    const user: User = session?.user

    return (
        <>
            <nav className='p-4 md:p-6 shadow-md'>
            <div className='container mx-auto flex flex-col md:flex-row justify-between items-center'>
                <a href='#'>
                    <h1 className='font-bold text-4xl'>
                       Secret Scribbles 
                    </h1>
                </a>
                {
                    session ?
                        (
                            <>
                                <span className='mr-4'>
                                    Welcome, {user.username || user.email}
                                </span>
                                <Button className=' md:m-auto' onClick={() => signOut()}>
                                    Logout
                                </Button>
                            </>
                        ) :
                        (
                            <Link href='/sign-in'>
                                <Button className='w-full md:m-auto'>
                                    Login
                                </Button>
                            </Link>
                        )
                }
            </div>
        </nav>
        </>
    )
}

export default Navbar