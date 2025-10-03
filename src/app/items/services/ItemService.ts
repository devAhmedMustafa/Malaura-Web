import { STORE_ID } from "@/app/data/IDs";
import api from "@/utils/api";
import Item from "../models/Item";

export default class ItemService {

    static async getItems() : Promise<Item[]> {
        try {
            const response = await api.get(`/Item/branch/${STORE_ID}`);

            if (response.status !== 200) {
                throw new Error(`Failed to fetch items: ${response.statusText}`);
            }

            return response.data;
        }
        catch (error) {
            console.error('Error fetching items:', error);
            throw error;
        }
    }

    static async getItemById(itemId: string) : Promise<Item | null> {
        try {
            const response = await api.get(`/Item/${itemId}`);
            if (response.status === 200) {
                return response.data;
            }
            else if (response.status === 404) {
                return null; // Item not found
            }
            else {
                throw new Error(`Failed to fetch item: ${response.statusText}`);
            }
        }
        catch (error) {
            console.error('Error fetching item by ID:', error);
            throw error;
        }
    }

}