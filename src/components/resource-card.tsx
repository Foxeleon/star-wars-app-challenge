import Link from "next/link";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ResourceType,
    DisplayableResource,
    Person,
    Planet,
    Film,
    Species,
    Vehicle,
    Starship,
} from "@/types";

/**
 * A dedicated component to render the specific details within a card's content area.
 * It uses a switch statement for clean, readable, and scalable logic.
 */
function ResourceCardDetails({ resource, type }: {
    resource: DisplayableResource;
    type: ResourceType;
}) {
    switch (type) {
        case "people":
            const person = resource as Person;
            return (
                <>
                    <p>Birth Year: {person.birth_year}</p>
                    <p>Gender: {person.gender}</p>
                </>
            );
        case "planets":
            const planet = resource as Planet;
            return (
                <>
                    <p>Climate: {planet.climate}</p>
                    <p>Population: {planet.population}</p>
                </>
            );
        case "films":
            const film = resource as Film;
            return (
                <>
                    <p>Director: {film.director}</p>
                    <p>Released: {film.release_date}</p>
                </>
            );
        case "species":
            const species = resource as Species;
            return (
                <>
                    <p>Classification: {species.classification}</p>
                    <p>Language: {species.language}</p>
                </>
            );
        case "vehicles":
            const vehicle = resource as Vehicle;
            return (
                <>
                    <p>Model: {vehicle.model}</p>
                    <p>Class: {vehicle.vehicle_class}</p>
                </>
            );
        case "starships":
            const starship = resource as Starship;
            return (
                <>
                    <p>Model: {starship.model}</p>
                    <p>Class: {starship.starship_class}</p>
                </>
            );
        default:
            return null;
    }
}

interface ResourceCardProps {
    resource: DisplayableResource;
    type: ResourceType;
    page: number;
}

/**
 * The main card component, responsible for the overall structure,
 * animations, and linking.
 */
export function ResourceCard({ resource, type, page }: ResourceCardProps) {
    const id = resource.url.split("/").filter(Boolean).pop();
    const name = resource.name || resource.title;

    // Create search params manually to include the current page and tab
    const searchParams = new URLSearchParams();
    searchParams.set('tab', type);
    searchParams.set('page', String(page));

    return (
        <Card className="w-full max-w-sm sm:w-[280px] flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
            <CardHeader>
                <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow text-sm text-muted-foreground space-y-2">
                <ResourceCardDetails resource={resource} type={type} />
            </CardContent>
            <CardFooter>
                <Link href={`/${type}/${id}?${searchParams.toString()}`} className="w-full" passHref>
                    <Button className="w-full">Details</Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
