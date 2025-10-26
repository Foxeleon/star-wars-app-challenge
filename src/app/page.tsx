"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPeople } from "@/services/swapi";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Person, PaginatedPeopleResponse } from "@/types";

export default function HomePage() {
    const [page, setPage] = useState(1);

    const { data, isLoading, isError, error, isPlaceholderData } = useQuery<PaginatedPeopleResponse, Error>({
        queryKey: ["people", page],
        queryFn: () => fetchPeople(page),
        placeholderData: keepPreviousData,
    });

    const totalPages = data ? Math.ceil(data.count / 10) : 0;

    const getPersonId = (url: string) => url.split("/").filter(Boolean).pop();

    if (isLoading) return <div className="text-center p-10">Loading Star Wars App...</div>;
    if (isError) return <div className="text-center p-10">Error loading data: {error.message}</div>;

    return (
        <main className="container mx-auto p-4 md:p-8">
            <h1 className="text-4xl font-bold text-center mb-8">Star Wars App</h1>

            <div className="flex flex-wrap justify-center gap-6">
                {data?.results.map((person: Person) => (
                    <Card
                        key={person.name}
                        className="w-full max-w-sm sm:w-[280px] flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
                    >
                        <CardHeader>
                            <CardTitle>{person.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p>Birth Year: {person.birth_year}</p>
                            <p>Gender: {person.gender}</p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/people/${getPersonId(person.url)}`} className="w-full" passHref>
                                <Button className="w-full">Details</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8 py-4">
                <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={!data?.previous || isPlaceholderData}>
                    Previous
                </Button>
                <span>Page {page} of {totalPages > 0 ? totalPages : '?'}</span>
                <Button onClick={() => setPage(p => p + 1)} disabled={!data?.next || isPlaceholderData}>
                    Next
                </Button>
            </div>
        </main>
    );
}
