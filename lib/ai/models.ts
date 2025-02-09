import { config } from 'dotenv';
import { deepseek } from '@ai-sdk/deepseek';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';

config({
  path: '.env',
});

// 配置腾讯云
const TencentCloud = createOpenAICompatible({
  baseURL: 'https://api.lkeap.cloud.tencent.com/v1',
  apiKey: process.env.TENCENT_API_KEY,
  name: 'TencentCloud',
})
const tencentR1 = TencentCloud('deepseek-r1')
const tencentV3 = TencentCloud('deepseek-v3')

// 配置智谱大模型
const GLM = createOpenAICompatible({
  baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: process.env.GLM_API_KEY,
  name: 'GLM',
})
const glm4Flash = GLM('glm-4-flash')
const glm4Plus = GLM('glm-4-plus')

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

export const myProvider = customProvider({
  languageModels: {
    'chat-model-small': glm4Flash,
    'chat-model-large': glm4Plus,
    'chat-model-reasoning': wrapLanguageModel({
      model: tencentR1,
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': tencentV3,
    'block-model': tencentV3,
  },
  // imageModels: {
  //   'small-model': openai.image('dall-e-2'),
  //   'large-model': openai.image('dall-e-3'),
  // },
});

interface ChatModel {
  id: string;
  name: string;
  description: string;
}

export const chatModels: Array<ChatModel> = [
  {
    id: 'chat-model-small',
    name: 'Small model',
    description: 'Small model for fast, lightweight tasks',
  },
  {
    id: 'chat-model-large',
    name: 'Large model',
    description: 'Large model for complex, multi-step tasks',
  },
  {
    id: 'chat-model-reasoning',
    name: 'Reasoning model',
    description: 'Uses advanced reasoning',
  },
];
