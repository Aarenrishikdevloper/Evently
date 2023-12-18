import React from 'react';

const Layout = ({children}:{children:React.ReactNode}) => {
    // Your component logic here

    return (
        <div className="flex-center  min-h-screen w-full bg-primary-50 bg-dotted-pattern bg-cover bg-center">
            {/* Your JSX content here */}
            {children}
        </div>
    );
};

export default Layout