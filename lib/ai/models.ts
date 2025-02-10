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
const tencentR1 = TencentCloud('deepseek-r1') // 推理模型
const tencentV3 = TencentCloud('deepseek-v3') // 文本模型

// 配置智谱大模型
const GLM = createOpenAICompatible({
  baseURL: 'https://open.bigmodel.cn/api/paas/v4/',
  apiKey: process.env.GLM_API_KEY,
  name: 'GLM',
})
const glm4Flash = GLM('glm-4-flash') // 文本模型
const glm4Plus = GLM('glm-4-plus') // 文本模型
const glm4VPlus = GLM('glm-4v-plus') // 多模态模型
const glm4VFlash = GLM('glm-4v-flash') // 多模态模型

// 千问大模型
const Qwen = createOpenAICompatible({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.QWEN_API_KEY,
  name: 'Qwen',
})
const qwenMaxLatest = Qwen('qwen-max-latest') // 文本模型
const qwenV3 = Qwen('deepseek-v3') // 文本模型
const qwenR1 = Qwen('deepseek-r1') // 文本模型

export const DEFAULT_CHAT_MODEL: string = 'chat-model-small';

export const myProvider = customProvider({
  languageModels: {
    'chat-model-small': qwenMaxLatest,
    'chat-model-large': glm4Plus,
    'chat-model-multimodal-small': glm4VFlash,
    'chat-model-multimodal-large': glm4VPlus,
    'chat-model-reasoning': wrapLanguageModel({
      model: tencentR1,
      middleware: extractReasoningMiddleware({ tagName: 'think' }),
    }),
    'title-model': tencentV3,
    'block-model': qwenMaxLatest,
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
  {
    id: 'chat-model-multimodal-small',
    name: 'Multimodal small',
    description: 'For multimodal inputs & fast responses',
  },
  {
    id: 'chat-model-multimodal-large',
    name: 'Multimodal large',
    description: 'For multimodal inputs & complex tasks',
  },
];
