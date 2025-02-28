// "use client";

// import { useState, useEffect, SetStateAction } from "react";
// import axios from "axios";
// import { searchInvestors } from "@/lib/api";
// import { words } from "@/lib/data";
// import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
// import { Spotlight } from "@/components/Spotlight";
// import { Select, SelectItem, Button } from "@heroui/react";

// type Investor = {
//   id: number;
//   name: string;
//   sector: string;
//   funding_stage: string;
//   country: string;
//   investment_size: string;
// };

// export default function Home() {
//   const [sector, setSector] = useState("");
//   const [fundingStage, setFundingStage] = useState("");
//   const [country, setCountry] = useState("");
//   const [investors, setInvestors] = useState<Investor[]>([]);
//   const [sectors, setSectors] = useState<string[]>([]);
//   const [fundingStages, setFundingStages] = useState<string[]>([]);
//   const [countries, setCountries] = useState<string[]>([]);

//   // Fetch dropdown options on load
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const response = await axios.get(
//           "http://localhost:5000/api/investor-options"
//         );
//         console.log("✅ Dropdown Data:", response.data); // Debugging step

//         if (response.data) {
//           setSectors(response.data.sectors || []);
//           setFundingStages(response.data.fundingStages || []);
//           setCountries(response.data.countries || []);
//         } else {
//           console.warn("⚠️ No data received for dropdowns.");
//         }
//       } catch (error) {
//         console.error("❌ Error fetching dropdown options:", error);
//       }
//     };

//     fetchOptions();
//   }, []);

//   const handleSearch = async () => {
//     console.log("🔍 Searching investors for:", {
//       sector,
//       fundingStage,
//       country,
//     });
//     const data = await searchInvestors(sector, fundingStage, country);

//     setInvestors(data);
//   };

//   return (
//     <div className="relative min-h-screen flex flex-col items-center text-white p-6">
//       <Spotlight
//         className="-top-40 left-0 md:left-60 md:-top-20"
//         fill="white"
//       />

//       {/* 🔥 Header */}
//       <div className="text-center">
//         <TypewriterEffectSmooth
//           words={words}
//           className="text-primary text-5xl"
//         />
//         <p className="text-white">
//           Find your perfect investor for your startup today...
//         </p>
//       </div>

//       {/* 🟢 Search Section */}
//       <div className="relative z-10 p-6 mt-8 text-center bg-slate-300 shadow-lg rounded-lg w-full max-w-3xl">
//         <div className="flex flex-wrap gap-6 justify-between">
//           {/* 🔹 Sector Dropdown */}
//           <div className="w-full md:w-1/3">
//             <p className="text-black font-semibold text-lg">Sector</p>
//             <Select
//               className="p-2 text-lg w-full text-black font-semibold"
//               label="Select a Sector"
//               variant="underlined"
//               onChange={(e: { target: { value: SetStateAction<string> } }) =>
//                 setSector(e.target.value)
//               }
//             >
//               <SelectItem value="">Select Sector</SelectItem>
//               {sectors.map((sec) => (
//                 <SelectItem key={sec} value={sec} className="text-lg">
//                   {sec}
//                 </SelectItem>
//               ))}
//             </Select>
//           </div>

//           {/* 🔹 Funding Stage Dropdown */}
//           <div className="w-full md:w-1/3">
//             <p className="text-black font-semibold text-lg">Funding Stage</p>
//             <Select
//               className="p-2 text-lg w-full text-black font-semibold"
//               label="Select a Funding Stage"
//               variant="underlined"
//               onChange={(e: { target: { value: SetStateAction<string> } }) =>
//                 setFundingStage(e.target.value)
//               }
//             >
//               <SelectItem value="">Select Funding Stage</SelectItem>
//               {fundingStages.map((stage) => (
//                 <SelectItem key={stage} value={stage} className="text-lg">
//                   {stage}
//                 </SelectItem>
//               ))}
//             </Select>
//           </div>

//           {/* 🔹 Country Dropdown */}
//           <div className="w-full md:w-1/4">
//             <p className="text-black font-semibold text-lg">Country</p>
//             <Select
//               className="p-2 text-lg w-full text-black font-semibold"
//               label="Select a Country"
//               variant="underlined"
//               onChange={(e: { target: { value: SetStateAction<string> } }) =>
//                 setCountry(e.target.value)
//               }
//             >
//               <SelectItem value="">Select Country</SelectItem>
//               {countries.map((city) => (
//                 <SelectItem key={city} value={city} className="text-lg">
//                   {city}
//                 </SelectItem>
//               ))}
//             </Select>
//           </div>
//         </div>

//         {/* 🔹 Search Button */}
//         <Button
//           onClick={handleSearch}
//           radius="full"
//           className="bg-primary p-2 mt-6 rounded text-white font-bold"
//         >
//           Search
//         </Button>
//       </div>

//       {/* 🟢 Investors Table - Fixed Layout */}
//       {investors.length > 0 && (
//         <div className="mt-8 w-full max-w-5xl bg-white shadow-lg rounded-lg overflow-hidden">
//           <div className="max-h-[400px] overflow-y-auto">
//             <table className="min-w-full text-black">
//               <thead className="bg-primary text-white sticky top-0">
//                 <tr>
//                   <th className="p-3">Investor</th>
//                   <th className="p-3">Sector</th>
//                   <th className="p-3">Funding Stage</th>
//                   <th className="p-3">Country</th>
//                   <th className="p-3">Investment Size</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {investors.map((inv) => (
//                   <tr key={inv.id} className="border-b">
//                     <td className="p-3">{inv.name}</td>
//                     <td className="p-3">{inv.sector}</td>
//                     <td className="p-3">{inv.funding_stage}</td>
//                     <td className="p-3">{inv.country}</td>
//                     <td className="p-3">{inv.investment_size}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {/* No investors found message */}
//       {investors.length === 0 && (
//         <p className="text-gray-300 mt-10">
//           No investors found. Try another search.
//         </p>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, SetStateAction } from "react";
import axios from "axios";
import { searchInvestors } from "@/lib/api";
import { words } from "@/lib/data";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Spotlight } from "@/components/Spotlight";
import { Select, SelectItem, Button, Input, Switch } from "@heroui/react";

