import React, { useState, useEffect } from 'react';

function JobListing() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    experience: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [summaries, setSummaries] = useState({});
  const [loadingSummaries, setLoadingSummaries] = useState({});

  // Function to clean job titles by removing Mumbai references
  const cleanJobTitle = (title) => {
    return title.replace(/\s*,?\s*mumbai\s*$/i, '');
  };

  // Function to fetch jobs from the API
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/jobs/');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      
      // Clean job titles before setting to state
      const cleanedJobs = data.map(job => ({
        ...job,
        title: job.title ? cleanJobTitle(job.title) : job.title
      }));
      
      setJobs(cleanedJobs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch job summary
  const fetchJobSummary = async (jobId) => {
    if (summaries[jobId]) {
      // Toggle existing summary visibility
      setSummaries({
        ...summaries,
        [jobId]: {
          ...summaries[jobId],
          visible: !summaries[jobId].visible
        }
      });
      return;
    }

    setLoadingSummaries({ ...loadingSummaries, [jobId]: true });
    
    try {
      const response = await fetch(`/api/jobs/${jobId}/summary/`);
      if (!response.ok) {
        throw new Error('Failed to fetch job summary');
      }
      const data = await response.json();
      
      setSummaries({
        ...summaries,
        [jobId]: {
          data: data,
          visible: true
        }
      });
    } catch (err) {
      setSummaries({
        ...summaries,
        [jobId]: {
          error: err.message,
          visible: true
        }
      });
    } finally {
      setLoadingSummaries({ ...loadingSummaries, [jobId]: false });
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = filters.location === '' || 
                            job.location?.toLowerCase().includes(filters.location.toLowerCase());
    
    const matchesExperience = filters.experience === '' || 
                              job.experience?.toLowerCase().includes(filters.experience.toLowerCase());
    
    return matchesSearch && matchesLocation && matchesExperience;
  });

  // Calculate days ago for job posting
  const getDaysAgo = (date) => {
    if (!date) return null;
    const postDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? 'Today' : `${diffDays} days ago`;
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      location: '',
      experience: ''
    });
  };

  return (
    <div className="bg-purple-50 min-h-screen flex flex-col w-full overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-purple-900 text-white p-6 shadow-lg w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold">JobScraper Pro</h1>
              <p className="text-purple-200 mt-1">Find your dream job effortlessly</p>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => fetchJobs()}
                className="bg-white text-purple-800 px-4 py-2 rounded-md hover:bg-purple-100 transition-colors duration-300 font-medium text-sm flex items-center"
              >
                <span className="mr-2">Refresh</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="bg-white shadow-md py-4 sticky top-0 z-10 w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search job titles or locations..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md hover:bg-purple-200 transition-colors duration-300 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Filters</span>
              </button>
              {(searchTerm || filters.location || filters.experience) && (
                <button 
                  onClick={resetFilters}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors duration-300"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
          
          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 p-4 bg-purple-50 rounded-md border border-purple-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input 
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    placeholder="Filter by location..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input 
                    type="text"
                    value={filters.experience}
                    onChange={(e) => setFilters({...filters, experience: e.target.value})}
                    placeholder="Filter by experience level..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="w-full overflow-hidden">
        <div className="container mx-auto px-4 py-8">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p>{error}</p>
              </div>
            </div>
          )}

          {/* Job Count */}
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {loading ? 'Loading jobs...' : `${filteredJobs.length} Jobs Found`}
            </h2>
            <div className="text-sm text-gray-500">
              Sorted by relevance
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg shadow-lg overflow-hidden border border-purple-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 text-white">
                    <h2 className="text-xl font-bold truncate">{job.title}</h2>
                    <div className="mt-1 flex items-center text-purple-200 text-sm relative justify-center">
                      <button 
                        onClick={() => fetchJobSummary(job.id)}
                        className="flex items-center hover:text-purple-800 transition-colors duration-200 bg-white text-purple-600 rounded px-5 py-2 mt-2 mb-2 shadow-md cursor-pointer"
                      >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
  <path d="M11.5 1.5C11.5 1.5 9 7 3 7C3 7 7 8.5 7 13C7 17.5 3 20.5 3 20.5C3 20.5 9 19 11.5 13C14 7 11.5 1.5 11.5 1.5Z" />
  <path d="M19.5 3.5C19.5 3.5 18 7 14 7C14 7 16 8 16 10.5C16 13 14 14.5 14 14.5C14 14.5 18 14 19.5 10.5C21 7 19.5 3.5 19.5 3.5Z" />
  <path d="M16.5 16.5C16.5 16.5 15 19 12 19C12 19 13.5 20 13.5 21.5C13.5 23 12 24 12 24C12 24 15 23.5 16 21.5C17 19.5 16.5 16.5 16.5 16.5Z" />
