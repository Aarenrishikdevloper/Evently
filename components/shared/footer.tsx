import React from 'react';
import Image from "next/image";
import Link from "next/link";

const Footer  = () => {
    // Your component logic here

    return (
        <footer className={'border-t'}>
            <div className={'flex-center wrapper flex-between flex flex-col gap-4 text-center sm:flex-row'}>
                <Link href={'/'}>
                 <Image src={"/assets/images/logo.svg"} alt={'logo'} width={128} height={38}/>

                </Link>
                <p> 2023 Evenly. All Rights reserved</p>
            </div>

        </footer>
    );
};

export default Footer