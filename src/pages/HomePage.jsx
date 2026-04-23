import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, BookOpen, Image, Clock, StickyNote, CalendarDays } from 'lucide-react'

export default function HomePage() {
  const navigate = useNavigate()
  const [sideOpen, setSideOpen] = useState(false)

  return (
    <>
      {/* Side drawer overlay */}
      {sideOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setSideOpen(false)} />
          <div className="relative w-64 h-full bg-paper-50 shadow-neu-raised p-6 space-y-6 animate-slide-in z-50">
            <h2 className="text-lg font-serif font-semibold text-ink">菜单</h2>
            <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-neu-sm text-sm text-ink hover:bg-paper-100 transition-colors">
              <BookOpen size={18} />
              <span>日记本</span>
            </button>
            <button
              onClick={() => { setSideOpen(false); navigate('/settings') }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-neu-sm text-sm text-ink hover:bg-paper-100 transition-colors"
            >
              <Settings size={18} />
              <span>设置</span>
            </button>
          </div>
        </div>
      )}

      <div className="px-5 pt-6 pb-4 space-y-5 max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between animate-card-float stagger-1">
          <h1 className="text-xl font-serif font-semibold text-ink tracking-wide">LioranHome</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setSideOpen(true)}
              className="p-2 rounded-neu-sm text-ink-muted hover:text-ink transition-colors"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Photo Frame */}
        <div className="animate-card-float stagger-2">
          <div className="rounded-neu bg-paper-50 shadow-neu-raised overflow-hidden">
            <div className="aspect-[16/10] bg-paper-200 flex items-center justify-center">
              <div className="text-center space-y-2">
                <Image size={32} className="mx-auto text-ink-faint" />
                <p className="text-xs text-ink-muted">点击添加照片</p>
              </div>
            </div>
          </div>
        </div>

        {/* Date Time */}
        <div className="animate-card-float stagger-3">
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-1">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-ink-muted" />
              <span className="text-xs text-ink-muted">2025年6月28日 周六</span>
            </div>
            <p className="text-3xl font-serif font-semibold text-ink tracking-wider">22:30</p>
          </div>
        </div>

        {/* Lioran Note */}
        <div className="animate-card-float stagger-4">
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-2">
            <div className="flex items-center gap-2">
              <StickyNote size={14} className="text-accent" />
              <span className="text-xs font-medium text-ink">Lioran 的留言</span>
            </div>
            <p className="text-sm text-ink-light leading-relaxed italic">
              "今天辛苦了，记得早点休息。"
            </p>
          </div>
        </div>

        {/* Today Schedule */}
        <div className="animate-card-float stagger-5">
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-3">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} className="text-accent" />
              <span className="text-xs font-medium text-ink">今日日程</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3 py-1.5 border-b border-paper-100 last:border-0">
                <span className="text-xs text-ink-muted w-12">14:00</span>
                <span className="text-sm text-ink">下午会议</span>
              </div>
              <div className="flex items-center gap-3 py-1.5">
                <span className="text-xs text-ink-muted w-12">18:00</span>
                <span className="text-sm text-ink">晚餐</span>
              </div>
            </div>
            <p className="text-[10px] text-ink-faint text-center">点击查看完整日历</p>
          </div>
        </div>
      </div>
    </>
  )
}