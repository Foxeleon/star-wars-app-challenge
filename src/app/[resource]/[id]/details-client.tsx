"use client";

import { useQuery, useQueries } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchResourceById } from "@/services/swapi";
import { ResourceType, DisplayableResource } from "@/types";

// --- SUB-COMPONENTS for rendering related data ---

function SingleResourceLink({ url, title }: { url: string; title: string }) {
    const { data, isLoading } = useQuery<DisplayableResource, Error>({
        queryKey: ['resource', url],
        queryFn: async () => {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Failed to fetch linked resource');
            }
            return res.json();
        },
        staleTime: Infinity,
    });

    if (isLoading) return <p><strong className="capitalize">{title}:</strong> Loading...</p>;

    const urlParts = url.split('/').filter(Boolean);
    const resourceType = urlParts[urlParts.length - 2] as ResourceType;
    const id = urlParts[urlParts.length - 1];

    return (
        <p>
            <strong className="capitalize">{title}:</strong>
            <Link href={`/${resourceType}/${id}`} className="text-blue-400 hover:underline ml-2">
                {data?.name || data?.title || 'Unknown'}
            </Link>
        </p>
    );
}

function RelatedLinksList({ urls, title }: { urls: string[]; title: string; }) {
    const queries = useQueries({
        queries: urls.map(url => ({
            queryKey: ['resource', url],
            queryFn: async () => {
                const res = await fetch(url);
                if (!res.ok) {
                    throw new Error('Failed to fetch related resource list');
                }
                return res.json();
            },
            staleTime: Infinity,
        })),
    });

    if (!urls || urls.length === 0) return null;

    return (
        <div className="col-span-1 sm:col-span-2">
            <strong className="capitalize">{title}:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
                {queries.map(({ data, isLoading }, index) => {
                    if (isLoading) return <Button key={index} variant="outline" size="sm" className="h-auto py-1 px-2 text-xs" disabled>Loading...</Button>;

                    const urlParts = urls[index].split('/').filter(Boolean);
                    const resourceType = urlParts[urlParts.length - 2] as ResourceType;
                    const id = urlParts[urlParts.length - 1];

                    return (
                        <Link key={urls[index]} href={`/${resourceType}/${id}`} passHref>
                            <Button variant="outline" size="sm" className="h-auto py-1 px-2 text-xs">
                                {data?.name || data?.title || 'Unknown'}
                            </Button>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

function ResourceFullDetails({ resource }: { resource: DisplayableResource }) {
    const details = Object.entries(resource).map(([key, value]) => {
        const formattedKey = key.replace(/_/g, ' ');

        if (['name', 'title', 'url', 'created', 'edited'].includes(key)) {
            return null;
        }

        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string' && value[0].includes('http')) {
            return <RelatedLinksList key={key} urls={value} title={formattedKey} />;
        }

        if (typeof value === 'string' && value.includes('http')) {
            return <SingleResourceLink key={key} url={value} title={formattedKey} />;
        }

        return (
            <p key={key}>
                <strong className="capitalize">{formattedKey}:</strong> {String(value)}
            </p>
        );
    });

    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">{details}</div>;
}


// --- MAIN CLIENT COMPONENT ---

interface DetailsPageProps {
    resourceType: ResourceType;
    id: string;
}

export default function DetailsClient({ resourceType, id }: DetailsPageProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: resource, isLoading, isError, error } = useQuery<DisplayableResource, Error>({
        queryKey: [resourceType, id],
        queryFn: () => fetchResourceById(resourceType, id),
    });

    const handleBack = () => {
        const tab = searchParams.get('tab');
        const page = searchParams.get('page');

        if (tab && page) {
            router.push(`/?tab=${tab}&page=${page}`);
        } else {
            router.back();
        }
    };

    if (isLoading) return <div className="text-center p-10">Loading Holocron entry...</div>;
    if (isError) return <div className="text-center p-10 text-red-500">Data corrupted: {error.message}</div>;

    const name = resource?.name || resource?.title;

    return (
        <div className="container mx-auto p-4 flex flex-col items-center gap-8 min-h-screen">
            <Card className="w-full max-w-4xl mt-10">
                <CardHeader>
                    <CardTitle className="text-3xl">{name}</CardTitle>
                </CardHeader>
                <CardContent>
                    {resource && <ResourceFullDetails resource={resource} />}
                </CardContent>
            </Card>
            <div className="w-full max-w-4xl flex justify-between items-center">
                <Link href="/">
                    <Button variant="ghost">Back to Holocron Homepage</Button>
                </Link>
                <Button onClick={handleBack} variant="outline">
                    Back
                </Button>
            </div>
        </div>
    );
}
