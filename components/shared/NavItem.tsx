
'use client'
import React from 'react';

import {usePathname} from "next/navigation";
import {headerLinks} from "@/constants";
import Link from "next/link";

const NavItem = () => {
    const pathname = usePathname()
    // Your component logic here

    return (
        <ul className={'md:flex-between flex w-full flex-col items-start gap-5 md:flex-row '}>
            {/* Your JSX content here */}
            {headerLinks.map((link)=>{
                const isActive = pathname === link.route;
                return(
                    <li key={link.route} className={`${isActive && 'text-primary-500' } flex-center p-medium-16 whitespace-nowrap`}>
                        <Link href={link.route}>{link.label}</Link>
                    </li>
                )
            })}
        </ul>
    );
};

export default NavItem