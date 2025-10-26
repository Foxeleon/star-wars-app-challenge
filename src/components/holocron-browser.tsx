"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/resource-card";
import { ResourceType, DisplayableResource, PaginatedResponse } from "@/types";
import { fetchResources } from "@/services/swapi";

const resources: ResourceType[] = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];

export default function HolocronBrowser() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeResource = (searchParams.get('tab') as ResourceType) || 'people';
    const page = Number(searchParams.get('page')) || 1;

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery<PaginatedResponse<DisplayableResource>, Error>({
        queryKey: [activeResource, page],
        queryFn: () => fetchResources(activeResource, page),
        placeholderData: keepPreviousData,
    });

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
        <Tabs value={activeResource} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-auto w-full justify-start overflow-x-auto mb-8">
                {resources.map((res) => (
                    <TabsTrigger key={res} value={res} className="capitalize flex-shrink-0">
                        {res}
                    </TabsTrigger>
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
    );
}