type Investor = {
  id: number;
  name: string;
  sector: string;
  funding_stage: string;
  country: string;
  investment_min: string;
  investment_max: string;
  video_link: string;
};

export default function Home() {
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [sector, setSector] = useState("");
  const [geography, setGeography] = useState("");
  const [investmentMin, setInvestmentMin] = useState("");
  const [investmentMax, setInvestmentMax] = useState("");
  const [series, setSeries] = useState("");
  const [city, setCity] = useState("");
  const [propTech, setPropTech] = useState("");
  const [techMedium, setTechMedium] = useState("");
  const [investors, setInvestors] = useState<Investor[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [geographies, setGeographies] = useState<string[]>([]);
  const [seriesStages, setSeriesStages] = useState<string[]>([]);

  // Fetch dropdown options on load
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/investor-options"
        );
        console.log("✅ Dropdown Data:", response.data);

        if (response.data) {
          setSectors(response.data.sectors || []);
          setGeographies(response.data.geographies || []);
          setSeriesStages(response.data.seriesStages || []);
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
    console.log("🔍 Searching investors...");
    const data = await searchInvestors({
      sector,
      geography,
      investmentMin,
      investmentMax,
      series,
      city,
      propTech,
      techMedium,
      isAdvanced,
    });
    setInvestors(data);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center text-white p-6">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* 🔥 Header */}
      <div className="text-center">
        <TypewriterEffectSmooth
          words={words}
          className="text-primary text-5xl"
        />
        <p className="text-white">
          Find your perfect investor for your startup today...
        </p>
      </div>

      {/* 🟢 Search Section */}
      <div className="relative z-10 p-6 mt-8 text-center bg-slate-300 shadow-lg rounded-lg w-full max-w-3xl">
        {/* Toggle Normal / Advanced Search */}
        <div className="flex justify-between items-center">
          <p className="text-black font-semibold">Advanced Search</p>
          <Switch
            isSelected={isAdvanced}
            onChange={() => setIsAdvanced(!isAdvanced)}
          />
        </div>

        {/* Normal Search */}
        <div className="flex flex-wrap gap-4 justify-between mt-4">
          <Select
            className="w-1/2"
            label="Sector"
            onChange={(e) => setSector(e.target.value)}
          >
            <SelectItem value="">Select Sector</SelectItem>
            {sectors.map((sec) => (
              <SelectItem key={sec} value={sec}>
                {sec}
              </SelectItem>
            ))}
          </Select>

          <Select
            className="w-1/2"
            label="Geography"
            onChange={(e) => setGeography(e.target.value)}
          >
            <SelectItem value="">Select Geography</SelectItem>
            {geographies.map((geo) => (
              <SelectItem key={geo} value={geo}>
                {geo}
              </SelectItem>
            ))}
          </Select>

          <Input
            className="w-1/2"
            type="number"
            placeholder="Investment Min"
            onChange={(e) => setInvestmentMin(e.target.value)}
          />
          <Input
            className="w-1/2"
            type="number"
            placeholder="Investment Max"
            onChange={(e) => setInvestmentMax(e.target.value)}
          />

          <Select
            className="w-full"
            label="Series"
            onChange={(e) => setSeries(e.target.value)}
          >
            <SelectItem value="">Select Series</SelectItem>
            {seriesStages.map((stage) => (
              <SelectItem key={stage} value={stage}>
                {stage}
              </SelectItem>
            ))}
          </Select>
        </div>

        {/* Advanced Search */}
        {isAdvanced && (
          <div className="flex flex-wrap gap-4 justify-between mt-4">
            <Input
              className="w-1/2"
              placeholder="City"
              onChange={(e) => setCity(e.target.value)}
            />
            <Select
              className="w-1/2"
              label="Prop-Tech Only?"
              onChange={(e) => setPropTech(e.target.value)}
            >
              <SelectItem value="Yes">Yes</SelectItem>
              <SelectItem value="No">No</SelectItem>
            </Select>
            <Input
              className="w-full"
              placeholder="Tech Medium"
              onChange={(e) => setTechMedium(e.target.value)}
            />
          </div>
        )}

        {/* Search Button */}
        <Button
          onClick={handleSearch}
          className="bg-primary p-2 mt-6 rounded text-white font-bold"
        >
          Search
        </Button>
      </div>

      {/* 🟢 Investor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {investors.map((inv) => (
          <div
            key={inv.id}
            className="bg-white text-black rounded-lg shadow-lg p-4 hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-bold">{inv.name}</h3>
            <p>
              <strong>Sector:</strong> {inv.sector}
            </p>
            <p>
              <strong>Stage:</strong> {inv.funding_stage}
            </p>
            <p>
              <strong>Geography:</strong> {inv.country}
            </p>
            <p>
              <strong>Investment:</strong> ${inv.investment_min} - $
              {inv.investment_max}
            </p>
            <a
              href={inv.video_link}
              target="_blank"
              className="text-blue-500 mt-2 inline-block"
            >
              Watch Video
            </a>
          </div>
        ))}
      </div>
      {/* No investors found message */}
      {investors.length === 0 && (
        <p className="text-gray-300 mt-10">
          No investors found. Try another search.
        </p>
      )}
    </div>
  );
}
