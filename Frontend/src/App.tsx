import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import SideBarApp from './components/SideBar/AppSideBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Select, Slider, Text } from './components/PropsCard/Props'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'

function App() {
  const [curDir, setCurDir] = useState('')
  const [presets, setPresets] = useState<string[]>(["蓝色", "绿色", "紫色"])
  const [previewImg, setPreviewImg] = useState('')
  function handleCurDirChange(curDir: string) {
    setCurDir(curDir)
  }

  return (
    <SidebarProvider className=''>
      <SideBarApp curDir={curDir} handleCurDirChange={handleCurDirChange} />
      <main className='w-full h-screen p-4 flex flex-col items-center'>
        <div className="w-full">
          <SidebarTrigger className='size-10' />
        </div>
        {/* @todo Resizable To Implement */}
        <ResizablePanelGroup direction='vertical'>
          <ResizablePanel className="relative w-full min-h-20 max-h60 p-8">
            <img className='h-full max-h-52 mx-auto' src={previewImg} alt="Preview" />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel>
            <Card className='size-full'>
              <CardHeader>
                <CardTitle>Props</CardTitle>
                <CardDescription>Icon生成配置</CardDescription>
              </CardHeader>
              <CardContent className='gap-5 grid grid-cols-3 grid-rows-2'>
                {/* //** 预设 */}
                <Select title='预设' options={presets} />
                <div></div>
                <Text title='背景图片路径' value={""} handleValueChange={() => { }} />
                {/* //** content */}
                {/* @todo Plenties To Implement */}
                <Text title='文字' value={""} handleValueChange={() => { }} />
                <Slider title='字体大小' defaultValue={16} min={1} max={50} step={1} value={1} handleValueChange={() => { }} />
                <Text title='格式字符' value={""} handleValueChange={() => { }} />
                {/* //** DecImg */}
                <Text title='图标路径' value={""} handleValueChange={() => { }} />
                <Slider title='图标大小' defaultValue={50} min={20} max={1000} step={5} value={20} handleValueChange={() => { }} />
                <Slider title='y轴偏移' defaultValue={10} min={-1000} max={1000} step={10} value={10} handleValueChange={() => { }} />
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
    </SidebarProvider>
  )
}

export default App
