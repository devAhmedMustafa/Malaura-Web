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

}