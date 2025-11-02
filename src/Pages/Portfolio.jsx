import React, { useState, useCallback, memo, useEffect } from "react";
import CardProject from "../components/CardProject";
import ImageModal from "../components/Modal";
import { Code, MessageCircle, Copy, Send, RefreshCw } from "lucide-react";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import SwipeableViews from "react-swipeable-views";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import Swal from "sweetalert2";

// ✅ TabPanel Component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

// ✅ a11yProps Function
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const Portfolio = memo(() => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState({ src: "", title: "" });

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

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  const handleOpenModal = useCallback((src, title) => {
    setSelectedImage({ src, title });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedImage({ src: "", title: "" });
  }, []);

  // ✅ Copy Telegram Format
  const copyTelegramFormat = () => {
    const format = `📋 NEW PROJECT SUBMISSION

📝 Title: [Project Title Here]
📄 Description: [Project description in one line]
🖼️ Image: [ATTACH PHOTO HERE]
🔗 Live Demo: [URL or "Not Available"]`;

    navigator.clipboard.writeText(format);
    
    Swal.fire({
      title: "Copied! 📋",
      text: "Telegram format copied to clipboard",
      icon: "success",
      confirmButtonColor: "#6366f1",
      timer: 2000,
    });
  };

  // ✅ Refresh projects
  const refreshProjects = () => {
    loadProjects();
    Swal.fire({
      title: "Refreshing...",
      text: "Checking for new projects",
      icon: "info",
      timer: 1000,
      showConfirmButton: false
    });
  };

  const telegramProjectsCount = projects.filter(p => p.source === 'telegram-auto').length;

  return (
    <div className="px-5 md:px-20 py-16 bg-[#000411] relative overflow-hidden min-h-screen">
      
      {/* Background Accent */}
      <div className="absolute top-[5%] left-[5%] w-96 h-96 bg-cyan-900/10 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[5%] w-80 h-80 bg-blue-900/10 rounded-full filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <h2 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-500 text-center mb-16 relative z-10">
        Professional Showcase
      </h2>

      {/* Telegram Auto-System Info */}
      <div className="text-center mb-8">
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
            <MessageCircle className="w-6 h-6 text-green-400" />
            <h3 className="text-xl font-semibold text-white">Auto Project System</h3>
            <button
              onClick={refreshProjects}
              disabled={isLoading}
              className="flex items-center gap-2 px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          <div className="text-left bg-black/30 rounded-lg p-4 mb-4">
            <pre className="text-green-400 text-sm whitespace-pre-wrap">
{`📋 NEW PROJECT SUBMISSION

📝 Title: Your Project Title
📄 Description: Project description
🖼️ Image: [ATTACH ANY PHOTO]
🔗 Live Demo: URL or "Not Available"`}
            </pre>
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={copyTelegramFormat}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy Format
            </button>
            <a
              href="https://t.me/Contactp7777_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              <Send className="w-4 h-4" />
              Send to Telegram
            </a>
          </div>

          <p className="text-green-400 text-sm mt-3">
            ✅ Auto-convert to WebP • ✅ Auto-save to website • ✅ Instant update
          </p>
          <p className="text-cyan-400 text-xs mt-2">
            {telegramProjectsCount} auto-added projects • Last refresh: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      <Box sx={{ width: "100%", maxWidth: 1200, margin: "0 auto" }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent" }}>
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="secondary"
            textColor="inherit"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              maxWidth: { xs: '100%', sm: 'fit-content' },
              margin: '0 auto',
              bgcolor: 'transparent', 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              
              '& .MuiTabs-indicator': {
                background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                height: '2px',
              },
              '& .MuiTab-root': {
                color: 'rgba(255, 255, 255, 0.6)',
                textTransform: 'uppercase',
                fontWeight: '600',
                fontSize: { xs: '0.75rem', sm: '0.9rem' },
                padding: { xs: '8px 16px', sm: '12px 24px' },
                transition: 'color 0.3s',
                minHeight: '48px',
                
                '&:hover': {
                  color: '#FFF',
                },
                '&.Mui-selected': {
                  color: '#FFF',
                  fontWeight: '700',
                },
              },
            }}
          >
            <Tab 
              icon={<Code className="w-5 h-5" />} 
              iconPosition="start" 
              label={`Case Studies ${isLoading ? '...' : `(${projects.length})`}`} 
              {...a11yProps(0)} 
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={tabValue}
          onChangeIndex={handleChangeIndex}
          className="mt-6"
        >
          <TabPanel value={tabValue} index={0} dir={theme.direction}>
            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-cyan-400">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-400"></div>
                  Loading projects...
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && projects.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-white/5 rounded-2xl p-8 max-w-md mx-auto">
                  <MessageCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No Projects Yet</h3>
                  <p className="text-gray-400 mb-4">
                    Use the Telegram bot to add your first project automatically!
                  </p>
                  <button
                    onClick={copyTelegramFormat}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors mx-auto"
                  >
                    <Copy className="w-4 h-4" />
                    Get Telegram Format
                  </button>
                </div>
              </div>
            )}

            {/* Projects Grid */}
            {!isLoading && projects.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                  {projects.map((project, index) => (
                    <CardProject
                      key={project.id || index}
                      project={project}
                      index={index}
                      onImageClick={handleOpenModal} 
                    />
                  ))}
                </div>

                {/* Auto-System Status */}
                <div className="mt-8 p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-center">
                  <p className="text-green-400 text-sm">
                    <MessageCircle className="w-4 h-4 inline mr-2" />
                    <strong>Auto-System Active</strong> • {telegramProjectsCount} projects added via Telegram
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Send project to Telegram → Auto WebP conversion → Instant website update
                  </p>
                </div>
              </>
            )}
          </TabPanel>
        </SwipeableViews>
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
    </div>
  );
});

Portfolio.displayName = "Portfolio";
export default Portfolio;