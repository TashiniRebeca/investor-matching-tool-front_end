"use client";

import { useState, useEffect, useRef } from "react";

const API_URL = "http://localhost:5000";
import axios from "axios";
import { searchInvestors } from "@/lib/api";
import { words } from "@/lib/data";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Spotlight } from "@/components/Spotlight";
import {
  Select,
  SelectItem,
  Button,
  Input,
  Switch,
  RadioGroup,
  Radio,
} from "@heroui/react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "../public/custom-swiper.css";
import {
  DownloadTableExcel,
  // useDownloadExcel,
} from "react-export-table-to-excel";

type Investor = {
  id: number;
  name: string;
  sector: string;
  email: string;
  funding_stage: string;
  country: string;
  investment_min: string;
  investment_max: string;
  city?: string;
  prop_tech?: string;
  tech_medium?: string;
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
  const [cities, setCities] = useState<string[]>([]);
  const [seriesStages, setSeriesStages] = useState<string[]>([]);
  const [techMediums, setTechMediums] = useState<string[]>([]);
  const [propTechOptions, setPropTechOptions] = useState<string[]>([]);
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(
    null
  );

  const [activeTab, setActiveTab] = useState("manual"); // State for tabs
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<Investor[]>([]);
  const tableref = useRef(null);

  // Fetch dropdown options on load
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/investor-options`);

        if (response.data) {
          setSectors(response.data.sectors || []);
          setGeographies(response.data.geographies || []);
          setSeriesStages(response.data.seriesStages || []);
          setTechMediums(response.data.techMediums || []);
          setPropTechOptions(response.data.propTechOptions || []);
          setCities(response.data.cities || []);
        } else {
          console.warn("No data received for dropdowns.");
        }
      } catch (error) {
        console.error("Error fetching dropdown options:", error);
      }
    };

    fetchOptions();
  }, []);

  // Handle Search
  const handleSearch = async () => {
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

  const handleManualSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`${API_URL}/api/manual-search`, {
        params: { sector: searchQuery },
      });

      setResults(response.data);
    } catch (error) {
      console.error("❌ Error fetching search results:", error);
    }
  };

  // Function to export results
  // const exportResults = async () => {
  //   if (!searchQuery.trim()) {
  //     console.error(" No search query provided.");
  //     return;
  //   }

  //   try {
  //     const response = await axios.get(`${API_URL}/api/exportResults`, {
  //       params: { sector: searchQuery },
  //       responseType: "blob", // Ensures it is handled as a file
  //     });

  //     // Create a download link for the Excel file
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", "Investor_Results.xlsx");
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error("❌ Error exporting results:", error);
  //   }
  // };

  return (
    <div className="flex flex-col min-h-screen items-center  text-white p-6 px-4 md:px-6 lg:px-8">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Header */}
      <div className="text-center">
        <TypewriterEffectSmooth
          words={words}
          className="text-primary text-3xl md:text-5xl"
        />
        <p className="text-white text-sm md:text-lg">
          Find your perfect investor for your startup today...
        </p>
      </div>

      <div className="flex mt-10 gap-5">
        <Button
          onClick={() => setActiveTab("manual")}
          className={`text-xl forced-color-adjust-none ${
            activeTab === "manual"
              ? "border-b-2 border-b-primary-800 font-bold"
              : "text-gray-500"
          }`}
        >
          Manual Search
        </Button>
        <Button
          onClick={() => setActiveTab("filtered")}
          className={`text-xl ${
            activeTab === "filtered"
              ? "border-b-2 border-b-primary-800 font-bold"
              : "text-gray-500"
          }`}
        >
          Filtered Search
        </Button>
      </div>

      {/* Show Manual Search UI */}
      {activeTab === "manual" && (
        <div className="mt-28">
          {/* <h2 className="text-xl font-bold mb-4">Search Investors by Sector</h2> */}
          <div className="relative justify-center flex gap-5 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-primary-900"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>

            <input
              type="text"
              placeholder="Enter Sector (e.g. Fintech, AI, PropTech etc.)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleManualSearch()}
              className="border p-2 rounded text-primary w-[350px] placeholder:text-primary-800"
            />
            <button
              onClick={handleManualSearch}
              className="bg-primary-800 text-[20px] text-white py-1.5 rounded-full"
            >
              Search
            </button>
          </div>

          {results.length > 0 ? (
            <div className="mt-4">
              <DownloadTableExcel
                currentTableRef={tableref.current}
                filename="Investor_Results"
                sheet="Investors"
              >
                <button
                  // onClick={exportResults}
                  // onClick={onDowanload}
                  className="mt-8 mb-2 bg-accent-500 text-[20px] text-primary px-1.5 py-0.5 rounded"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 25"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                    />
                  </svg>
                  Export
                </button>
              </DownloadTableExcel>
              <table
                ref={tableref}
                className="border-collapse border border-gray-300 w-full"
              >
                <thead>
                  <tr className="bg-primary-800">
                    <th className="border p-2">Investor Name</th>
                    <th className="border p-2">Sector</th>
                    <th className="border p-2">Email</th>
                    <th className="border p-2">Series</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((investor, index) => (
                    <tr key={index}>
                      <td className="border p-2">{investor.name}</td>
                      <td className="border p-2">{investor.sector}</td>
                      <td className="border p-2">
                        <a
                          href={`mailto:${investor.email}`}
                          className="text-primary"
                        >
                          {investor.email}
                        </a>
                      </td>
                      <td className="border p-2">{investor.funding_stage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-300 text-center mt-4">
              No matching investors found.
            </p>
          )}
        </div>
      )}

      {/* Show Filtered Search UI */}
      {activeTab === "filtered" && (
        <div className="mt-4 w-full max-w-3xl text-center">
          {/* <h2 className="text-xl font-bold mb-4">Filtered Search</h2> */}
          <div className="p-6 mt-8 text-center bg-slate-300 shadow-lg rounded-lg w-full max-w-3xl">
            {/* Toggle - Normal / Advanced Search */}
            <div className="flex justify-between items-center">
              <p className="text-black font-semibold">Filtered Search</p>
              <Switch
                isSelected={isAdvanced}
                onChange={() => setIsAdvanced(!isAdvanced)}
              />
            </div>

            {/* Normal Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Select
                className="w-3/4"
                label="Sector"
                onChange={(e) => setSector(e.target.value)}
                // isRequired={true}
              >
                {sectors.map((sec) => (
                  <SelectItem key={sec} value={sec}>
                    {sec}
                  </SelectItem>
                ))}
              </Select>

              <Select
                className="w-3/4"
                label="Country"
                onChange={(e) => setGeography(e.target.value)}
              >
                {geographies.map((geo) => (
                  <SelectItem key={geo} value={geo}>
                    {geo}
                  </SelectItem>
                ))}
              </Select>

              <Input
                className="w-3/4"
                type="number"
                placeholder="Investment Min"
                onChange={(e) => setInvestmentMin(e.target.value)}
                height={50}
              />
              <Input
                className="w-3/4"
                type="number"
                placeholder="Investment Max"
                onChange={(e) => setInvestmentMax(e.target.value)}
                height={50}
              />

              <Select
                className="w-3/4"
                label="Series"
                onChange={(e) => setSeries(e.target.value)}
              >
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
                <Select
                  className="w-[37%]"
                  label="City"
                  onChange={(e) => setCity(e.target.value)}
                >
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </Select>
                <div className="w-[47%] gap-2 flex flex-row text-left -mt-3">
                  <RadioGroup
                    label="Prop-Tech Only?"
                    orientation="horizontal"
                    className="text-slate-700 text-sm font-medium mt-3"
                  >
                    <div className="flex flex-row items-center gap-5">
                      <label className="flex items-center gap-2">
                        <Radio
                          value="Yes"
                          checked={propTech === "Yes"}
                          onChange={(e) => setPropTech(e.target.value)}
                          className=" h-4 text-primary-150 focus:ring-primary-50"
                        />
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <Radio
                          value="No"
                          checked={propTech === "No"}
                          onChange={(e) => setPropTech(e.target.value)}
                          className="h-4 text-primary-150 focus:ring-primary-50"
                        />
                        No
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                <Select
                  className="w-[37%]"
                  label="Tech Medium"
                  onChange={(e) => setTechMedium(e.target.value)}
                >
                  {techMediums.map((medium) => (
                    <SelectItem key={medium} value={medium}>
                      {medium}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-primary p-2 mt-6 rounded-full text-white font-bold"
            >
              Search
            </Button>
          </div>

          <div className="w-[1500px] max-w-7xl ml-0 pt-5 pr-30 pl-30 text-left">
            {investors.length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={20}
                effect="slide"
                slidesPerView={3}
                navigation
                centeredSlides={false}
                initialSlide={0}
                pagination={{ clickable: true }}
                breakpoints={{
                  1280: { slidesPerView: 3 },
                  1024: { slidesPerView: 2 },
                  768: { slidesPerView: 1 },
                }}
                className="w-full h-full justify-start"
              >
                {investors.map((investor, index) => (
                  <SwiperSlide key={index} className="flex justify-start">
                    <div className="w-[1000px] md:w-[350px] lg:w-[400px] bg-white rounded-lg p-6 transition-transform transform hover:scale-105 hover:bg-[#a8b6c2]">
                      <h3 className="text-3xl text-primary font-semibold">
                        {investor.name}
                      </h3>
                      <p className="text-base text-gray-600">{investor.city}</p>
                      <p className="mt-2 text-xl text-gray-800">
                        Sector: {investor.sector}
                      </p>
                      <p className="mt-2 text-xl text-gray-800">
                        Series: {investor.funding_stage}
                      </p>
                      <p className="text-xl text-gray-800">
                        Investment Range: ${investor.investment_min} - $
                        {investor.investment_max}
                      </p>
                      <Button
                        onClick={() => setSelectedInvestor(investor)}
                        className="bg-primary p-2 mt-6 rounded text-white font-bold"
                      >
                        Get Details
                      </Button>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <p className="justify-center items-center text-gray-300 mt-10">
                No investors found. Try another search.
              </p>
            )}
          </div>

          {/* Popup Modal */}
          {selectedInvestor && (
            <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                <h2 className="text-xl font-semibold">
                  {selectedInvestor.name}
                </h2>
                <p className="text-gray-600">{selectedInvestor.city}</p>
                <p className="mt-2 text-medium text-gray-800">
                  Email:
                  <a
                    href={`mailto:${selectedInvestor.email}`}
                    className="hover:underline"
                  >
                    {selectedInvestor.email}
                  </a>
                </p>

                {selectedInvestor.video_link &&
                  (() => {
                    let videoUrl = "#"; // Default in case of errors
                    try {
                      const parsedLink = JSON.parse(
                        selectedInvestor.video_link
                      );
                      videoUrl = parsedLink.hyperlink || parsedLink.text;
                    } catch (error) {
                      console.error("Error parsing video link:", error);
                    }
                    return (
                      <div className="flex justify-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-6 mt-2.5 text-primary-700 "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                          />
                        </svg>

                        <a
                          href={videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-700 font-bold text-[19px] hover:underline mt-2 block"
                        >
                          Watch Video
                        </a>
                      </div>
                    );
                  })()}

                {/* Close Button */}
                <Button
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedInvestor(null)}
                >
                  ❌
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search Section */}
    </div>
  );
}
