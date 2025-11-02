require('dotenv').config();
const axios = require('axios');

// Configuration
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || '8406477017:AAGpDTbR6ORMQ7a9Nks-UNteXwtMLckxefI';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://your-domain.com/webhook/telegram';
const NODE_ENV = process.env.NODE_ENV || 'development';

// Validate required environment variables
if (!TELEGRAM_TOKEN) {
  console.error('❌ TELEGRAM_TOKEN is required in .env file');
  console.error('💡 Create a .env file with: TELEGRAM_TOKEN=your_bot_token_here');
  process.exit(1);
}

if (!WEBHOOK_URL || WEBHOOK_URL === 'https://your-domain.com/webhook/telegram') {
  console.error('❌ WEBHOOK_URL is not properly configured');
  console.error('💡 Set WEBHOOK_URL in .env to your actual domain');
  process.exit(1);
}

async function setupWebhook() {
  try {
    console.log('🔧 Setting up Telegram webhook...');
    console.log('🤖 Bot Token:', TELEGRAM_TOKEN.substring(0, 10) + '...');
    console.log('📍 Webhook URL:', WEBHOOK_URL);
    console.log('🌍 Environment:', NODE_ENV);
    
    // First, get bot info to verify token
    console.log('\n🔍 Verifying bot token...');
    const botInfoResponse = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getMe`
    );
    
    if (botInfoResponse.data.ok) {
      const bot = botInfoResponse.data.result;
      console.log('✅ Bot verified:');
      console.log('   Name:', bot.first_name);
      console.log('   Username:', `@${bot.username}`);
      console.log('   ID:', bot.id);
    } else {
      console.error('❌ Invalid bot token');
      return;
    }

    // Set webhook
    console.log('\n📡 Setting webhook...');
    const webhookResponse = await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook`,
      {
        url: WEBHOOK_URL,
        max_connections: 100,
        allowed_updates: ['message', 'edited_message'],
        drop_pending_updates: true
      },
      {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (webhookResponse.data.ok) {
      console.log('✅ Webhook setup successful!');
      console.log('📝 Description:', webhookResponse.data.description || 'No description');
      
      if (webhookResponse.data.result) {
        console.log('🔗 Webhook is active and ready to receive updates');
      }
    } else {
      console.error('❌ Webhook setup failed:', webhookResponse.data.description);
      return;
    }
    
    // Get detailed webhook information
    console.log('\n📊 Getting webhook details...');
    const webhookInfo = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getWebhookInfo`,
      { timeout: 5000 }
    );
    
    if (webhookInfo.data.ok) {
      const info = webhookInfo.data.result;
      console.log('📋 Webhook Information:');
      console.log('   ✅ Active:', info.url ? 'Yes' : 'No');
      console.log('   🔗 URL:', info.url || 'Not set');
      console.log('   📞 Pending updates:', info.pending_update_count);
      console.log('   👥 Max connections:', info.max_connections);
      console.log('   ❌ Last error date:', info.last_error_date ? new Date(info.last_error_date * 1000).toLocaleString() : 'Never');
      console.log('   💬 Last error message:', info.last_error_message || 'None');
      
      if (info.last_error_date) {
        console.log('   ⚠️  Warning: Webhook has previous errors');
      }
    }
    
    console.log('\n🎉 Webhook setup completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Send a message to your bot on Telegram');
    console.log('   2. Check server logs for incoming webhooks');
    console.log('   3. Test with: /start command');
    console.log('   4. Send an image with project details in caption');
    
  } catch (error) {
    console.error('\n❌ Webhook setup failed:');
    
    if (error.code === 'ENOTFOUND') {
      console.error('   🌐 Network error: Cannot connect to Telegram API');
      console.error('   💡 Check your internet connection');
    } else if (error.response) {
      // Telegram API error
      console.error('   📡 Telegram API error:', error.response.status);
      console.error('   📝 Description:', error.response.data.description);
      
      if (error.response.status === 404) {
        console.error('   💡 Check your TELEGRAM_TOKEN');
      } else if (error.response.status === 400) {
        console.error('   💡 Invalid webhook URL format');
      }
    } else if (error.request) {
      console.error('   ⏰ Request timeout: Telegram API not responding');
      console.error('   💡 Try again later or check firewall settings');
    } else {
      console.error('   🔧 Unexpected error:', error.message);
    }
    
    process.exit(1);
  }
}

// Delete webhook (useful for development)
async function deleteWebhook() {
  try {
    console.log('🗑️  Deleting webhook...');
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/deleteWebhook`,
      { params: { drop_pending_updates: true } }
    );
    
    if (response.data.ok) {
      console.log('✅ Webhook deleted successfully');
      console.log('📝 Description:', response.data.description);
    } else {
      console.error('❌ Failed to delete webhook:', response.data.description);
    }
  } catch (error) {
    console.error('❌ Error deleting webhook:', error.message);
  }
}

// Get webhook info only
async function getWebhookInfo() {
  try {
    console.log('🔍 Getting webhook info...');
    const response = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/getWebhookInfo`
    );
    
    if (response.data.ok) {
      const info = response.data.result;
      console.log('📋 Webhook Status:');
      console.log('   URL:', info.url || 'Not set');
      console.log('   Has custom certificate:', info.has_custom_certificate || false);
      console.log('   Pending updates:', info.pending_update_count);
      console.log('   Last error date:', info.last_error_date ? new Date(info.last_error_date * 1000).toLocaleString() : 'Never');
      console.log('   Last error message:', info.last_error_message || 'None');
      console.log('   Max connections:', info.max_connections || 'Not set');
    }
  } catch (error) {
    console.error('❌ Error getting webhook info:', error.message);
  }
}

// Command line interface
const command = process.argv[2];

switch (command) {
  case 'delete':
    deleteWebhook();
    break;
  case 'info':
    getWebhookInfo();
    break;
  case 'setup':
  default:
    setupWebhook();
    break;
}

// Export functions for use in other files
module.exports = {
  setupWebhook,
  deleteWebhook,
  getWebhookInfo
};