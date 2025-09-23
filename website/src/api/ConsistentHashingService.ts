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

export async function addNode(virtualPointsNumber: number): Promise<{id: string, virtualPoints: number[]}> {
    const url = `${process.env.NEXT_PUBLIC_CONSISTENT_HASHING_URL}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ virtualPointsNumber }),
    });
    if (!response.ok) {
        throw new Error('Failed to add new node');
    }
    const responseData = await response.json() as { message: string, data: {id: string, virtualPoints: number[] }};
    return responseData.data;
}

export async function removeNode(nodeId: string): Promise<boolean> {
    const url = `${process.env.NEXT_PUBLIC_CONSISTENT_HASHING_URL}/${nodeId}`;
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.ok;
}