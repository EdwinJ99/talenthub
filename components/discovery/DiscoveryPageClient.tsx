"use client";

import { useState, useRef, useEffect } from "react";
import { showAlertValidationError, showAlertSuccess } from "@/lib/alert"; // Sesuaikan path alias projekmu

const SortIcon = () => <span className="text-gray-400 text-xs ml-1">⇅</span>;

// Tipe data
type Creator = {
  no: number;
  name: string;
  username: string;
  followers: string;
  post: string;
  er: string;
  avrView: string;
  avrBrand: string;
  cpvAll: string;
  cpvBranded: string;
};

// MOCK_DATA yang akan dipanggil setelah Apply Filter
const MOCK_DATA: Creator[] = [
  { no: 1, name: "ariefmuh", username: "@arief", followers: "5.6m", post: "6.600", er: "5.6m", avrView: "6.600", avrBrand: "150K", cpvAll: "150", cpvBranded: "-" },
  { no: 2, name: "William Tanuwijaya", username: "@williamtanu", followers: "3.1M+", post: "100", er: "3.1%", avrView: "150K", avrBrand: "150K", cpvAll: "150", cpvBranded: "-" },
  { no: 3, name: "Raymond Chin", username: "@raymondchins", followers: "2.3M+", post: "90", er: "4.5%", avrView: "250K", avrBrand: "250K", cpvAll: "250", cpvBranded: "-" },
  { no: 4, name: "Andrew Darwis", username: "@adarwis", followers: "550K+", post: "120", er: "2.3%", avrView: "70K", avrBrand: "70K", cpvAll: "70", cpvBranded: "-" },
  { no: 5, name: "Fadil Jaidi", username: "@fadiljaidi", followers: "12.5M+", post: "200", er: "1.6%", avrView: "350K", avrBrand: "350K", cpvAll: "350", cpvBranded: "-" },
  { no: 6, name: "Merry Riana", username: "@merryriana", followers: "4.6M+", post: "320", er: "2.8%", avrView: "500K", avrBrand: "500K", cpvAll: "500", cpvBranded: "-" },
];

const INITIAL_FILTERS = [
  { id: "socialMedia", label: "Social Media", options: ["Instagram", "TikTok", "YouTube", "Twitter/X"] },
  { id: "tier", label: "Tier", options: ["Nano (1K - 10K)", "Micro (10K - 100K)", "Macro (100K - 1M)", "Mega (1M+)"] },
  { id: "category", label: "Category", options: ["Beauty & Fashion", "Tech & Gadgets", "Food & Beverage", "Gaming"] },
  { id: "city", label: "City", options: ["Jakarta", "Bandung", "Surabaya", "Medan"] },
  { id: "gender", label: "Gender", options: ["Male", "Female"] }
];

const BRAND_OPTIONS = ["Samsung", "Gojek", "Tokopedia", "Unilever", "Indofood"];

