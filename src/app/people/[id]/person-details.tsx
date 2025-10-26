"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchPersonById } from "@/services/swapi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Person } from "@/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This component now receives a simple `id` string as a prop.
interface PersonDetailsProps {
    id: string;
}

export default function PersonDetails({ id }: PersonDetailsProps) {
    // We use the `id` prop directly for the query.
    const { data: person, isLoading, isError, error } = useQuery<Person, Error>({
        queryKey: ["person", id],
        queryFn: () => fetchPersonById(id),
    });

    if (isLoading) return <div className="text-center p-10">Loading character data...</div>;
    if (isError) return <div className="text-center p-10">Archive data corrupted: {(error as Error).message}</div>;

    return (
        <div className="container mx-auto p-4 flex flex-col items-center gap-8 min-h-screen">
            <Card className="w-full max-w-2xl mt-10">
                <CardHeader>
                    <CardTitle className="text-3xl">{person?.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                    <p><strong>Height:</strong> {person?.height} cm</p>
                    <p><strong>Mass:</strong> {person?.mass} kg</p>
                    <p><strong>Hair Color:</strong> {person?.hair_color}</p>
                    <p><strong>Skin Color:</strong> {person?.skin_color}</p>
                    <p><strong>Eye Color:</strong> {person?.eye_color}</p>
                    <p><strong>Birth Year:</strong> {person?.birth_year}</p>
                    <p><strong>Gender:</strong> {person?.gender}</p>
                </CardContent>
            </Card>
            <Link href="/">
                <Button variant="outline">Back to list</Button>
            </Link>
        </div>
    );
}
