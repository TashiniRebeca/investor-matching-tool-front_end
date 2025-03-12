import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Define the Investor type
type Investor = {
  id: number;
  name: string;
  sector: string;
  funding_stage: string;
  country: string;
  investment_min: string;
  investment_max: string;
  city?: string;
  prop_tech?: string;
  tech_medium?: string;
  video_link: string;
};

// Search Investors (Handles both Normal & Advanced Search)
export const searchInvestors = async (searchParams: {
  sector?: string;
  geography?: string;
  investmentMin?: string;
  investmentMax?: string;
  series?: string;
  city?: string;
  propTech?: string;
  techMedium?: string;
  isAdvanced: boolean;
}): Promise<Investor[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/investors/search`, {
      params: searchParams,
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching investors:", error);
    return [];
  }
};

export const manualSearchInvestors = async (
  sector: string
): Promise<Investor[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/manual-search`, {
      params: { sector },
    });

    return response.data;
  } catch (error) {
    console.error("Error in manual investor search:", error);
    return [];
  }
};
