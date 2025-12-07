import { useState } from 'react'
import { CalendarDays, Users, Wallet, Stethoscope, Settings, Menu } from 'lucide-react'
import { cn } from '../lib/utils'

interface LayoutProps {
  children: React.ReactNode
  currentView: string
  onNavigate: (view: string) => void
}

export default function Layout({ children, currentView, onNavigate }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    { id: 'agenda', label: 'Agenda', icon: <CalendarDays size={20} /> },
    { id: 'patients', label: 'Pacientes', icon: <Users size={20} /> },
    { id: 'finance', label: 'Caja', icon: <Wallet size={20} /> },
    { id: 'treatments', label: 'Tratamientos', icon: <Stethoscope size={20} /> },
    { id: 'settings', label: 'Configuración', icon: <Settings size={20} /> }
  ]

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className={cn(
          'bg-white border-r border-slate-200 transition-all duration-300 flex flex-col',
          isCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo / Header Sidebar */}
        <div className="h-16 flex items-center justify-center border-b border-slate-100">
          <div
            className={cn(
              'flex items-center gap-2 transition-opacity',
              isCollapsed ? 'hidden' : 'flex'
            )}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="font-bold text-lg text-slate-800">Dental Mgr.</span>
          </div>
          {isCollapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
              DM
            </div>
          )}
        </div>

        {/* Navegación */}
        <nav className="flex-1 py-6 px-2 space-y-1">
          {menuItems.map((item) => {
            const isActive = currentView === item.id
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900',
                  isCollapsed && 'justify-center px-0'
                )}
                title={isCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* Footer Sidebar (Colapsar) */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2 rounded-md hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 overflow-auto relative">
        {/* Aquí se renderizan las páginas */}
        {children}
      </main>
    </div>
  )
}