</svg>
                        <span className='text-purple-600 font-bold'>Summarize Job</span>
                        <svg 
                          className={`ml-1 w-4 h-4 transition-transform duration-200 ${summaries[job.id]?.visible ? 'transform rotate-180' : ''}`} 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {loadingSummaries[job.id] && (
                        <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      )}
                    </div>
                    
                    {/* Job Summary Dropdown */}
                    {summaries[job.id]?.visible && (
                      <div className="mt-3 bg-white text-gray-800 p-3 rounded shadow-inner animate-fadeIn">
                        {summaries[job.id]?.error ? (
                          <p className="text-red-500 text-sm">{summaries[job.id].error}</p>
                        ) : (
                          <div className="text-sm">
                            {summaries[job.id]?.data?.summary ? (
                              <>
                                <h4 className="font-semibold text-purple-800 mb-1">Job Summary</h4>
                                <p>{summaries[job.id].data.summary}</p>
                                {summaries[job.id].data.skills && (
                                  <div className="mt-2">
                                    <h4 className="font-semibold text-purple-800 mb-1">Required Skills</h4>
                                    <div className="flex flex-wrap gap-1 ">
                                      {summaries[job.id].data.skills.map((skill, idx) => (
                                        <span key={idx} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded ">{skill}</span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <p>No summary available</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="mb-4">
                      <div className="flex items-center text-gray-700 mb-3">
                        <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate">{job.location || 'Location not specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-700 mb-3">
                        <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">{job.salary || 'Salary not specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-700 mb-3">
                        <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{job.experience || 'Experience not specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-700 mb-4">
                        <svg className="w-4 h-4 mr-2 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="truncate">{job.openings || 'Openings not specified'}</span>
                      </div>
                      <div className="flex items-center text-gray-700 mb-4 gap-[7px]">
                      <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
  <rect x="2" y="4" width="20" height="16" rx="3" ry="3" fill="#b490ff" />
  <path d="M22 7.5l-10 5.5-10-5.5" stroke="white" stroke-width="2" fill="none" />
  <path d="M2 7.5l10 5.5 10-5.5" fill="white" opacity="0.3" />
</svg>

                        <span className="truncate">zepto_jobs@gmail.com</span>
                      </div>
                      {job.posted_date && (
                        <div className="flex items-center text-gray-500 text-sm mb-4">
                          <svg className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>Posted {getDaysAgo(job.posted_date)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <a 
                        href={job.url || job.link || job.apply_link || '#'} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-grow text-white bg-purple-600 hover:bg-purple-700 hover:shadow-sm font-medium py-2 px-4 rounded text-center transition-colors duration-300"
                      >
                        Apply Now
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mx-auto"></div>
                  <p className="mt-4 text-purple-600 font-medium">Fetching available jobs...</p>
                </div>
              </div>
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="bg-purple-100 p-8 rounded-lg max-w-md mx-auto">
                  <svg className="w-16 h-16 text-purple-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">No Jobs Found</h3>
                  <p className="text-purple-600 mb-4">No jobs match your current search criteria. Try adjusting your filters or check back later.</p>
                  <button 
                    onClick={resetFilters}
                    className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors duration-300"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-purple-800 to-purple-900 text-purple-200 py-8 mt-auto w-full">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">JobScraper Pro</h3>
              <p className="text-purple-300">Your career partner in the digital age</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-purple-200 hover:text-white transition-colors duration-300">About</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors duration-300">Contact</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors duration-300">Privacy</a>
              <a href="#" className="text-purple-200 hover:text-white transition-colors duration-300">Terms</a>
            </div>
          </div>
          <div className="border-t border-purple-700 mt-6 pt-6 text-center md:text-left">
            <p>© {new Date().getFullYear()} JobScraper Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
      {/* Global styles to prevent overflow */}
      <style jsx global>{`
        html, body {
          overflow-x: hidden;
          width: 100%;
          margin: 0;
          padding: 0;
        }
        #__next, #root, .app {
          overflow-x: hidden;
          width: 100%;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

export default JobListing;