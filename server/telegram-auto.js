const express = require('express');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');
const app = express();

app.use(express.json());

// ✅ Secure Configuration
const CONFIG = {
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || '8406477017:AAGpDTbR6ORMQ7a9Nks-UNteXwtMLckxefI',
  PROJECTS_FILE: path.join(__dirname, '../public/data/projects.json'),
  IMAGES_DIR: path.join(__dirname, '../public/images')
};

// ✅ Create directories if they don't exist
async function ensureDirectories() {
  try {
    await fs.access(CONFIG.IMAGES_DIR);
  } catch {
    await fs.mkdir(CONFIG.IMAGES_DIR, { recursive: true });
  }
}

// ✅ Webhook to receive Telegram messages
app.post('/webhook/telegram', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).send('No message received');
    }

    console.log('📨 Received message:', {
      message_id: message.message_id,
      has_photo: !!message.photo,
      has_document: !!message.document,
      has_text: !!message.text,
      caption: message.caption
    });

    // Handle photos with captions
    if (message.photo && message.caption) {
      const largestPhoto = message.photo[message.photo.length - 1];
      await processTelegramProject(largestPhoto.file_id, message.caption, message.from, 'photo');
      await sendTelegramMessage(message.chat.id, '✅ Project received! Processing image and updating website...');
    }
    // Handle documents (files) with captions
    else if (message.document && message.caption) {
      const document = message.document;
      // Check if it's an image document
      if (document.mime_type && document.mime_type.startsWith('image/')) {
        await processTelegramProject(document.file_id, message.caption, message.from, 'document');
        await sendTelegramMessage(message.chat.id, '✅ Project received! Processing image and updating website...');
      } else {
        await sendTelegramMessage(message.chat.id, '❌ Please send an image file (JPEG, PNG, etc.)');
      }
    }
    // Handle text messages
    else if (message.text) {
      if (message.text === '/start') {
        await sendTelegramMessage(message.chat.id, 
          `👋 Welcome to Project Auto-Processor Bot!\n\n` +
          `📤 To submit a project, send an image with a caption in this format:\n\n` +
          `📝 Title: Your Project Title\n` +
          `📄 Description: Your project description\n` +
          `🔗 Live Demo: https://your-link.com or "Not Available"\n\n` +
          `📎 You can send as a photo or as an image file!`
        );
      } else if (message.text.includes('NEW PROJECT SUBMISSION')) {
        await sendTelegramMessage(message.chat.id,
          `📋 Great! Now please send the image for your project with the details in the caption.\n\n` +
          `Example caption:\n` +
          `Title: My Awesome App\n` +
          `Description: A revolutionary mobile application\n` +
          `Live Demo: https://myapp.com`
        );
      } else {
        await sendTelegramMessage(message.chat.id, 
          `📸 Please send an image with caption containing:\n\n` +
          `• Title: [Your project title]\n` +
          `• Description: [Brief description]\n` +
          `• Live Demo: [URL or "Not Available"]`
        );
      }
    }
    // Handle images without captions
    else if (message.photo && !message.caption) {
      await sendTelegramMessage(message.chat.id,
        `📝 Please add a caption to your image with project details:\n\n` +
        `Title: [Project Title]\n` +
        `Description: [Project Description]\n` +
        `Live Demo: [URL or "Not Available"]`
      );
    }
    else if (message.document && !message.caption) {
      await sendTelegramMessage(message.chat.id,
        `📝 Please add a caption to your file with project details:\n\n` +
        `Title: [Project Title]\n` +
        `Description: [Project Description]\n` +
        `Live Demo: [URL or "Not Available"]`
      );
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error processing webhook');
  }
});

// ✅ Process Telegram project
async function processTelegramProject(fileId, caption, user, fileType = 'photo') {
  try {
    await ensureDirectories();
    
    console.log(`🔄 Processing ${fileType} project...`);
    
    // 1. Download image
    const imageBuffer = await downloadTelegramFile(fileId);
    
    // 2. Parse project info
    const projectInfo = parseProjectCaption(caption);
    
    // 3. Convert and save image
    const webpFilename = await convertAndSaveImage(imageBuffer);
    
    // 4. Update projects data
    await updateProjectsData({
      ...projectInfo,
      image: `/images/${webpFilename}`,
      user: user.first_name || 'Telegram User',
      username: user.username || '',
      createdAt: new Date().toISOString()
    });
    
    console.log('✅ Project processed successfully:', projectInfo.title);
    
  } catch (error) {
    console.error('Error processing project:', error);
    throw error;
  }
}

// ✅ Download file from Telegram
async function downloadTelegramFile(fileId) {
  try {
    console.log('📥 Downloading file from Telegram...');
    
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/getFile?file_id=${fileId}`
    );
    
    if (!fileResponse.data.ok) {
      throw new Error('Failed to get file path from Telegram');
    }
    
    const filePath = fileResponse.data.result.file_path;
    console.log('📁 File path:', filePath);
    
    const downloadUrl = `https://api.telegram.org/file/bot${CONFIG.TELEGRAM_TOKEN}/${filePath}`;
    const imageResponse = await axios.get(downloadUrl, { 
      responseType: 'arraybuffer',
      timeout: 30000
    });
    
    console.log('✅ File downloaded successfully');
    return Buffer.from(imageResponse.data);
  } catch (error) {
    console.error('Download error:', error.message);
    throw new Error('Failed to download image from Telegram');
  }
}

