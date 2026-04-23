/**
 * API 调用工具
 */

// Worker 代理地址（开发时用本地，部署后改成 Worker URL）
const WORKER_URL = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787'

/**
 * 调用 LLM API
 * @param {Object} config - API 配置
 * @param {Array} messages - 消息数组
 * @param {Object} options - 可选参数
 */
export async function callLLM(config, messages, options = {}) {
  const {
    system = '',
    temperature = 1,
    max_tokens = 4096,
    tools = [],
  } = options

  const requestBody = {
    endpoint: config.endpoint,
    apiKey: config.apiKey,
    model: config.model,
    messages,
    max_tokens,
    temperature,
  }

  if (system) {
    requestBody.system = system
  }

  if (tools.length > 0) {
    requestBody.tools = tools
  }

  const response = await fetch(`${WORKER_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'API 调用失败')
  }

  return await response.json()
}

/**
 * 流式调用 LLM API（后期实现）
 */
export async function callLLMStream(config, messages, options = {}) {
  // TODO: 实现流式响应
  throw new Error('流式调用暂未实现')
}