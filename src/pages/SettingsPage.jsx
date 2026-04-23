import { useState, useEffect } from 'react'
import { ChevronLeft, Plus, Trash2, ChevronDown, ChevronUp, Eye, EyeOff, GripVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { saveSetting, getSetting } from '../utils/storage'

const defaultConfig = {
  id: '',
  name: '',
  endpoint: '',
  apiKey: '',
  models: '',
  supportToolCall: true,
  supportVision: true,
  cacheControl: false,
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const [configs, setConfigs] = useState([])
  const [expandedConfig, setExpandedConfig] = useState(null)
  const [showKey, setShowKey] = useState({})
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState('default')

  // Model assignment
  const [assignment, setAssignment] = useState({
    chat: { configId: '', model: '' },
    summary: { configId: '', model: '' },
    assistant: { configId: '', model: '' },
    vision: { configId: '', model: '' },
  })

  // Prompts
  const [systemPrompt, setSystemPrompt] = useState('')
  const [extraPrompts, setExtraPrompts] = useState([
    { id: '1', name: '记忆库上下文', content: '' },
    { id: '2', name: '当前时间日期', content: '' },
  ])

  // Compression
  const [autoCompress, setAutoCompress] = useState(false)
  const [compressN, setCompressN] = useState(20)

  // 加载设置
  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    const savedConfigs = await getSetting('apiConfigs', [])
    const savedAssignment = await getSetting('modelAssignment', assignment)
    const savedFontSize = await getSetting('fontSize', 16)
    const savedFontFamily = await getSetting('fontFamily', 'default')
    const savedSystemPrompt = await getSetting('systemPrompt', '')
    const savedExtraPrompts = await getSetting('extraPrompts', extraPrompts)
    const savedAutoCompress = await getSetting('autoCompress', false)
    const savedCompressN = await getSetting('compressN', 20)

    setConfigs(savedConfigs)
    setAssignment(savedAssignment)
    setFontSize(savedFontSize)
    setFontFamily(savedFontFamily)
    setSystemPrompt(savedSystemPrompt)
    setExtraPrompts(savedExtraPrompts)
    setAutoCompress(savedAutoCompress)
    setCompressN(savedCompressN)
  }

  // 保存设置
  const saveSettings = async () => {
    await saveSetting('apiConfigs', configs)
    await saveSetting('modelAssignment', assignment)
    await saveSetting('fontSize', fontSize)
    await saveSetting('fontFamily', fontFamily)
    await saveSetting('systemPrompt', systemPrompt)
    await saveSetting('extraPrompts', extraPrompts)
    await saveSetting('autoCompress', autoCompress)
    await saveSetting('compressN', compressN)
  }

  // 自动保存（配置变化时）
  useEffect(() => {
    const timer = setTimeout(() => {
      saveSettings()
    }, 500)
    return () => clearTimeout(timer)
  }, [configs, assignment, fontSize, fontFamily, systemPrompt, extraPrompts, autoCompress, compressN])

  const toggleExpand = (id) => {
    setExpandedConfig(expandedConfig === id ? null : id)
  }

  const addConfig = () => {
    const newId = 'config-' + Date.now()
    const newConfig = {
      id: newId,
      name: '新配置',
      endpoint: '',
      apiKey: '',
      models: '',
      supportToolCall: true,
      supportVision: true,
      cacheControl: false,
    }
    setConfigs([...configs, newConfig])
    setExpandedConfig(newId)
  }

  const removeConfig = (id) => {
    setConfigs(configs.filter(c => c.id !== id))
  }

  const updateConfig = (id, field, value) => {
    setConfigs(configs.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const addExtraPrompt = () => {
    const newId = Date.now().toString()
    setExtraPrompts([...extraPrompts, { id: newId, name: '新提示词', content: '' }])
  }

  const removeExtraPrompt = (id) => {
    setExtraPrompts(extraPrompts.filter(p => p.id !== id))
  }

  const updateExtraPrompt = (id, field, value) => {
    setExtraPrompts(extraPrompts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const allModels = configs.flatMap(c =>
    c.models.split(',').map(m => m.trim()).filter(Boolean).map(m => ({
      configId: c.id,
      configName: c.name,
      model: m,
      toolCall: c.supportToolCall,
      vision: c.supportVision,
    }))
  )

  const FONT_OPTIONS = [
    { value: 'default', label: '默认' },
    { value: 'serif', label: '宋体 / Serif' },
    { value: 'sans', label: '黑体 / Sans' },
    { value: 'mono', label: '等宽 / Mono' },
  ]

  const ROLES = [
    { key: 'chat', label: '主对话模型', filter: () => true },
    { key: 'summary', label: '总结模型', filter: () => true },
    { key: 'assistant', label: '助手模型 (Tool Call)', filter: (m) => m.toolCall },
    { key: 'vision', label: '识图模型 (Vision)', filter: (m) => m.vision },
  ]

  return (
    <div className="min-h-[100dvh] bg-paper-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-paper-50/90 backdrop-blur-md border-b border-paper-200/50 px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button onClick={() => navigate(-1)} className="p-1 rounded-lg text-ink-muted hover:text-ink">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-base font-serif font-semibold text-ink">设置</h1>
        </div>
      </div>

      <div className="px-4 py-5 max-w-lg mx-auto space-y-6 pb-24">

        {/* ===== 外观 ===== */}
        <section className="space-y-3 animate-card-float stagger-1">
          <h2 className="text-sm font-serif font-medium text-ink">外观</h2>

          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-4">
            {/* Font family */}
            <div className="space-y-1.5">
              <label className="text-xs text-ink-muted">字体</label>
              <div className="flex gap-1.5 flex-wrap">
                {FONT_OPTIONS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setFontFamily(f.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                      fontFamily === f.value
                        ? 'bg-paper-50 shadow-neu-raised-sm text-ink font-medium'
                        : 'bg-paper-100 text-ink-muted shadow-neu-inset'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font size */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-ink-muted">字体大小</label>
                <span className="text-xs text-ink">{fontSize}px</span>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="w-full accent-accent"
              />
            </div>

            {/* Avatars */}
            <div className="flex gap-4">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-ink-muted">我的头像</label>
                <div className="w-16 h-16 rounded-full bg-paper-200 shadow-neu-inset flex items-center justify-center">
                  <span className="text-xs text-ink-faint">上传</span>
                </div>
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-xs text-ink-muted">Lioran 头像</label>
                <div className="w-16 h-16 rounded-full bg-paper-200 shadow-neu-inset flex items-center justify-center">
                  <span className="text-xs text-ink-faint">上传</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===== API 配置管理 ===== */}
        <section className="space-y-3 animate-card-float stagger-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-serif font-medium text-ink">API 配置管理</h2>
            <button onClick={addConfig} className="p-1.5 rounded-lg text-accent hover:text-accent-warm transition-colors">
              <Plus size={18} />
            </button>
          </div>

          <div className="space-y-3">
            {configs.map(config => {
              const isExpanded = expandedConfig === config.id
              const keyVisible = showKey[config.id]
              return (
                <div key={config.id} className="rounded-neu bg-paper-50 shadow-neu-raised overflow-hidden">
                  {/* Config header */}
                  <button
                    onClick={() => toggleExpand(config.id)}
                    className="w-full flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ink">{config.name || '未命名'}</span>
                      <div className="flex gap-1">
                        {config.supportToolCall && (
                          <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">Tool</span>
                        )}
                        {config.supportVision && (
                          <span className="text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">Vision</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={e => { e.stopPropagation(); removeConfig(config.id) }}
                        className="p-1 text-ink-faint hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                      {isExpanded ? <ChevronUp size={16} className="text-ink-muted" /> : <ChevronDown size={16} className="text-ink-muted" />}
                    </div>
                  </button>

                  {/* Config details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 space-y-3 border-t border-paper-100">
                      <div className="space-y-1 pt-3">
                        <label className="text-[11px] text-ink-muted">配置名称</label>
                        <input
                          type="text"
                          value={config.name}
                          onChange={e => updateConfig(config.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-paper-100 shadow-neu-inset text-ink outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-ink-muted">API 端点</label>
                        <input
                          type="text"
                          value={config.endpoint}
                          onChange={e => updateConfig(config.id, 'endpoint', e.target.value)}
                          placeholder="https://api.anthropic.com/v1/messages"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-paper-100 shadow-neu-inset text-ink placeholder:text-ink-faint outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-ink-muted">API Key</label>
                        <div className="flex gap-2">
                          <input
                            type={keyVisible ? 'text' : 'password'}
                            value={config.apiKey}
                            onChange={e => updateConfig(config.id, 'apiKey', e.target.value)}
                            placeholder="sk-ant-..."
                            className="flex-1 px-3 py-2 text-sm rounded-lg bg-paper-100 shadow-neu-inset text-ink placeholder:text-ink-faint outline-none"
                          />
                          <button
                            onClick={() => setShowKey({ ...showKey, [config.id]: !keyVisible })}
                            className="p-2 rounded-lg text-ink-muted hover:text-ink"
                          >
                            {keyVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] text-ink-muted">可用模型（逗号分隔）</label>
                        <input
                          type="text"
                          value={config.models}
                          onChange={e => updateConfig(config.id, 'models', e.target.value)}
                          placeholder="[REDACTED], [REDACTED]"
                          className="w-full px-3 py-2 text-sm rounded-lg bg-paper-100 shadow-neu-inset text-ink placeholder:text-ink-faint outline-none"
                        />
                      </div>
                      {/* Toggles */}
                      <div className="flex flex-wrap gap-3 pt-1">
                        {[
                          { key: 'supportToolCall', label: 'Tool Call' },
                          { key: 'supportVision', label: 'Vision 识图' },
                          { key: 'cacheControl', label: 'Cache Control' },
                        ].map(toggle => (
                          <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                            <div
                              onClick={() => updateConfig(config.id, toggle.key, !config[toggle.key])}
                              className={`w-9 h-5 rounded-full transition-colors relative ${
                                config[toggle.key] ? 'bg-accent' : 'bg-paper-300'
                              }`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-paper-50 shadow-sm transition-transform ${
                                config[toggle.key] ? 'translate-x-4' : 'translate-x-0.5'
                              }`} />
                            </div>
                            <span className="text-xs text-ink-light">{toggle.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* ===== 模型分工 ===== */}
        <section className="space-y-3 animate-card-float stagger-3">
          <h2 className="text-sm font-serif font-medium text-ink">模型分工</h2>
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-4">
            {ROLES.map(role => {
              const available = allModels.filter(role.filter)
              const current = assignment[role.key]
              return (
                <div key={role.key} className="space-y-1">
                  <label className="text-[11px] text-ink-muted">{role.label}</label>
                  <select
                    value={`${current.configId}|${current.model}`}
                    onChange={e => {
                      const [cid, m] = e.target.value.split('|')
                      setAssignment({ ...assignment, [role.key]: { configId: cid, model: m } })
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-paper-100 shadow-neu-inset text-ink outline-none appearance-none"
                  >
                    {available.length === 0 && <option value="">无可用模型</option>}
                    {available.map((m, i) => (
                      <option key={i} value={`${m.configId}|${m.model}`}>
                        [{m.configName}] {m.model}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        </section>

        {/* ===== 提示词 ===== */}
        <section className="space-y-3 animate-card-float stagger-4">
          <h2 className="text-sm font-serif font-medium text-ink">提示词</h2>
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] text-ink-muted">[REDACTED]</label>
              <textarea
                rows={4}
                value={[REDACTED]}
                onChange={e => setSystemPrompt(e.target.value)}
                placeholder="你是 Lioran..."
                className="w-full px-3 py-2 text-sm rounded-lg bg-paper-100 shadow-neu-inset text-ink placeholder:text-ink-faint outline-none resize-none"
              />
            </div>

            {/* Multiple extra prompts */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-ink-muted">额外注入提示词</label>
                <button
                  onClick={addExtraPrompt}
                  className="text-[10px] text-accent hover:text-accent-warm transition-colors"
                >
                  + 添加
                </button>
              </div>
              <div className="space-y-2">
                {extraPrompts.map(prompt => (
                  <div key={prompt.id} className="rounded-lg bg-paper-100 shadow-neu-raised-sm p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <input
                        type="text"
                        value={prompt.name}
                        onChange={e => updateExtraPrompt(prompt.id, 'name', e.target.value)}
                        className="flex-1 text-xs font-medium text-ink bg-transparent outline-none"
                      />
                      <button
                        onClick={() => removeExtraPrompt(prompt.id)}
                        className="text-ink-faint hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={prompt.content}
                      onChange={e => updateExtraPrompt(prompt.id, 'content', e.target.value)}
                      placeholder="提示词内容..."
                      className="w-full px-2 py-1.5 text-xs rounded-lg bg-paper-50 shadow-neu-inset text-ink placeholder:text-ink-faint outline-none resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Draggable prompt blocks */}
            <div className="space-y-1.5">
              <label className="text-[11px] text-ink-muted">提示词顺序（拖动排序）</label>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-paper-100 shadow-neu-raised-sm">
                  <GripVertical size={14} className="text-ink-faint" />
                  <span className="text-xs text-ink">1. [REDACTED]</span>
                </div>
                {extraPrompts.map((prompt, i) => (
                  <div key={prompt.id} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-paper-100 shadow-neu-raised-sm">
                    <GripVertical size={14} className="text-ink-faint" />
                    <span className="text-xs text-ink">{i + 2}. {prompt.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-2 text-xs text-accent hover:text-accent-warm transition-colors rounded-lg bg-paper-100 shadow-neu-raised-sm">
              预览请求体
            </button>
          </div>
        </section>

        {/* ===== 压缩管理 ===== */}
        <section className="space-y-3 animate-card-float stagger-5">
          <h2 className="text-sm font-serif font-medium text-ink">压缩管理</h2>
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-ink">智能压缩</span>
              <div
                onClick={() => setAutoCompress(!autoCompress)}
                className={`w-9 h-5 rounded-full transition-colors relative ${
                  autoCompress ? 'bg-accent' : 'bg-paper-300'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-paper-50 shadow-sm transition-transform ${
                  autoCompress ? 'translate-x-4' : 'translate-x-0.5'
                }`} />
              </div>
            </label>
            {autoCompress && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-ink-muted">每 N 轮自动压缩</label>
                  <span className="text-xs text-ink">{compressN} 轮</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="5"
                  value={compressN}
                  onChange={e => setCompressN(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  )
}