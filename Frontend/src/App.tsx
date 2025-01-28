import { useState } from 'react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import SideBarApp from './components/SideBar/AppSideBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Select, Slider, Text } from './components/PropsCard/Props'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { Form, FormField } from './components/ui/form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'

function App() {
  const [curDir, setCurDir] = useState('')
  const [presets, setPresets] = useState<string[]>(["蓝色", "绿色", "紫色"])
  const [previewImg, setPreviewImg] = useState('')
  const formSchema = z.object({
    dir: z.string().optional(),
    preset: z.string().optional(),
    baseIconPath: z.string().optional(),
    content: z.string().optional(),
    fontSize: z.number().optional(),
    formator: z.string().optional(),
    decorateIconPath: z.string().optional(),
    decImgSize: z.number().optional(),
    yOffset: z.number().optional(),
  })
  const form = useForm<z.infer<typeof formSchema>>({
    // !要引入文档里面的@hookform/resolvers/zod和zod……
    resolver: zodResolver(formSchema),
    defaultValues: {
    }
  })
  function onSubmit(values: z.infer<typeof formSchema>) {
    // console.log(values)
    toast("生成中")

  }
  function handleCurDirChange(curDir: string) {
    setCurDir(curDir)
    form.setValue('dir', curDir)

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
            <Card className='size-full overflow-y-auto'>
              <CardHeader>
                <CardTitle>Props</CardTitle>
                <CardDescription>Icon生成配置</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className='gap-5 grid grid-cols-3 grid-rows-2'>
                    {/* <FormField control={form.control} name='IconProps' render={({ filed }) => (
                    <> */}
                    {/* //** 预设 */}
                    <Select form={form} title='预设' name='preset' options={presets} />
                    <div></div>
                    <Text form={form} title='背景图片路径' name='baseIconPath' />
                    {/* //** content */}
                    {/* @todo Plenties To Implement */}
                    <Text form={form} title='文字' name='content' />
                    <Slider form={form} title='字体大小' name='fontSize' defaultValue={16} min={1} max={50} step={1} />
                    <Text form={form} title='格式字符' name='formator' />
                    {/* //** DecImg */}
                    <Text form={form} title='图标路径' name='decorateIconPath' />
                    <Slider form={form} title='图标大小' name='decImgSize' defaultValue={50} min={20} max={1000} step={5} />
                    <Slider form={form} title='y轴偏移' name='yOffset' defaultValue={10} min={-1000} max={1000} step={10} />
                    {/* </> */}
                    {/* // )}> */}
                    {/* </FormField> */}
                    <Input type='submit' value='生成' />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <Toaster />
    </SidebarProvider>
  )
}

export default App
