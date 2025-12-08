import { useState } from 'react'
import Layout from './components/Layout'

import Agenda from './pages/Agenda'
import Patients from './pages/Patients'
import PatientDetail from './pages/PatientDetail'
import Finance from './pages/Finance'
import Treatments from './pages/Treatments'
import Settings from './pages/Settings'

function App(): JSX.Element {
  const [navState, setNavState] = useState<{ view: string; data?: any }>({
    view: 'agenda'
  })

  // Función helper para navegar
  const handleNavigate = (view: string, data?: any) => {
    setNavState({ view, data })
  }

  const renderView = () => {
    switch (navState.view) {
      case 'agenda':
        return <Agenda />

      case 'patients':
        return <Patients onPatientClick={(id) => handleNavigate('patient-detail', id)} />

      case 'patient-detail':
        return <PatientDetail patientId={navState.data} onBack={() => handleNavigate('patients')} />

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
    <Layout currentView={navState.view} onNavigate={(v) => handleNavigate(v)}>
      {renderView()}
    </Layout>
  )
}

export default App
