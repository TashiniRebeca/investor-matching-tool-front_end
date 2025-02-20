"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { searchInvestors } from "@/lib/api";
import {words} from "@/lib/data";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import {Spotlight} from "@/components/Spotlight";

type Investor = {
  id: number;
  name: string;
  sector: string;
  funding_stage: string;
  country: string;
  investment_size: string;
};

export default function Home() {
  const [sector, setSector] = useState("");
  const [fundingStage, setFundingStage] = useState("");
  const [country, setCountry] = useState("");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [fundingStages, setFundingStages] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  // Fetch sector, funding stage, and country options from backend
  // ✅ Fetch dropdown options on load
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/investor-options");
        console.log("✅ Dropdown Data:", response.data); // Debugging step

        if (response.data) {
          setSectors(response.data.sectors || []);
          setFundingStages(response.data.fundingStages || []);
          setCountries(response.data.countries || []);
        } else {
          console.warn("⚠️ No data received for dropdowns.");
        }
      } catch (error) {
        console.error("❌ Error fetching dropdown options:", error);
      }
    };

    fetchOptions();
  }, []);


  const handleSearch = async () => {
    console.log("🔍 Searching investors for:", { sector, fundingStage, country });
    const data = await searchInvestors(sector, fundingStage, country);

    // @ts-ignore
    setInvestors(data);
  };

  return (
      <div className="relative min-h-screen flex flex-col items-center justify-center text-white">
        <Spotlight
            className="-top-40 left-0 md:left-60 md:-top-20"
            fill="white"
        />

        {/* 🔥 Header */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center z-10">
          <TypewriterEffectSmooth words={words} />
          <p className="text-white">Find you perfect investor for your startup today....</p>
        </div>


        {/* 🟢 Search Section */}
        <div className="z-10 p-6 text-center bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-bold text-black mb-4">Search for Investors</h2>
          <div className="flex flex-wrap gap-4 justify-center">
            {/* 🔹 Sector Dropdown */}
            <div>
              <p className="text-black font-semibold">Sector</p>
              <select className="p-2 border rounded text-black" value={sector} onChange={(e) => setSector(e.target.value)}>
                <option value="">Select Sector</option>
                {sectors.length > 0 ? (
                    sectors.map((sec) => <option key={sec} value={sec}>{sec}</option>)
                ) : (
                    <option disabled>Loading...</option>
                )}
              </select>
            </div>

            {/* 🔹 Funding Stage Dropdown */}
            <div>
              <p className="text-black font-semibold">Funding Stage</p>
              <select className="p-2 border rounded text-black" value={fundingStage} onChange={(e) => setFundingStage(e.target.value)}>
                <option value="">Select Funding Stage</option>
                {fundingStages.length > 0 ? (
                    fundingStages.map((stage) => <option key={stage} value={stage}>{stage}</option>)
                ) : (
                    <option disabled>Loading...</option>
                )}
              </select>
            </div>

            {/* 🔹 Country Dropdown */}
            <div>
              <p className="text-black font-semibold">Country</p>
              <select className="p-2 border rounded text-black" value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select Country</option>
                {countries.length > 0 ? (
                    countries.map((city) => <option key={city} value={city}>{city}</option>)
                ) : (
                    <option disabled>Loading...</option>
                )}
              </select>
            </div>

            {/* 🔹 Search Button */}
            <button onClick={handleSearch} className="bg-primary p-2 rounded text-white font-bold">Search</button>
          </div>
        </div>

        {/* 🟢 Investors Table */}
        {investors.length > 0 ? (
            <div className="w-full max-w-5xl mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
              <table className="min-w-full text-black">
                <thead className="bg-primary text-white">
                <tr>
                  <th className="p-3">Investor</th>
                  <th className="p-3">Sector</th>
                  <th className="p-3">Funding Stage</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Investment Size</th>
                </tr>
                </thead>
                <tbody>
                {investors.map((inv) => (
                    <tr key={inv.id} className="border-b">
                      <td className="p-3">{inv.name}</td>
                      <td className="p-3">{inv.sector}</td>
                      <td className="p-3">{inv.funding_stage}</td>
                      <td className="p-3">{inv.country}</td>
                      <td className="p-3">{inv.investment_size}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        ) : (
            <p className="text-gray-300 mt-4">No investors found. Try another search.</p>
        )}
      </div>
  );
}
