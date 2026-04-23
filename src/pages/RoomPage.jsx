import { useState } from 'react'
import { Gift, ChevronLeft, ChevronRight } from 'lucide-react'

const ROOMS = [
  { id: 'living', label: '客厅' },
  { id: 'studio', label: '卧室' },
  { id: 'kitchen', label: '餐厅' },
  { id: 'balcony', label: '阳台' },
]

const SPOTS = {
  living: ['沙发', '书柜', '茶几', '窗边', '小猫'],
  studio: ['书桌', '豆袋', '架子', '窗边', '床'],
  kitchen: ['灶台', '冰箱', '酒柜', '零食柜', '吧台'],
  balcony: ['躺椅', '洗衣机', '晾衣绳'],
}

export default function RoomPage() {
  const [activeRoom, setActiveRoom] = useState('living')
  const [showFav, setShowFav] = useState(false)

  const room = ROOMS.find(r => r.id === activeRoom)
  const idx = ROOMS.findIndex(r => r.id === activeRoom)

  return (
    <>
      {/* Favorites modal */}
      {showFav && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 backdrop-blur-sm" onClick={() => setShowFav(false)}>
          <div className="bg-paper-50 rounded-t-[24px] shadow-neu-raised w-full max-w-lg p-5 pb-8 space-y-4 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-serif font-semibold text-ink">收藏夹</h2>
              <button onClick={() => setShowFav(false)} className="text-ink-muted text-sm">关闭</button>
            </div>
            <div className="space-y-3">
              <div className="rounded-neu-sm bg-paper-100 shadow-neu-raised-sm p-3 flex items-center gap-3">
                <span className="text-lg">🎮</span>
                <div>
                  <p className="text-sm font-medium text-ink">贪吃蛇游戏</p>
                  <p className="text-[10px] text-ink-muted">HTML 小游戏</p>
                </div>
              </div>
              <div className="rounded-neu-sm bg-paper-100 shadow-neu-raised-sm p-3 flex items-center gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <p className="text-sm font-medium text-ink">数据可视化</p>
                  <p className="text-[10px] text-ink-muted">D3.js 图表</p>
                </div>
              </div>
              <div className="rounded-neu-sm bg-paper-100 shadow-neu-inset p-3 flex items-center justify-center">
                <p className="text-xs text-ink-muted">+ 添加收藏</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-4 pt-5 pb-4 max-w-lg mx-auto space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between animate-card-float stagger-1">
          <h1 className="text-xl font-serif font-semibold text-ink tracking-wide">Home</h1>
          <button
            onClick={() => setShowFav(true)}
            className="p-2 rounded-neu-sm text-ink-muted hover:text-accent transition-colors"
          >
            <Gift size={20} />
          </button>
        </div>

        {/* Room tabs */}
        <div className="animate-card-float stagger-2">
          <div className="flex gap-1 bg-paper-100 rounded-neu-sm shadow-neu-inset p-1">
            {ROOMS.map(r => (
              <button
                key={r.id}
                onClick={() => setActiveRoom(r.id)}
                className={`flex-1 px-2.5 py-1.5 text-xs rounded-lg transition-all duration-200 ${
                  activeRoom === r.id
                    ? 'bg-paper-50 shadow-neu-raised-sm text-ink font-medium'
                    : 'text-ink-muted'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room image placeholder */}
        <div className="animate-card-float stagger-3">
          <div className="rounded-neu bg-paper-50 shadow-neu-raised overflow-hidden relative">
            <div className="aspect-[16/10] bg-paper-200 flex items-center justify-center">
              <p className="text-sm text-ink-muted">{room.label} 图片</p>
            </div>
            {/* Nav arrows */}
            <button
              onClick={() => setActiveRoom(ROOMS[(idx - 1 + ROOMS.length) % ROOMS.length].id)}
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-paper-50/80 shadow-neu-raised-sm"
            >
              <ChevronLeft size={16} className="text-ink-muted" />
            </button>
            <button
              onClick={() => setActiveRoom(ROOMS[(idx + 1) % ROOMS.length].id)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-paper-50/80 shadow-neu-raised-sm"
            >
              <ChevronRight size={16} className="text-ink-muted" />
            </button>
            {/* Hotspots */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-3">
              {SPOTS[activeRoom].map(spot => (
                <span key={spot} className="px-2 py-0.5 text-[10px] bg-paper-50/80 rounded-full text-ink-light shadow-neu-flat">
                  {spot}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Status panel */}
        <div className="animate-card-float stagger-4">
          <div className="rounded-neu bg-paper-50 shadow-neu-raised p-4 space-y-2">
            <h3 className="text-xs font-medium text-ink-muted">状态</h3>
            <p className="text-sm text-ink">Kai 正在客厅的沙发上休息</p>
            <p className="text-[10px] text-ink-faint">点击房间中的热区查看详情</p>
          </div>
        </div>
      </div>
    </>
  )
}