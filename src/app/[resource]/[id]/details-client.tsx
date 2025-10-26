"use client";

import { useQuery } from "@tanstack/react-query";
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
        // Use the URL as the query key to ensure uniqueness
        queryKey: ['planet', url],
        // The query function is a simple fetch call to the provided URL
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

    // Extract the planet ID from its URL to create a link
    const planetId = url.split("/").filter(Boolean).pop();

    return (
        <Link href={`/planets/${planetId}`} className="text-blue-400 hover:underline">
            {planet?.name || 'Unknown'}
        </Link>
    );
}


/**
 * The main component for rendering all details of a resource.
 * It now intelligently handles the 'homeworld' key.
 */
function ResourceFullDetails({ resource }: { resource: DisplayableResource }) {
    const details = Object.entries(resource).map(([key, value]) => {
        // Skip keys that are not useful for the user
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

        // For all other keys, render them as simple text
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
    const { data: resource, isLoading, isError, error } = useQuery<DisplayableResource, Error>({
        queryKey: [resourceType, id],
        queryFn: () => fetchResourceById(resourceType, id),
    });

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
            <Link href="/">
                <Button variant="outline">Back to Holocron</Button>
            </Link>
        </div>
    );
}
