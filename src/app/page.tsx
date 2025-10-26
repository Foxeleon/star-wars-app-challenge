"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResourceCard } from "@/components/resource-card";
import { ResourceType, DisplayableResource, PaginatedResponse } from "@/types";
import { fetchResources } from "@/services/swapi";

const resources: ResourceType[] = ['people', 'planets', 'films', 'species', 'vehicles', 'starships'];

export default function HomePage() {
    const [activeResource, setActiveResource] = useState<ResourceType>('people');
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery<PaginatedResponse<DisplayableResource>, Error>({
        queryKey: [activeResource, page],
        queryFn: () => fetchResources(activeResource, page),
        placeholderData: keepPreviousData,
    });

    const handleTabChange = (value: string) => {
        setActiveResource(value as ResourceType);
        setPage(1);
    };

    const totalPages = data ? Math.ceil(data.count / 10) : 0;

    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Star Wars Simple Holocron</h1>

            <Tabs defaultValue="people" onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 mb-8">
                    {resources.map((res) => (
                        <TabsTrigger key={res} value={res} className="capitalize">{res}</TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value={activeResource}>
                    {isLoading ? (
                        <div className="text-center p-10 text-xl">Loading {activeResource}...</div>
                    ) : isError ? (
                        <div className="text-center p-10 text-red-500">Error: {error.message}</div>
                    ) : (
                        <>
                            <div className="flex flex-wrap justify-center gap-6">
                                {data?.results.map((item) => (
                                    <ResourceCard key={item.url} resource={item} type={activeResource} />
                                ))}
                            </div>

                            <div className="flex justify-center items-center gap-4 mt-8 py-4">
                                <Button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={!data?.previous || isPlaceholderData}>
                                    Previous
                                </Button>
                                <span>Page {page} of {totalPages > 0 ? totalPages : '?'}</span>
                                <Button onClick={() => setPage((p) => p + 1)} disabled={!data?.next || isPlaceholderData}>
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
