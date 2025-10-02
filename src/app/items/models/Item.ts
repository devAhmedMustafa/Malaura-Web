export default interface Item {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    subCategory?: string;
    priority: number;
    branch: string;
    isAvailable: boolean;
}