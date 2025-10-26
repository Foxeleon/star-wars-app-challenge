import { PaginatedPeopleResponse, Person } from "@/types";

const BASE_URL = "https://swapi.py4e.com/api";

export const fetchPeople = async (page: number = 1): Promise<PaginatedPeopleResponse> => {
    const response = await fetch(`${BASE_URL}/people/?page=${page}`);
    if (!response.ok) {
        throw new Error("Failed to fetch people");
    }
    return response.json();
};

export const fetchPersonById = async (id: string): Promise<Person> => {
    const response = await fetch(`${BASE_URL}/people/${id}/`);
    if (!response.ok) {
        throw new Error("Failed to fetch person details");
    }
    return response.json();
};