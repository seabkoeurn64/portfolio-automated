import React, { useState, useCallback, memo, useEffect } from "react";
import CardProject from "../components/CardProject";
import ImageModal from "../components/Modal";
import { Code } from "lucide-react"; // Only Code icon remains
import Box from "@mui/material/Box";
import Swal from "sweetalert2";

const Portfolio = memo(() => {
  // Removed state for sorting and filtering
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: "", title: "" });
  
  // The list of projects is now simply the full list
  const allProjects = projects;
  const totalProjectCount = projects.length;

  // ✅ Load projects from JSON file
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/data/projects.json');
      if (!response.ok) {
        throw new Error('Failed to load projects');
      }
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Error loading projects:', error);
      Swal.fire({
        title: "Error!",
        text: "Failed to load projects data",
        icon: "error",
        confirmButtonColor: "#6366f1",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = useCallback((src, title) => {
    setSelectedImage({ src, title });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage({ src: "", title: "" });
  }, []);

  // Utility function to render the project grid/state
  const renderProjectContent = (currentProjects, currentTotalCount) => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 text-cyan-400">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
            Loading projects...
          </div>
        </div>
      );
    }

    if (currentProjects.length === 0) {
      return (
        <div className="text-center py-8 md:py-12">
          <div className="bg-white/5 rounded-xl md:rounded-2xl p-6 md:p-8 max-w-md mx-auto">
            <Code className="w-10 h-10 md:w-12 md:h-12 text-gray-500 mx-auto mb-3 md:mb-4" /> 
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              No Projects Yet
            </h3>
            <p className="text-gray-400 text-sm md:text-base mb-4">
              Projects will appear here once they are added to the system.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6 md:space-y-8">
        {/* Results Count (Simplified) */}
        <div className="flex justify-between items-center">
          <p className="text-gray-400 text-xs md:text-sm">
            Showing all {currentTotalCount} projects in the portfolio.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {currentProjects.map((project, index) => (
            <CardProject
              key={project.id || index}
              project={project}
              index={index}
              onImageClick={handleOpenModal} 
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <section id="Portofolio" className="px-4 sm:px-6 md:px-20 py-8 md:py-16 bg-[#000411] relative overflow-hidden min-h-screen">
      
      {/* Background Accent */}
      <div className="absolute top-[5%] left-[5%] w-64 h-64 md:w-96 md:h-96 bg-cyan-900/10 rounded-full filter blur-3xl opacity-20 md:opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[5%] w-56 h-56 md:w-80 md:h-80 bg-blue-900/10 rounded-full filter blur-3xl opacity-20 md:opacity-30 animate-pulse delay-1000"></div>

      {/* Header Section */}
      <div className="text-center mb-8 md:mb-12 relative z-10">
        <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500 mb-2 md:mb-4">
          Professional Showcase
        </h2>
        
        <p className="text-gray-400 text-sm md:text-lg max-w-2xl mx-auto hidden sm:block">
          Explore my complete portfolio of {totalProjectCount} projects.
        </p>
      </div>

      <Box sx={{ width: "100%", maxWidth: 1400, margin: "0 auto" }}>
        
        {/* All Filter/Search UI elements removed */}
        
        {/* Project Content Render */}
        <div className="mt-4 md:mt-8">
            {renderProjectContent(allProjects, totalProjectCount)}
        </div>
      </Box>

      {/* Image Modal */}
      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          imageUrl={selectedImage.src}
          title={selectedImage.title}
        />
      )}
    </section>
  );
});

Portfolio.displayName = "Portfolio";
export default Portfolio;