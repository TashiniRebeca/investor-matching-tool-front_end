import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Define the Investor type
type Investor = {
    id: number;
    name: string;
    sector: string;
    funding_stage: string;
    country: string;
};

// Ensure API returns correct type
export const searchInvestors = async (sector: string, funding_stage: string, country: string): Promise<Investor[]> => {
    try {
        const response = await axios.get(`${API_URL}/investors/search`, {
            params: { sector, funding_stage, country },
        });
        return response.data; // TypeScript now knows this is Investor[]
    } catch (error) {
        console.error("❌ Error fetching investors:", error);
        return [];
    }
};
