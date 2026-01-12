import { BotService } from './bot.service';

export const initBotModule = async () => {
  // Register commands first so they appear in Telegram's command menu
  await BotService.registerCommands();
  
  // Then attach the command handlers
  BotService.attachCommandHandlers();
  
  console.log('[BOT] Bot module initialized');
};

export { BotService } from './bot.service';
