import { Suspense } from 'react';
import HolocronBrowser from '@/components/holocron-browser';

// A simple loading component to be used as a fallback for Suspense
function BrowserSkeleton() {
    return <div className="text-center p-10 text-xl">Initializing Holocron...</div>;
}

export default function HomePage() {
    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Star Wars Holocron</h1>

            <Suspense fallback={<BrowserSkeleton />}>
                <HolocronBrowser />
            </Suspense>
        </main>
    );
}
