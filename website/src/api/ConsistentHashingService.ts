import { nodeList } from '../pages/consistent-hashing/type';

export async function getNodeList(): Promise<nodeList> {
    const url = `${process.env.NEXT_PUBLIC_CONSISTENT_HASHING_URL}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch node list');
    }
    const responseData = await response.json() as { nodes: nodeList };
    return responseData.nodes;
}
