import { Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import HomePage from './pages/HomePage'
import RoomPage from './pages/RoomPage'
import ChatPage from './pages/ChatPage'
import MemoryPage from './pages/MemoryPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-paper-50">
      <main className="flex-1 overflow-y-auto pb-20 scrollbar-hide">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/room" element={<RoomPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/memory" element={<MemoryPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}