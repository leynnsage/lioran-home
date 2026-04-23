/**
 * LioranHome API Proxy Worker
 * 
 * 功能：
 * 1. 转发前端请求到各个 LLM API（Claude / OpenAI / 自定义中转站）
 * 2. 添加 CORS 头，解决浏览器跨域限制
 * 3. 可选：在 Worker 环境变量中存储 API Key（更安全）
 */

export default {
  async fetch(request, env) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-api-key, anthropic-version',
          'Access-Control-Max-Age': '86400',
        },
      })
    }

    try {
      const url = new URL(request.url)

      // 路由：/api/chat - 转发到 LLM API
      if (url.pathname === '/api/chat') {
        return await handleChatRequest(request, env)
      }

      // 默认返回
      return new Response('LioranHome API Proxy', { status: 200 })
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      })
    }
  },
}

/**
 * 处理聊天请求
 */
async function handleChatRequest(request, env) {
  const body = await request.json()
  
  // 从请求体中获取配置
  const {
    endpoint,    // API 端点 URL
    apiKey,      // API Key（前端传过来，或从 env 读取）
    messages,    // 消息数组
    model,       // 模型名称
    max_tokens,  // 最大 token
    temperature, // 温度
    system,      // 系统提示词（可选）
    tools,       // 工具定义（可选）
  } = body

  // 构建请求头
  const headers = {
    'Content-Type': 'application/json',
  }

  // 根据端点判断 API 类型
  if (endpoint.includes('anthropic.com')) {
    // Claude 官方 API
    headers['x-api-key'] = apiKey
    headers['anthropic-version'] = '2023-06-01'
  } else if (endpoint.includes('openai.com')) {
    // OpenAI API
    headers['Authorization'] = `Bearer ${apiKey}`
  } else {
    // 自定义中转站（通常兼容 Claude 格式）
    headers['x-api-key'] = apiKey
    headers['anthropic-version'] = '2023-06-01'
  }

  // 构建请求体
  const requestBody = {
    model,
    messages,
    max_tokens: max_tokens || 4096,
  }

  if (temperature !== undefined) {
    requestBody.temperature = temperature
  }

  if (system) {
    requestBody.system = system
  }

  if (tools && tools.length > 0) {
    requestBody.tools = tools
  }

  // 转发请求
  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody),
  })

  // 获取响应
  const responseData = await response.text()

  // 返回响应，添加 CORS 头
  return new Response(responseData, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
}
