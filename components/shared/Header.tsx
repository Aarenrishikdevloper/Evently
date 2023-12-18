import React from 'react';
import Link from "next/link";
import Image from "next/image";
import {Button} from "@/components/ui/button";
import {SignedIn, SignedOut, UserButton} from "@clerk/nextjs";
import NavItem from "@/components/shared/NavItem";
import MobileNav from "@/components/shared/MobileNav";

const App = () => {
    // Your component logic here

    return (
       <header  className='w-full  border-b'>
         <div className={ 'wrapper flex items-center justify-between'}>
             <Link href='/'>
                 <Image src='/assets/images/logo.svg' alt={"logo"} width={128} height={38}/>
             </Link>
             <SignedIn>
                 <nav className = "md:flex-between hidden w-full max-w-xs">
                     <NavItem/>
                 </nav>
             </SignedIn>
             <div className=' flex w-32 justify-end gap-3'>
                 <SignedIn>
                     <UserButton afterSignOutUrl={'/'}/>
                     <MobileNav/>
                 </SignedIn>

                 <SignedOut>
                     <Button asChild className="rounded-full" size={"lg"}>
                         <Link href={'/sign-in'}>
                             Login
                         </Link>

                     </Button>

                 </SignedOut>
             </div>
         </div>
       </header>
    );
};

export default App