import { useState } from 'react'
import Layout from './components/Layout'

import Agenda from './pages/Agenda'
import Patients from './pages/Patients'
import Finance from './pages/Finance'
import Treatments from './pages/Treatments'
import Settings from './pages/Settings'

function App(): JSX.Element {
  const [currentView, setCurrentView] = useState('agenda')

  // Lógica simple para renderizar la vista actual
  const renderView = () => {
    switch (currentView) {
      case 'agenda':
        return <Agenda />
      case 'patients':
        return <Patients />
      case 'finance':
        return <Finance />
      case 'treatments':
        return <Treatments />
      case 'settings':
        return <Settings />
      default:
        return <Agenda />
    }
  }

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {renderView()}
    </Layout>
  )
}

export default App
