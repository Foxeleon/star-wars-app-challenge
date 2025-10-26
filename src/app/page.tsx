"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/resource-card";
import { ResourceType, DisplayableResource, PaginatedResponse } from "@/types";
import { fetchResources } from "@/services/swapi";

const resources: ResourceType[] = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];

export default function HomePage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Read state from URL or use defaults
    const activeResource = (searchParams.get('tab') as ResourceType) || 'people';
    const page = Number(searchParams.get('page')) || 1;

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery<PaginatedResponse<DisplayableResource>, Error>({
        queryKey: [activeResource, page],
        queryFn: () => fetchResources(activeResource, page),
        placeholderData: keepPreviousData,
    });

    // Function to update URL search params
    const createQueryString = (params: Record<string, string | number>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([key, value]) => {
            newSearchParams.set(key, String(value));
        });
        return newSearchParams.toString();
    };

    const handleTabChange = (value: string) => {
        router.push(`${pathname}?${createQueryString({ tab: value, page: 1 })}`);
    };

    const handlePageChange = (newPage: number) => {
        router.push(`${pathname}?${createQueryString({ tab: activeResource, page: newPage })}`);
    };

    const totalPages = data ? Math.ceil(data.count / 10) : 0;

    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Star Wars Holocron</h1>
            <Tabs value={activeResource} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-8">
                    {resources.map((res) => (
                        <TabsTrigger key={res} value={res} className="capitalize">{res}</TabsTrigger>
                    ))}
                </TabsList>
                <TabsContent value={activeResource} forceMount>
                    {isLoading && page === 1 ? (
                        <div className="text-center p-10 text-xl">Loading {activeResource}...</div>
                    ) : isError ? (
                        <div className="text-center p-10 text-red-500">Error: {error.message}</div>
                    ) : (
                        <>
                            <div className="flex flex-wrap justify-center gap-6">
                                {data?.results.map((item) => (
                                    <ResourceCard key={item.url} resource={item} type={activeResource} page={page} />
                                ))}
                            </div>

                            <div className="flex justify-center items-center gap-4 mt-8 py-4">
                                <Button onClick={() => handlePageChange(Math.max(page - 1, 1))} disabled={!data?.previous || isPlaceholderData}>
                                    Previous
                                </Button>
                                <span>Page {page} of {totalPages > 0 ? totalPages : '?'}</span>
                                <Button onClick={() => handlePageChange(page + 1)} disabled={!data?.next || isPlaceholderData}>
                                    Next
                                </Button>
                            </div>
                        </>
                    )}
                </TabsContent>
            </Tabs>
        </main>
    );
}
