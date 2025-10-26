"use client";

import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchPeople } from "@/services/swapi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const getPersonId = (url: string) => url.split("/").filter(Boolean).pop();

  if (isLoading) return <div className="text-center p-10">Loading Star Wars App...</div>;
  if (isError) return <div className="text-center p-10">Error loading data: {(error as Error).message}</div>;

  return (
      <main className="container mx-auto p-4">
        <h1 className="text-4xl font-bold text-center mb-8">Star Wars App</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.results.map((person: Person) => (
              <Link href={`/people/${getPersonId(person.url)}`} key={person.name}>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{person.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Birth Year: {person.birth_year}</p>
                    <p>Gender: {person.gender}</p>
                  </CardContent>
                </Card>
              </Link>
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={!data?.previous || isPlaceholderData}>
              Previous
          </Button>
          <span>Page {page}</span>
          <Button onClick={() => setPage(p => p + 1)} disabled={!data?.next || isPlaceholderData}>
              Next
          </Button>
        </div>
      </main>
  );
}
