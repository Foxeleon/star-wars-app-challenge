"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchResourceById } from "@/services/swapi";
import { ResourceType, DisplayableResource } from "@/types";

function ResourceFullDetails({ resource }: { resource: DisplayableResource; type: ResourceType }) {
    const details = Object.entries(resource).map(([key, value]) => {
        // Skip keys that we don't want to display
        if (['name', 'title', 'url', 'created', 'edited', 'homeworld'].includes(key) || Array.isArray(value)) {
            return null;
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
                    {resource && <ResourceFullDetails resource={resource} type={resourceType} />}
                </CardContent>
            </Card>
            <Link href="/">
                <Button variant="outline">Back to Holocron</Button>
            </Link>
        </div>
    );
}
