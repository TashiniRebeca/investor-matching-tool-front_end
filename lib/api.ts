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

    return response.data; // TypeScript knows this is Investor[]
  } catch (error) {
    console.error("❌ Error fetching investors:", error);
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
    console.error("❌ Error in manual investor search:", error);
    return [];
  }
};

// ✅ Export Search Results
export const exportResults = async (sector: string) => {
  try {
    const response = await axios.get(`${API_URL}/api/exportResults`, {
      params: { sector },
      responseType: "blob", // Ensures it's handled as a file
    });

    // Create a URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Investor_Results.xlsx");
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error("❌ Error exporting results:", error);
  }
};
