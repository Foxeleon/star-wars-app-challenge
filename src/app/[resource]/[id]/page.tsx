import DetailsClient from './details-client';
import { ResourceType } from '@/types';

interface PageParams {
    resource: ResourceType;
    id: string;
}

interface DetailPageProps {
    params: Promise<PageParams>;
}

export default async function DetailPage({ params }: DetailPageProps) {
    const { resource, id } = await params;

    return <DetailsClient resourceType={resource} id={id} />;
}