export default function CreatorDiscoveryPage() {
  // --- STATES MAIN PAGE ---
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dynamicFilters, setDynamicFilters] = useState(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(5);
  const [isFiltered, setIsFiltered] = useState(false);

  // State dropdown filter utama
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- STATES MODAL ADD PROJECT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [isBrandDropdownOpen, setIsBrandDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Simulasi penampung database trs_project
  const [trsProject, setTrsProject] = useState<any[]>([]);

  // Menutup dropdown otomatis jika klik di luar komponen
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- LOGIC FILTER ---
  const handleSelectOption = (id: string, value: string) => {
    setFilters((prev) => ({ ...prev, [id]: value }));
    setOpenDropdownId(null);
  };

  const handleAddCustomOption = (id: string) => {
    const customValue = otherInputs[id]?.trim();
    if (!customValue) return;

    setDynamicFilters((prevFilters) =>
      prevFilters.map((f) => {
        if (f.id === id && !f.options.includes(customValue)) {
          return { ...f, options: [...f.options, customValue] };
        }
        return f;
      })
    );
    setFilters((prev) => ({ ...prev, [id]: customValue }));
    setOtherInputs((prev) => ({ ...prev, [id]: "" }));
  };

  const clearFilters = () => {
    setFilters({});
    setOtherInputs({});
    setIsFiltered(false);
    setSelectedRows([]);
  };

  const handleApplyFilter = () => {
    setIsFiltered(true);
    setCurrentPage(1);
  };

  // --- LOGIC CHECKBOX & PAGINATION ---
  const toggleSelect = (no: number) => {
    setSelectedRows((prev) =>
      prev.includes(no) ? prev.filter((id) => id !== no) : [...prev, no]
    );
  };

  const totalEntries = isFiltered ? MOCK_DATA.length : 0;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startIndex = (currentPage - 1) * entriesPerPage;
  const endIndex = Math.min(startIndex + entriesPerPage, totalEntries);
  const currentData = isFiltered ? MOCK_DATA.slice(startIndex, endIndex) : [];

  const toggleSelectAll = () => {
    const currentPageIds = currentData.map((item) => item.no);
    const isAllCurrentSelected = currentPageIds.every((id) => selectedRows.includes(id));

    if (isAllCurrentSelected) {
      setSelectedRows((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const newSelections = currentPageIds.filter((id) => !selectedRows.includes(id));
      setSelectedRows((prev) => [...prev, ...newSelections]);
    }
  };

  // --- LOGIC SUBMIT MODAL PROJECT ---
  const handleOpenModal = () => {
    // Validasi: Jika tidak ada data KOL/Creator yang di-checklist
    if (selectedRows.length === 0) {
      showAlertValidationError("Please Select Min 1 KOL");
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProjectName("");
    setSelectedBrand("");
    setStartDate("");
    setEndDate("");
    setIsBrandDropdownOpen(false);
  };

  const handleSubmitProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !selectedBrand || !startDate || !endDate) {
      alert("Please fill all project details!");
      return;
    }

    const newProject = {
      id: Date.now(),
      projectName,
      brand: selectedBrand,
      startDate,
      endDate,
      creatorIds: [...selectedRows]
    };

    setTrsProject((prev) => [...prev, newProject]);
    
    // Memakai SweetAlert2 untuk status sukses simpan data sementara
    showAlertSuccess(`Project "${projectName}" successfully added to trs_project!`);
    
    setIsModalOpen(false);
    setProjectName("");
    setSelectedBrand("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <section className="p-6 bg-slate-50 min-h-screen relative">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Discovery</h1>
        <p className="text-sm text-slate-500">Discover the right creators for your campaigns</p>
      </div>

      <div className="grid grid-cols-[300px_1fr] gap-6 items-start">
        {/* Sidebar Filter */}
        <div ref={dropdownRef} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="font-bold mb-4">Filter</h2>
          <div className="space-y-4">
            {dynamicFilters.map((filter) => (
              <div key={filter.id} className="relative">
                <label className="block text-sm font-medium mb-1 text-slate-700">{filter.label}</label>
                
                <div
                  onClick={() => setOpenDropdownId(openDropdownId === filter.id ? null : filter.id)}
                  className={`w-full h-10 border rounded-lg px-3 flex items-center justify-between text-sm cursor-pointer transition-colors ${
                    openDropdownId === filter.id ? "border-blue-500 ring-2 ring-blue-50" : "border-slate-300 bg-white"
                  }`}
                >
                  <span className={filters[filter.id] ? "text-slate-900" : "text-slate-400"}>
                    {filters[filter.id] || `Select ${filter.label}`}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${openDropdownId === filter.id ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {openDropdownId === filter.id && (
                  <div className="absolute z-40 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
                    <div className="py-1">
                      {filter.options.map((option) => (
                        <div
                          key={option}
                          onClick={() => handleSelectOption(filter.id, option)}
                          className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                            filters[filter.id] === option ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-slate-50 text-slate-700"
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 p-2 bg-slate-50 sticky bottom-0">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="Others..."
                          value={otherInputs[filter.id] || ""}
                          onChange={(e) => setOtherInputs((prev) => ({ ...prev, [filter.id]: e.target.value }))}
                          className="flex-1 h-8 border border-slate-300 rounded px-2 text-xs bg-white focus:outline-none focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddCustomOption(filter.id)}
                          className="w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center font-bold text-lg transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={handleApplyFilter}
              className="w-full bg-black text-white py-2 rounded-lg font-medium text-sm mt-2 hover:bg-gray-800 transition-colors"
            >
              Apply Filter
            </button>
            <button
              onClick={clearFilters}
              className="w-full border border-slate-300 py-2 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Result Discovery</h1>
            <p className="text-gray-500">Creator Found</p>
          </div>

          {/* Action Bar */}
          <div className="flex items-center gap-4 mb-6">
            {selectedRows.length > 0 && (
              <div className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm">
                <span>{selectedRows.length} selected</span>
                <button onClick={() => setSelectedRows([])} className="hover:bg-blue-700 p-1 rounded-full">×</button>
              </div>
            )}
            <button 
              onClick={handleOpenModal}
              className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-800 transition-colors"
            >
              <span>+</span> Add to Project
            </button>
          </div>

          {/* Show Entries */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <span>Show</span>
            <input
              type="number"
              value={entriesPerPage}
              onChange={(e) => {
                setEntriesPerPage(Math.max(1, Number(e.target.value)));
                setCurrentPage(1);
              }}
              className="w-16 border border-gray-300 rounded px-2 py-1"
            />
            <span>entries</span>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg w-full">
            <table className="w-full text-sm border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200 text-left">
                  <th className="p-3 w-12 border-r border-gray-200 text-center">
                    <input
                      type="checkbox"
                      checked={currentData.length > 0 && currentData.every((item) => selectedRows.includes(item.no))}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  {["No.", "Photo", "Influencer Name", "Username", "Post", "Followers", "ER", "Avr View", "Action detail"].map((head) => (
                    <th key={head} className="p-3 border-r border-gray-200 font-semibold text-gray-700 whitespace-nowrap">
                      <div className="flex items-center justify-between">
                        <span>{head}</span>
                        <SortIcon />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, i) => (
                  <tr key={row.no} className="border-b border-gray-200 hover:bg-gray-50 text-gray-800">
                    <td className="p-3 border-r border-gray-200 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.no)}
                        onChange={() => toggleSelect(row.no)}
                      />
                    </td>
                    <td className="p-3 border-r border-gray-200 text-center">{startIndex + i + 1}</td>
                    <td className="p-3 border-r border-gray-200 text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-500 mx-auto">🖼️</div>
                    </td>
                    <td className="p-3 border-r border-gray-200 font-medium whitespace-nowrap">{row.name}</td>
                    <td className="p-3 border-r border-gray-200 text-gray-500 whitespace-nowrap">{row.username}</td>
                    <td className="p-3 border-r border-gray-200 whitespace-nowrap">{row.post}</td>
                    <td className="p-3 border-r border-gray-200 whitespace-nowrap">{row.followers}</td>
                    <td className="p-3 border-r border-gray-200 whitespace-nowrap">{row.er}</td>
                    <td className="p-3 border-r border-gray-200 whitespace-nowrap">{row.avrView}</td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-full transition-colors inline-flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
                {currentData.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-gray-400 italic">
                      No data available. Please select and apply filters to discover creators.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>
              Showing {totalEntries > 0 ? startIndex + 1 : 0} to {endIndex} of {totalEntries} entries
            </span>

            {totalPages > 1 && (
              <div className="flex border border-gray-200 rounded-md overflow-hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-100 border-r border-gray-200 disabled:opacity-50 hover:bg-gray-200"
                >
                  Previous
                </button>

                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`px-3 py-1 border-r border-gray-200 ${pageNum === currentPage ? "bg-blue-50 font-bold text-blue-600" : "hover:bg-gray-50"}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- POPUP COMPONENT: CREATE NEW PROJECT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
            
            {/* Header Modal */}
            <div className="bg-[#E9B35A] px-5 py-3.5 flex items-center justify-between text-white">
              <h3 className="font-semibold text-base tracking-wide text-center flex-1 ml-6">
                Create New Project
              </h3>
              <button 
                onClick={handleCloseModal}
                className="text-black hover:bg-black/10 rounded-lg p-1 text-xl font-bold transition-colors w-7 h-7 flex items-center justify-center leading-none"
              >
                ×
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmitProject} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="Fill Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white placeholder-slate-400"
                />
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-slate-700 mb-1">Brand</label>
                <div
                  onClick={() => setIsBrandDropdownOpen(!isBrandDropdownOpen)}
                  className={`w-full h-10 border rounded-lg px-3 flex items-center justify-between text-sm cursor-pointer transition-colors ${
                    isBrandDropdownOpen ? "border-blue-500 ring-2 ring-blue-50" : "border-slate-300 bg-white"
                  }`}
                >
                  <span className={selectedBrand ? "text-slate-900" : "text-slate-400"}>
                    {selectedBrand || "Choose Brand"}
                  </span>
                  <svg
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isBrandDropdownOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {isBrandDropdownOpen && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {BRAND_OPTIONS.map((brand) => (
                      <div
                        key={brand}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setIsBrandDropdownOpen(false);
                        }}
                        className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                          selectedBrand === brand ? "bg-blue-50 text-blue-600 font-medium" : "hover:bg-slate-50 text-slate-700"
                        }`}
                      >
                        {brand}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white text-slate-700 uppercase"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 border border-slate-300 rounded-lg px-3 text-sm focus:outline-none focus:border-blue-500 bg-white text-slate-700 uppercase"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white h-11 rounded-lg font-medium text-sm mt-2 hover:bg-gray-800 transition-colors active:scale-[0.99]"
              >
                Add To Project
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}