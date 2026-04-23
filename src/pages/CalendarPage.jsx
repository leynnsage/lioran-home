import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const mockEvents = [
  { id: 1, date: 18, time: '14:00', title: '下午会议' },
  { id: 2, date: 18, time: '18:00', title: '晚餐' },
  { id: 3, date: 20, time: '10:00', title: '项目评审' },
  { id: 4, date: 25, time: '15:30', title: '医院体检' },
]

const daysInMonth = 30
const firstDayOfWeek = 2 // 0=Sun, 1=Mon, ...

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(18)

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const blanks = Array.from({ length: firstDayOfWeek }, (_, i) => i)
  const todayEvents = mockEvents.filter(e => e.date === selectedDate)

  return (
    <div className="px-4 pt-5 pb-4 max-w-lg mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between animate-card-float stagger-1">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-serif font-semibold text-ink tracking-wide">2025年4月</h1>
          <div className="flex gap-1">
            <button className="p-1 rounded-lg text-ink-muted hover:text-ink transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button className="p-1 rounded-lg text-ink-muted hover:text-ink transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <button className="p-2 rounded-neu-sm text-accent hover:text-accent-warm transition-colors">
          <Plus size={20} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="animate-card-float stagger-2">
        <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-[10px] text-ink-muted font-medium py-1">
                {day}
              </div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {blanks.map(i => (
              <div key={`blank-${i}`} className="aspect-square" />
            ))}
            {days.map(day => {
              const hasEvent = mockEvents.some(e => e.date === day)
              const isSelected = day === selectedDate
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                    isSelected
                      ? 'bg-accent text-paper-50 shadow-neu-raised-sm'
                      : hasEvent
                      ? 'bg-paper-100 text-ink font-medium'
                      : 'text-ink-light hover:bg-paper-100/50'
                  }`}
                >
                  <span>{day}</span>
                  {hasEvent && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-accent mt-0.5" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Events list */}
      <div className="animate-card-float stagger-3">
        <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-3">
          <h2 className="text-xs font-medium text-ink-muted">
            {selectedDate}日 的日程 {todayEvents.length > 0 && `(${todayEvents.length})`}
          </h2>
          {todayEvents.length > 0 ? (
            <div className="space-y-2">
              {todayEvents.map(event => (
                <div key={event.id} className="flex items-center gap-3 py-2 border-b border-paper-100 last:border-0">
                  <span className="text-xs text-ink-muted w-12 flex-shrink-0">{event.time}</span>
                  <span className="text-sm text-ink flex-1">{event.title}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-muted italic">暂无日程</p>
          )}
          <button className="w-full py-2 text-xs text-accent hover:text-accent-warm transition-colors">
            + 添加日程
          </button>
        </div>
      </div>
    </div>
  )
}