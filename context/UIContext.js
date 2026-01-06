'use client'

import { createContext, useContext, useState, useEffect } from 'react'

// Crear el contexto para el tema y notificaciones
const UIContext = createContext()

// Hook personalizado para usar el contexto
export function useUI() {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI debe usarse dentro de UIProvider')
  }
  return context
}

// Provider del contexto
export function UIProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [theme, setTheme] = useState('dark')
  const [mounted, setMounted] = useState(false)
  
  // useEffect para indicar que el componente está montado (solo cliente)
  useEffect(() => {
    setMounted(true)
    // Cargar preferencias del usuario solo en el cliente
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])
  
  // useEffect para guardar cambios de tema
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('theme', theme)
    }
  }, [theme, mounted])
  
  // Añadir notificación
  const addNotification = (message, type = 'info') => {
    const id = Date.now()
    setNotifications(prev => [...prev, { id, message, type }])
    
    // Auto-remover después de 3 segundos
    setTimeout(() => {
      removeNotification(id)
    }, 3000)
  }
  
  // Remover notificación
  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }
  
  const value = {
    notifications,
    addNotification,
    removeNotification,
    theme,
    setTheme,
  }
  
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}
