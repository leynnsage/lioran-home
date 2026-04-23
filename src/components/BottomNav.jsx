import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Warehouse, MessageSquare, Brain, CalendarDays } from 'lucide-react'

const tabs = [
  { path: '/', label: '主页', icon: Home },
  { path: '/room', label: '房间', icon: Warehouse },
  { path: '/chat', label: '聊天', icon: MessageSquare },
  { path: '/memory', label: '记忆', icon: Brain },
  { path: '/calendar', label: '日历', icon: CalendarDays },
]

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-paper-100/90 backdrop-blur-md border-t border-paper-200/50 flex items-center justify-around px-6 z-50">
      {tabs.map(({ path, label, icon: Icon }) => {
        const active = location.pathname === path
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-0.5 px-5 py-1.5 rounded-neu-sm transition-all duration-200 ${
              active
                ? 'shadow-neu-inset text-accent'
                : 'text-ink-muted hover:text-ink-light'
            }`}
          >
            <Icon size={22} strokeWidth={active ? 2 : 1.5} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}