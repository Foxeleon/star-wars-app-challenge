// A union type for all possible resource categories from SWAPI
export type ResourceType = 'people' | 'planets' | 'films' | 'species' | 'vehicles' | 'starships';

/**
 * Base interface for any resource. The `name` property is common for most,
 * but `films` use `title` instead. This interface handles both cases.
 */
export interface DisplayableResource {
    name?: string;
    title?: string;
    url: string;
}

export interface Person extends DisplayableResource {
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
}

export interface Planet extends DisplayableResource {
    rotation_period: string;
    orbital_period: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: string;
    population: string;
}

export interface Film extends DisplayableResource {
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
}

export interface Species extends DisplayableResource {
    classification: string;
    designation: string;
    average_height: string;
    skin_colors: string;
    hair_colors: string;
    eye_colors: string;
    average_lifespan: string;
    language: string;
}

export interface Vehicle extends DisplayableResource {
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    vehicle_class: string;
}

export interface Starship extends DisplayableResource {
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    hyperdrive_rating: string;
    MGLT: string;
    starship_class: string;
}

/**
 * A generic interface for paginated API responses.
 * It can hold an array of any resource type that extends DisplayableResource.
 * @template T - The type of resource in the `results` array.
 */
export interface PaginatedResponse<T extends DisplayableResource> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}
