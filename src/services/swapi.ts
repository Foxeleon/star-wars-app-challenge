import { PaginatedResponse, ResourceType, DisplayableResource } from "@/types";

const BASE_URL = "https://swapi.py4e.com/api";

export async function fetchResources<T extends DisplayableResource>(
    resource: ResourceType,
    page: number
): Promise<PaginatedResponse<T>> {
    const response = await fetch(`${BASE_URL}/${resource}/?page=${page}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${resource}`);
    }
    return response.json();
}

// NEW: A generic function to fetch a single resource by its ID
export async function fetchResourceById<T extends DisplayableResource>(
    resource: ResourceType,
    id: string
): Promise<T> {
    const response = await fetch(`${BASE_URL}/${resource}/${id}/`);
    if (!response.ok) {
        throw new Error(`Failed to fetch ${resource} with id ${id}`);
    }
    return response.json();
}