// ✅ Convert image to WebP
async function convertAndSaveImage(imageBuffer) {
  const filename = `project-${Date.now()}.webp`;
  const outputPath = path.join(CONFIG.IMAGES_DIR, filename);
  
  console.log('🖼 Converting image to WebP...');
  
  await sharp(imageBuffer)
    .resize(800, 600, { 
      fit: 'inside',
      withoutEnlargement: true 
    })
    .webp({ 
      quality: 80,
      effort: 6 
    })
    .toFile(outputPath);
  
  console.log('✅ Image saved as:', filename);
  return filename;
}

// ✅ Parse project info from caption (More flexible parsing)
function parseProjectCaption(caption) {
  const project = {
    title: 'New Project',
    description: 'No description provided',
    liveLink: null,
    tags: []
  };
  
  if (!caption) return project;
  
  console.log('📝 Parsing caption:', caption);
  
  // More flexible parsing - handle different formats
  const titleMatch = caption.match(/(?:📝|Title:?)\s*([^\n]+)/i);
  const descMatch = caption.match(/(?:📄|Description:?)\s*([^\n]+)/i);
  const linkMatch = caption.match(/(?:🔗|Live Demo:?)\s*([^\n]+)/i);
  
  if (titleMatch) project.title = titleMatch[1].trim();
  if (descMatch) project.description = descMatch[1].trim();
  if (linkMatch) {
    const link = linkMatch[1].trim();
    if (link && !link.includes('Not Available') && !link.includes('undefined')) {
      project.liveLink = link;
    }
  }
  
  // Also try simple line-by-line parsing
  const lines = caption.split('\n').filter(line => line.trim());
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('Title:') && !titleMatch) {
      project.title = trimmed.replace('Title:', '').trim();
    } else if (trimmed.startsWith('Description:') && !descMatch) {
      project.description = trimmed.replace('Description:', '').trim();
    } else if (trimmed.startsWith('Live Demo:') && !linkMatch) {
      const link = trimmed.replace('Live Demo:', '').trim();
      if (link && !link.includes('Not Available')) {
        project.liveLink = link;
      }
    }
  });
  
  console.log('📊 Parsed project:', project);
  return project;
}

// ✅ Update projects.json
async function updateProjectsData(newProject) {
  try {
    let projectsData;
    
    try {
      const data = await fs.readFile(CONFIG.PROJECTS_FILE, 'utf8');
      projectsData = JSON.parse(data);
    } catch (error) {
      // Initialize if file doesn't exist
      projectsData = { projects: [] };
    }
    
    const projectToAdd = {
      id: Date.now().toString(),
      ...newProject,
      source: 'telegram-auto',
      updatedAt: new Date().toISOString()
    };
    
    projectsData.projects.unshift(projectToAdd);
    
    await fs.writeFile(CONFIG.PROJECTS_FILE, JSON.stringify(projectsData, null, 2));
    console.log('📁 Projects data updated successfully');
    
  } catch (error) {
    console.error('Error updating projects data:', error);
    throw new Error('Failed to update projects data');
  }
}

// ✅ Send Telegram message
async function sendTelegramMessage(chatId, text) {
  try {
    await axios.post(`https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage`, {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Error sending Telegram message:', error.message);
  }
}

// ✅ Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    service: 'Telegram Auto-Processor',
    timestamp: new Date().toISOString()
  });
});

// ✅ Get bot info endpoint
app.get('/bot-info', async (req, res) => {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/getMe`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ✅ Projects API endpoint
app.get('/api/projects', async (req, res) => {
  try {
    const projectsData = await fs.readFile(CONFIG.PROJECTS_FILE, 'utf8');
    const data = JSON.parse(projectsData);
    res.json(data);
  } catch (error) {
    console.log('Projects file not found, returning empty array');
    res.json({ 
      projects: [], 
      lastUpdated: new Date().toISOString() 
    });
  }
});

// ✅ Projects count endpoint
app.get('/api/projects/count', async (req, res) => {
  try {
    const projectsData = await fs.readFile(CONFIG.PROJECTS_FILE, 'utf8');
    const data = JSON.parse(projectsData);
    res.json({ 
      total: data.projects.length,
      telegram: data.projects.filter(p => p.source === 'telegram-auto').length,
      lastUpdated: data.lastUpdated 
    });
  } catch (error) {
    res.json({ 
      total: 0, 
      telegram: 0, 
      lastUpdated: new Date().toISOString() 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🤖 Telegram Auto-Processor running on port ${PORT}`);
  console.log(`📍 Webhook URL: http://localhost:${PORT}/webhook/telegram`);
  console.log(`🔑 Token: ${CONFIG.TELEGRAM_TOKEN ? '✓ Loaded' : '✗ Missing'}`);
  console.log(`🏥 Health: http://localhost:${PORT}/health`);
  console.log(`📊 Projects API: http://localhost:${PORT}/api/projects`);
});