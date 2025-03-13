"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { searchInvestors, fetchInvestorOptions } from "@/lib/api";
import { words } from "@/lib/data";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { Spotlight } from "@/components/ui/Spotlight";
import { motion } from "framer-motion";
import {
  Select,
  SelectItem,
  Button,
  Input,
  Switch,
  RadioGroup,
  Radio,
  Tooltip,
} from "@heroui/react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "../public/custom-swiper.css";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import * as XLSX from "xlsx";

type Investor = {
  id: number;
  name: string;
  sector: string;
  email?: string;
  funding_stage: string;
  country: string;
  investment_min: string;
  investment_max: string;
  city?: string;
  prop_tech?: string;
  tech_medium?: string;
  video_link: string;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const Background = () => {
  return (
    <motion.svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute inset-0 z-0 blur-sm"
      variants={{
        hover: {
          scale: 1.1,
        },
      }}
      transition={{
        duration: 1,
        ease: "backInOut",
      }}
    >
      <motion.circle
        variants={{
          hover: {
            scaleY: 0.5,
            y: -25,
          },
        }}
        transition={{
          duration: 1,
          ease: "backInOut",
          delay: 0.2,
        }}
        cx="199.5"
        cy="141.5"
        r="112.5"
        fill="#9ab0c3"
      />
      <motion.ellipse
        variants={{
          hover: {
            scaleY: 2.25,
            y: -25,
          },
        }}
        transition={{
          duration: 1,
          ease: "backInOut",
          delay: 0.2,
        }}
        cx="199.5"
        cy="327"
        rx="112.5"
        ry="52"
        fill="#9ab0c3"
      />
    </motion.svg>
  );
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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "var(--primary-color) !important",
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },

    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  // Fetch dropdown options on load
  // useEffect(() => {
  //   const fetchOptions = async () => {
  //     try {
  //       const response = await axios.get(`${API_URL}/api/investor-options`);

  //       if (response.data) {
  //         setSectors(response.data.sectors || []);
  //         setGeographies(response.data.geographies || []);
  //         setSeriesStages(response.data.seriesStages || []);
  //         setTechMediums(response.data.techMediums || []);
  //         setPropTechOptions(response.data.propTechOptions || []);
  //         setCities(response.data.cities || []);
  //       } else {
  //         console.warn("No data received for dropdowns.");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching dropdown options:", error);
  //     }
  //   };

  //   fetchOptions();
  // }, []);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const data = await fetchInvestorOptions(); // Use the new function
        if (data) {
          setSectors(data.sectors || []);
          setGeographies(data.geographies || []);
          setSeriesStages(data.seriesStages || []);
          setTechMediums(data.techMediums || []);
          setPropTechOptions(data.propTechOptions || []);
          setCities(data.cities || []);
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
      console.error("Error fetching search results:", error);
    }
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const exportToExcel = () => {
    const filteredInvestorDetails = results.map((investor) => ({
      Name: investor.name,
      Sector: investor.sector,
      Email: investor.email,
      Investment_Range: `${investor.investment_min} - ${investor.investment_max}`,
      City: investor.city,
    }));

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredInvestorDetails);
    XLSX.utils.book_append_sheet(wb, ws, "Investors");
    XLSX.writeFile(wb, "Investor_Results.xlsx");
  };

  const clearManualSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  const clearFilteredSearch = () => {
    setSector("");
    setGeography("");
    setInvestmentMin("");
    setInvestmentMax("");
    setSeries("");
    setCity("");
    setPropTech("");
    setTechMedium("");
    setIsAdvanced(false);
    setInvestors([]);
  };

  return (
    <div className="flex flex-col min-h-screen items-center text-white p-6 px-4 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />

      {/* Header */}
      <div className="text-center px-4 py-6 md:py-8 max-w-full overflow-hidden">
        <TypewriterEffectSmooth
          words={words}
          className="text-primary text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl"
        />
        <p className="text-white text-sm md:text-lg mt-2">
          Find your perfect investor for your startup today...
        </p>
      </div>

      <Box
        sx={{
          width: "100%",
          marginTop: { xs: "30px", sm: "40px", md: "55px" },
        }}
      >
        <TabContext value={activeTab}>
          <Box>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              centered
              sx={{
                "& .MuiTab-root": {
                  color: "var(--primary-color)",
                  fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
                  padding: { xs: "8px 12px", sm: "12px 16px" },
                },
                "& .Mui-selected": {
                  color: "white !important",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "var(--primary-color)",
                },
              }}
            >
              <Tab label="Manual" value="manual" />
              <Tab label="Filtered" value="filtered" />
            </TabList>
          </Box>
          <TabPanel
            value="manual"
            sx={{ padding: { xs: "16px 0", sm: "24px 16px" } }}
          >
            {/* Show Manual Search UI */}
            {activeTab === "manual" && (
              <div className="mt-8 sm:mt-16 md:mt-20">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
                  <div className="relative flex max-w-md items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="absolute left-3 size-6 text-primary-900"
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
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleManualSearch()
                      }
                      className="border border-primary pl-10 p-2 rounded text-primary w-[350px] placeholder:text-primary-800"
                    />
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button
                      onClick={handleManualSearch}
                      className="bg-primary-800 font-bold text-white py-2 px-4 rounded-full"
                    >
                      Search
                    </Button>
                    <Button
                      onClick={clearManualSearch}
                      className="bg-red-500 font-bold text-white py-1.5 px-3 rounded-full ml-1"
                    >
                      Clear
                    </Button>
                  </div>
                </div>

                {results.length > 0 ? (
                  <div className="mt-4 overflow-x-auto">
                    <Button
                      onClick={exportToExcel}
                      className="mt-6 mb-3 bg-accent-500 p-2 font-bold text-primary px-4 py-1.5 rounded flex items-center gap-2"
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
                    </Button>
                    <div className="overflow-x-auto pb-2">
                      <TableContainer
                        component={Paper}
                        sx={{
                          maxHeight: { xs: 500, sm: 600 },
                          overflowY: "auto",
                          "&::-webkit-scrollbar": {
                            width: "8px",
                            height: "8px",
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "rgba(154, 176, 195, 0.5)",
                            borderRadius: "4px",
                          },
                        }}
                      >
                        <Table
                          sx={{ minWidth: { xs: 600, sm: 700 } }}
                          aria-label="customized table"
                          stickyHeader
                          className="border-collapse border w-full"
                        >
                          <TableHead
                            style={{
                              backgroundColor: "bg-primary-800",
                              color: "white",
                            }}
                          >
                            <TableRow>
                              <StyledTableCell className="bg-primary-700">
                                Investor Name
                              </StyledTableCell>
                              <StyledTableCell
                                className="bg-primary-700"
                                align="left"
                              >
                                City
                              </StyledTableCell>
                              <StyledTableCell
                                className="bg-primary-700"
                                align="left"
                              >
                                Sector
                              </StyledTableCell>
                              <StyledTableCell
                                className="bg-primary-700"
                                align="left"
                              >
                                Email
                              </StyledTableCell>
                              <StyledTableCell
                                className="bg-primary-700"
                                align="left"
                              >
                                Series
                              </StyledTableCell>
                              <StyledTableCell
                                className="bg-primary-700"
                                align="left"
                              >
                                Investment Range(Min-Max)
                              </StyledTableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {results.map((row, index) => (
                              <StyledTableRow
                                key={index}
                                sx={{ cursor: "pointer" }}
                              >
                                <StyledTableCell component="th" scope="row">
                                  {row.name}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.city}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.sector}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  <a
                                    href={`mailto:${row.email}`}
                                    className="text-primary hover:underline"
                                  >
                                    {row.email}
                                  </a>
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  {row.funding_stage}
                                </StyledTableCell>
                                <StyledTableCell align="left">
                                  ${row.investment_min} - ${row.investment_max}
                                </StyledTableCell>
                              </StyledTableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-300 text-center mt-8">
                    No matching investors found.
                  </p>
                )}
              </div>
            )}
          </TabPanel>
          <TabPanel
            value="filtered"
            sx={{ padding: { xs: "16px 0", sm: "24px 16px" } }}
          >
            {/* Show Filtered Search UI */}
            {activeTab === "filtered" && (
              <div className="flex justify-center items-center w-full mx-auto">
                <div className="mt-2 w-full max-w-3xl justify-end items-center">
                  <div className="p-4 sm:p-6 mt-2 sm:mt-8 justify-center items-center text-center bg-slate-300 shadow-lg rounded-lg w-full max-w-3xl">
                    {/* Toggle - Normal / Advanced Search */}
                    <div className="flex justify-between items-center">
                      <p className="text-black font-semibold text-sm sm:text-base">
                        Filtered Search
                      </p>
                      <Tooltip
                        content="Advanced Search"
                        color="primary"
                        showArrow={true}
                      >
                        <Switch
                          isSelected={isAdvanced}
                          onChange={() => setIsAdvanced(!isAdvanced)}
                          size="md"
                        />
                      </Tooltip>
                    </div>

                    {/* Normal Search */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      <Select
                        className="w-3/4"
                        label="Sector"
                        variant="underlined"
                        onChange={(e) => setSector(e.target.value)}
                        popoverProps={{
                          placement: "bottom",
                          offset: 10,
                          shouldFlip: true,
                          isOpen: true,
                        }}
                        listboxProps={{ itemType: "200px" }}
                      >
                        {sectors.map((sec) => (
                          <SelectItem key={sec} textValue={sec}>
                            {sec}
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                        className="w-3/4"
                        label="Country"
                        variant="underlined"
                        onChange={(e) => setGeography(e.target.value)}
                      >
                        {geographies.map((geo) => (
                          <SelectItem key={geo} textValue={geo}>
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
                        variant="underlined"
                      />
                      <Input
                        className="w-3/4"
                        type="number"
                        placeholder="Investment Max"
                        onChange={(e) => setInvestmentMax(e.target.value)}
                        height={50}
                        variant="underlined"
                      />

                      <Select
                        className="w-[37%] sm:col-span-2"
                        label="Series"
                        variant="underlined"
                        onChange={(e) => setSeries(e.target.value)}
                      >
                        {seriesStages.map((stage) => (
                          <SelectItem key={stage} textValue={stage}>
                            {stage}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Advanced Search */}
                    {isAdvanced && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        <Select
                          className="w-3/4"
                          label="City"
                          variant="underlined"
                          onChange={(e) => setCity(e.target.value)}
                        >
                          {cities.map((city) => (
                            <SelectItem key={city} textValue={city}>
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
                          className="w-[37%] sm:col-span-2"
                          label="Tech Medium"
                          variant="underlined"
                          onChange={(e) => setTechMedium(e.target.value)}
                        >
                          {techMediums.map((medium) => (
                            <SelectItem key={medium} textValue={medium}>
                              {medium}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    )}

                    {/* Search Button */}
                    <div className="flex flex-wrap justify-center gap-2 mt-6">
                      <Button
                        onClick={handleSearch}
                        className="bg-primary-800 px-4 py-2 rounded-full text-white font-bold"
                      >
                        Search
                      </Button>
                      <Button
                        onClick={clearFilteredSearch}
                        className="bg-red-500 text-white px-4 py-2 rounded-full font-bold"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>

                  <motion.div className="w-[2500px] h-[460px] max-w-7xl ml-0 pt-5 pr-30 pl-30 text-left">
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
                          640: { slidesPerView: 1 },
                          768: { slidesPerView: 2 },
                          1024: { slidesPerView: 3 },
                        }}
                        className="w-full h-full justify-start py-6"
                      >
                        {investors.map((investor, index) => (
                          <SwiperSlide
                            key={index}
                            className="flex justify-start"
                          >
                            <motion.div
                              whileHover="hover"
                              transition={{
                                duration: 1,
                                ease: "backInOut",
                              }}
                              variants={{
                                hover: {
                                  scale: 1.05,
                                },
                              }}
                              className="relative flex flex-col justify-between h-[420px] md:w-[350px] lg:w-[400px] shrink-0 overflow-hidden bg-white rounded-lg p-5 z-10 shadow-md"
                            >
                              <Background />
                              <motion.h3 className="text-2xl md:text-3xl text-primary font-semibold z-20 mb-1">
                                {investor.name}
                              </motion.h3>
                              <motion.p className="text-sm md:text-base text-gray-600 z-20">
                                {investor.city}
                              </motion.p>
                              <motion.div className="mt-4 space-y-2 z-20">
                                <motion.p className="mt-2 text-lg md:text-xl text-gray-800 z-20">
                                  Sector: {investor.sector}
                                </motion.p>
                                <motion.p className="mt-2 text-lg md:text-xl text-gray-800 z-20">
                                  Series: {investor.funding_stage}
                                </motion.p>
                                <motion.p className="text-lg md:text-xl text-gray-800 z-20">
                                  Investment Range: ${investor.investment_min} -
                                  ${investor.investment_max}
                                </motion.p>
                              </motion.div>
                              <Button
                                onClick={() => setSelectedInvestor(investor)}
                                className="z-20 py-2 text-center backdrop-blur bg-primary-800 mt-6 rounded text-white font-bold w-full"
                              >
                                Get Details
                              </Button>
                            </motion.div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    ) : (
                      <motion.p className="justify-center items-center text-gray-300 py-8">
                        No investors found. Try another search.
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Popup Modal */}
                  {selectedInvestor && (
                    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-70 z-50 p-4 sm:p-6 md:p-8 overflow-y-auto">
                      <div className="bg-white dark:bg-gray-800 rounded-xl w-[20%] p-5 shadow-2xl max-w-sm sm:max-w-md md:max-w-lg relative transform transition-all mx-auto animate-fadeIn">
                        <h2 className="text-2xl font-semibold text-primary-800">
                          {selectedInvestor.name}
                        </h2>
                        <p className="text-base text-primary-700 mb-4">
                          {selectedInvestor.city}
                        </p>
                        {/* <div className="space-y-4"> */}
                        <div className="flex items-start gap-3">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5 text-primary-700 dark:text-primary-400 mt-0.5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                            />
                          </svg>
                          <div className="flex-1">
                            <p className="text-base font-bold text-primary-800 dark:text-gray-400 mb-1">
                              <a
                                href={`mailto:${selectedInvestor.email}`}
                                className="text-primary-700 hover:underline break-all"
                              >
                                {selectedInvestor.email}
                              </a>
                            </p>
                          </div>
                        </div>

                        {selectedInvestor.video_link &&
                          (() => {
                            let videoUrl = "#"; // Default in case of errors
                            try {
                              const parsedLink = JSON.parse(
                                selectedInvestor.video_link
                              );
                              videoUrl =
                                parsedLink.hyperlink || parsedLink.text;
                            } catch (error) {
                              console.error("Error parsing video link:", error);
                            }
                            return (
                              <div className="flex">
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
                          className="absolute top-2 right-2 px-4 py-3 sm:px-6 justify-end"
                          onClick={() => setSelectedInvestor(null)}
                        >
                          ❌
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}
