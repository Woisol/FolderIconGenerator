import { useState } from 'react'
import { SidebarProvider } from './components/ui/sidebar'
import AppSideBar from './components/SideBar/AppSideBar'

function App() {

  return (
    <SidebarProvider>
      <AppSideBar />
      <main className='bg-black'>
      </main>
    </SidebarProvider>
  )
}

export default App
