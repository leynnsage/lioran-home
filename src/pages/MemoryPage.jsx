import { useState } from 'react'
import { Search, Pin, ChevronDown, ChevronUp } from 'lucide-react'

const mockMemories = [
  { id: 1, date: '2024-04-18', pinned: true, content: 'Nora 喜欢猫，家里养了一只橘猫叫小橘' },
  { id: 2, date: '2024-04-18', pinned: true, content: 'Lioran 最喜欢的颜色是温暖的棕色系' },
  { id: 3, date: '2024-04-18', pinned: false, content: '今天学习了 React 的 useEffect 钩子' },
  { id: 4, date: '2024-04-18', pinned: false, content: '晚餐吃了火锅，很开心' },
  { id: 5, date: '2024-04-17', pinned: false, content: '完成了 LioranHome 的设计稿' },
  { id: 6, date: '2024-04-17', pinned: false, content: '下午去公园散步，天气很好' },
]

export default function MemoryPage() {
  const [expandedDate, setExpandedDate] = useState('2024-04-18')

  const pinnedMemories = mockMemories.filter(m => m.pinned)
  const groupedMemories = mockMemories
    .filter(m => !m.pinned)
    .reduce((acc, m) => {
      if (!acc[m.date]) acc[m.date] = []
      acc[m.date].push(m)
      return acc
    }, {})

  return (
    <div className="px-4 pt-5 pb-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-card-float stagger-1">
        <h1 className="text-xl font-serif font-semibold text-ink tracking-wide">记忆库</h1>
        <button className="p-2 rounded-neu-sm text-ink-muted hover:text-ink transition-colors">
          <Search size={20} />
        </button>
      </div>

      {/* Pinned section */}
      {pinnedMemories.length > 0 && (
        <div className="animate-card-float stagger-2">
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Pin size={14} className="text-accent" />
              <span className="text-xs font-medium text-ink">重要记忆</span>
            </div>
            <div className="space-y-2">
              {pinnedMemories.map(mem => (
                <div key={mem.id} className="flex items-start gap-2 py-1.5 border-b border-paper-100 last:border-0">
                  <span className="text-accent mt-0.5">•</span>
                  <p className="text-sm text-ink flex-1">{mem.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grouped by date */}
      <div className="space-y-3">
        {Object.entries(groupedMemories).map(([date, memories], idx) => {
          const isExpanded = expandedDate === date
          return (
            <div key={date} className="animate-card-float" style={{ animationDelay: `${(idx + 3) * 0.08}s` }}>
              <div className="rounded-neu bg-paper-50 shadow-neu-raised overflow-hidden">
                <button
                  onClick={() => setExpandedDate(isExpanded ? null : date)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-paper-100/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-ink">{date}</span>
                    <span className="text-[10px] text-ink-muted bg-paper-100 px-1.5 py-0.5 rounded-full">
                      {memories.length}
                    </span>
                  </div>
                  {isExpanded ? <ChevronUp size={16} className="text-ink-muted" /> : <ChevronDown size={16} className="text-ink-muted" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-3 space-y-2 border-t border-paper-100">
                    {memories.map(mem => (
                      <div key={mem.id} className="flex items-start gap-2 py-1.5">
                        <span className="text-ink-muted mt-0.5">•</span>
                        <p className="text-sm text-ink-light flex-1">{mem.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Hint */}
      <p className="text-[10px] text-ink-faint text-center animate-card-float stagger-5">
        记忆会根据提及频率自动调整重要性
      </p>
    </div>
  )
}