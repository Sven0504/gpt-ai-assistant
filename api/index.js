import express from 'express';
import { handleEvents, printPrompts } from '../app/index.js';
import config from '../config/index.js';
import { validateLineSignature } from '../middleware/index.js';
import storage from '../storage/index.js';
import { fetchVersion, getVersion } from '../utils/index.js';

const app = express();

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  },  
}));  

app.get('/', async (req, res) => {
  if (config.APP_URL) {
    res.redirect(config.APP_URL);
    return;  
  }
  const currentVersion = getVersion();
  const latestVersion = await fetchVersion();
  res.status(200).send({ status: 'OK', currentVersion, latestVersion });
});  

app.post(config.APP_WEBHOOK_PATH, validateLineSignature, async (req, res) => {
  try {  
    // 獲取所有 LINE 發送的事件
    const events = req.body.events;

    // 遍歷事件，檢查是否以"帥哥"開頭
    for (const event of events) {
      if (event.type === 'message' && event.message.type === 'text') {
        const messageText = event.message.text;

        // 檢查消息是否以"帥哥"開頭
        const keywordPrefix = "帥哥";
        if (messageText.startsWith(keywordPrefix)) {
          // 處理以"帥哥"開頭的消息
          await storage.initialize();
          await handleEvents(events);
          res.sendStatus(200); // 請求成功
          return;    
        }
      }
    }

    // 如果消息不以"帥哥"開頭，回應 204 No Content（無需處理）
    res.sendStatus(204);
  } catch (err) {
    console.error(err.message);
    res.sendStatus(500);
  }

  // 在調試模式下打印提示
  if (config.APP_DEBUG) printPrompts();
});    

if (config.APP_PORT) {
  app.listen(config.APP_PORT);
}

export default app;
