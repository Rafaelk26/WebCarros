// Import from development
import { ReactNode } from 'react';

interface containerProps{
    children: ReactNode;
}

export function Container({children}: containerProps){
    return(
        <>
            <div className="w-full max-w-7xl mx-auto px-4">
                {children}
            </div>
        </>
    )
}