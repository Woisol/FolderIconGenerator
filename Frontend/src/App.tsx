import { ChangeEvent, useEffect, useState } from 'react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import SideBarApp from './components/SideBar/AppSideBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Select, Slider, Text } from './components/PropsCard/Props'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { Form } from './components/ui/form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from 'react-hook-form'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import { Button } from './components/ui/button'
import { RefreshCcw } from 'lucide-react'
import axios from 'axios'

function App() {
  const [cwd, setCwd] = useState("D:")
  const [dirs, setDirs] = useState(["Code", "Coding", "Game", "System"])
  const [curDir, setCurDir] = useState('')
  const [presets, setPresets] = useState<string[]>()//["蓝色", "绿色", "紫色"]
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
  useEffect(() => {
    handleRefresh()
  }, [])

  function handleRefresh() {
    axios.get('/refresh').then(res => {
      type _data = { presets: string[] }
      setPresets((res.data as _data).presets)
    })
      .catch(err => {
        toast("无法连接到服务器，请确认后端是否被意外关闭。ERR：", err.message)
      })
  }
  function handleCwdChange(e: ChangeEvent<HTMLInputElement>) {
    // dtodo To Implement 调用go打开文件夹选择框
    setCwd(e.target.value)
    // **获取文件夹列表
    axios.get('/getDirs', {}).then((res) => {
      if (res.status === 200 && !(res.data as string).startsWith("<!doctype html>"))
        setDirs(res.data);
      else {
        setDirs([])
        toast("获取文件夹列表失败，返回数据：" + res.data)
      }
    })
      .catch(err => {
        setDirs([])
        toast("获取文件夹列表失败，错误：" + err)
      })
  }
  function handleCurDirChange(curDir: string) {
    setCurDir(curDir)
    form.setValue('dir', cwd.replace(/\/$/g, "") + "/" + curDir)
    // ~~form.setValue('dir',)
  }
  function preGenerate() {
    type _data = { img: string }
    axios.post('/generate', form.getValues()).then(res => {
      setPreviewImg((res.data as _data).img)
    }).catch(err => {
      toast("生成失败，错误：" + err)
    })
  }
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    if (!values.dir) {
      toast("未选择生成文件夹！")
      return
    }
    toast("已发送请求")
  }

  return (
    <SidebarProvider className=''>
      <SideBarApp cwd={cwd} handleCwdChange={handleCwdChange} dirs={dirs} curDir={curDir} handleCurDirChange={handleCurDirChange} />
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
                  <form onChange={preGenerate} onSubmit={form.handleSubmit(onSubmit)} className='gap-5 grid grid-cols-3 grid-rows-2'>
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
        <Button onClick={handleRefresh} variant={"outline"} size={'icon'} className='btn-scale absolute top-5 right-5' ><RefreshCcw color='black' /></Button>
      </main>
      <Toaster />
    </SidebarProvider>
  )
}

export default App
