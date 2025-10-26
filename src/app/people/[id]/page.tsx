import PersonDetails from './person-details';

interface PageParams {
    id: string;
}

interface PersonPageProps {
    params: Promise<PageParams>;
}

export default async function PersonPage({ params }: PersonPageProps) {

    const resolvedParams = await params;
    const { id } = resolvedParams;

    return <PersonDetails id={id} />;
}
