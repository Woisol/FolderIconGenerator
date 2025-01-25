import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import SideBarApp from './components/SideBar/AppSideBar'

function App() {
  const [curDir, setCurDir] = useState('')
  const [previewImg, setPreviewImg] = useState('')
  function handleCurDirChange(curDir: string) {
    setCurDir(curDir)
  }

  return (
    <SidebarProvider className=''>
      <SideBarApp curDir={curDir} handleCurDirChange={handleCurDirChange} />
      <main className='size-full p-1 flex flex-col items-center'>
        <div className="w-full">
          <SidebarTrigger className='size-10' />
        </div>
        <div className="relative w-full max-h-60">
          <img className='size-52 max-h-52 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' src={previewImg} alt="Preview" />
        </div>
      </main>
    </SidebarProvider>
  )
}

export default App
