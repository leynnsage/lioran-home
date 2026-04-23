import { useState, useEffect, useRef } from 'react'
import { ArrowDown, FileText, Camera, ChevronDown, MoreHorizontal, Search, Send } from 'lucide-react'
import { getSetting } from '../utils/storage'
import { callLLM } from '../utils/api'
import { renderMarkdown } from '../utils/markdown'

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [currentModel, setCurrentModel] = useState(null)
  const messagesEndRef = useRef(null)

  // 加载配置
  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    const assignment = await getSetting('modelAssignment', {})
    const configs = await getSetting('apiConfigs', [])
    
    if (assignment.chat && configs.length > 0) {
      const config = configs.find(c => c.id === assignment.chat.configId)
      if (config) {
        setCurrentModel({
          ...config,
          model: assignment.chat.model,
        })
      }
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading || !currentModel) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      // 构建消息数组
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }))

      // 获取系统提示词
      const systemPrompt = await getSetting('systemPrompt', '')

      // 调用 API
      const response = await callLLM(
        {
          endpoint: currentModel.endpoint,
          apiKey: currentModel.apiKey,
          model: currentModel.model,
        },
        apiMessages,
        { system: systemPrompt }
      )

      // 添加 AI 回复
      const assistantMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.content[0].text,
        timestamp: Date.now(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('API 调用失败:', error)
      // 显示错误消息
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `❌ 调用失败: ${error.message}`,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[100dvh]">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-paper-50/90 backdrop-blur-md border-b border-paper-200/50 px-4 py-3">
        <div className="flex items-center justify-between max-w-lg mx-auto">
          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-sm font-serif font-semibold text-ink truncate">日常对话</h1>
            <span className="text-[10px] text-ink-muted bg-paper-100 px-1.5 py-0.5 rounded-full">Kai</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-lg text-ink-muted hover:text-ink transition-colors">
              <Search size={16} />
            </button>
            <button className="p-1.5 rounded-lg text-ink-muted hover:text-ink transition-colors">
              <FileText size={16} />
            </button>
            <button className="p-1.5 rounded-lg text-ink-muted hover:text-ink transition-colors">
              <ArrowDown size={16} />
            </button>
          </div>
        </div>
      </div>

            {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        <div className="max-w-lg mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-ink-muted">开始新对话</p>
              {!currentModel && (
                <p className="text-xs text-red-400 mt-2">⚠️ 请先在设置中配置 API</p>
              )}
            </div>
          )}
          
          {messages.map(msg => {
            const isUser = msg.role === 'user'
            return (
              <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                {/* Avatar row */}
                <div className={`flex items-center gap-2 mb-1.5 ${isUser ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUser ? 'bg-accent/15' : 'bg-accent/20'
                  }`}>
                    <span className="text-xs font-serif text-accent">{isUser ? 'N' : 'K'}</span>
                  </div>
                  <span className="text-[11px] text-ink-muted">{isUser ? 'Nora' : 'Kai'}</span>
                </div>
                {/* Bubble */}
                <div className={`w-full rounded-neu-sm p-3 ${
                  isUser
                    ? 'bg-accent/10 shadow-neu-raised-sm'
                    : 'bg-paper-100 shadow-neu-raised-sm'
                }`}>
                  {isUser ? (
                    <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  ) : (
                    <div 
                      className="markdown-content"
                      dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                    />
                  )}
                </div>
              </div>
            )
          })}
          
          {loading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-serif text-accent">K</span>
                </div>
                <span className="text-[11px] text-ink-muted">Kai</span>
              </div>
              <div className="w-full rounded-neu-sm p-3 bg-paper-100 shadow-neu-raised-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-ink-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Bottom bar */}
      <div className="sticky bottom-16 z-30 bg-paper-50/90 backdrop-blur-md border-t border-paper-200/50 px-4 py-2.5">
        <div className="flex items-end gap-2 max-w-lg mx-auto">
          <button className="p-2 rounded-lg text-ink-muted hover:text-ink transition-colors flex-shrink-0">
            <Camera size={20} />
          </button>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            rows={1}
            className="flex-1 rounded-neu-sm bg-paper-100 shadow-neu-inset px-3 py-2 min-h-[40px] max-h-[120px] text-sm text-ink placeholder:text-ink-faint outline-none resize-none scrollbar-hide"
          />
          <button className="flex items-center gap-1 px-2 py-2 rounded-lg text-[10px] text-ink-muted hover:text-ink transition-colors flex-shrink-0">
            <span>{currentModel?.model?.split('-').pop() || '未配置'}</span>
            <ChevronDown size={12} />
          </button>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading || !currentModel}
            className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
              input.trim() && !loading && currentModel
                ? 'text-accent hover:text-accent-warm'
                : 'text-ink-faint'
            }`}
          >
            <Send size={20} />
          </button>
        </div>

        {/* More menu */}
        {showMore && (
          <div className="mt-2 max-w-lg mx-auto rounded-neu-sm bg-paper-50 shadow-neu-raised p-3 space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-ink rounded-lg hover:bg-paper-100 transition-colors">
              🗜️ 手动压缩
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-ink rounded-lg hover:bg-paper-100 transition-colors">
              🔍 搜索聊天记录
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-ink rounded-lg hover:bg-paper-100 transition-colors">
              📋 对话管理
            </button>
          </div>
        )}
      </div>
    </div>
  )
}