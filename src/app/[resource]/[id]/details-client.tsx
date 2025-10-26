"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchResourceById } from "@/services/swapi";
import { ResourceType, DisplayableResource, Planet } from "@/types";

/**
 * A specialized component to fetch and display the name of a homeworld from its URL.
 * It encapsulates its own data-fetching logic.
 */
function HomeworldLink({ url }: { url: string }) {
    const { data: planet, isLoading } = useQuery<Planet, Error>({
        queryKey: ['planet', url],
        queryFn: async () => {
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Failed to fetch homeworld');
            }
            return res.json();
        },
        staleTime: Infinity, // Planet data is static, so we can cache it forever
    });

    if (isLoading) return <>Loading...</>;

    const planetId = url.split("/").filter(Boolean).pop();

    return (
        <Link href={`/planets/${planetId}`} className="text-blue-400 hover:underline">
            {planet?.name || 'Unknown'}
        </Link>
    );
}

/**
 * The main component for rendering all details of a resource.
 */
function ResourceFullDetails({ resource }: { resource: DisplayableResource }) {
    const details = Object.entries(resource).map(([key, value]) => {
        if (['name', 'title', 'url', 'created', 'edited'].includes(key) || Array.isArray(value)) {
            return null;
        }
        if (key === 'homeworld' && typeof value === 'string') {
            return (
                <p key={key}>
                    <strong className="capitalize">Homeworld:</strong> <HomeworldLink url={value} />
                </p>
            );
        }

        return (
            <p key={key}>
                <strong className="capitalize">{key.replace(/_/g, ' ')}:</strong> {String(value)}
            </p>
        );
    });

    return <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">{details}</div>;
}

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
            router.back(); // Fallback for direct navigation or history loss
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
