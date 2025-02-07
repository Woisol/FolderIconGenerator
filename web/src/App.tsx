import {useCallback, useEffect, useState} from 'react'
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar'
import SideBarApp from './components/SideBar/AppSideBar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Input } from './components/ui/input'
import { Number, Select, Text} from './components/PropsCard/Props'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './components/ui/resizable'
import { Form } from './components/ui/form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {useForm} from 'react-hook-form'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import {AxiosError} from 'axios'
import { debounce } from './lib/utils'
import {checkCwd, getCompositionImage, getDirs, getIcon, getImageConfig, setIcon} from "@/api/methods.ts";
import {CompositionImageDTO} from "@/api/types.ts";
import {BASE_URL} from "@/api/constant.ts";

function getIcoFileName (cwd: string, dir: string) {
  return (cwd.replace(/\/$/g, "") + "/" + dir).replace(/\//g, '_').replace(/:/g, '&') +'.ico'
}

function getDirPath (cwd: string, dir: string) {
  return cwd.endsWith("/") ? cwd + dir : cwd + "/" + dir;
}

const initIcoFileNames: string[] = []
const initSvgFileNames: string[] = []
const initCwd = "D:/"
const initDirs: string[] = []
const initCurDir: string|null = null
const initPreviewImgPath: string|null = null

const minSvgSize = 1
const minSvgX = 0
const minSvgY = 0
const minTextSize = 1
const minTextX = 0
const minTextY = 0

const initFormValue = {
  icoFileName: '',
  svgFileName: '',
  svgSize: 0,
  svgX: 0,
  svgY: 0,
  text: '',
  textSize: minTextSize,
  textX: minTextX,
  textY: minTextY,
  outputFileName: undefined as string|undefined
}

function App() {
  // config
  const [icoFileNames, setIcoFileNames] = useState<string[]>(initIcoFileNames)
  const [svgFileNames, setSvgFileNames] = useState<string[]>(initSvgFileNames)
  // folder
  const [cwd, setCwd] = useState<string>(initCwd)
  const [dirs, setDirs] = useState<string[]>(initDirs)
  const [curDir, setCurDir] = useState<string|null>(initCurDir)
  // image
  const [imgKey, setImgKey] = useState(0)
  const [previewImgPath, setPreviewImgPath] = useState<string|null>(initPreviewImgPath)

  const formSchema = z.object({
    icoFileName: z.string().min(3),
    svgFileName: z.string().min(3),
    svgSize: z.number().min(minSvgSize),
    svgX: z.number().min(minSvgX),
    svgY: z.number().min(minSvgY),
    text: z.string().min(0),
    textSize: z.number().min(minTextSize),
    textX: z.number().min(minTextX),
    textY: z.number().min(minTextY),
    outputFileName: z.string().min(3)
  })
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onSubmit',
    reValidateMode: 'onBlur',
    // !要引入文档里面的@hookform/resolvers/zod和zod……
    resolver: zodResolver(formSchema),
    defaultValues: initFormValue
  })
  const {setValue, reset} = form

  // 初始化
  useEffect(() => {
    getImageConfig().then((response) => {
      setIcoFileNames(response.data.icoFileNames)
      setSvgFileNames(response.data.svgFileNames)
      /*if (response.data.icoFileNames.length > 0) {
        console.log('进入')
        setValue('icoFileName', response.data.icoFileNames[0])
      }
      if (response.data.svgFileNames.length > 0) {
        console.log('进入')
        setValue('svgFileName', response.data.svgFileNames[0])
      }*/
    }).catch((error: AxiosError) => {
      toast.error("初始化图像配置失败，请检查后端是否开启", {
        description: error.response?.data as string ?? error.message
      })
    })
    getDirs(initCwd).then((response) => {
      setDirs(response.data)
      if (response.data.length > 0) {
        setCurDir(response.data[0])
        const icoFileName = getIcoFileName(initCwd, response.data[0])
        initFormValue.outputFileName = icoFileName
        const dirPath = getDirPath(initCwd, response.data[0])
        getIcon(dirPath, icoFileName).then((response) => {
          setPreviewImgPath(BASE_URL+response.data)
        }).catch((error: AxiosError) => {
          toast.error("获取文件夹图标失败", {
            description: error.response?.data as string ?? error.message
          })
        })
      }
    }).catch((error: AxiosError) => {
      console.log(error)
      toast.error("获取文件夹列表失败", {
        description: error.response?.data as string ?? error.message
      })
    })
  }, []);

  const updateCurDir = useCallback(
    (curCwd: string, nextCurDir: string) => {
      setCurDir(nextCurDir)
      const icoFileName = getIcoFileName(curCwd, nextCurDir)
      setValue('outputFileName', icoFileName)
      setValue('svgSize', 0)
      const dirPath = getDirPath(curCwd, nextCurDir)
      getIcon(dirPath, icoFileName).then((response) => {
        setPreviewImgPath(BASE_URL+response.data)
        setImgKey(prevState => prevState + 1)
      }).catch((error: AxiosError) => {
        toast.error("获取文件夹图标失败", {
          description: error.response?.data as string ?? error.message
        })
      })
    }, [setValue]
  )

  const updateDirs = useCallback(
    (curCwd: string) => {
      debounce(() => {
        getDirs(curCwd).then((response) => {
          setDirs(response.data)
          if (response.data.length > 0) updateCurDir(curCwd, response.data[0])
          else {
            console.log('进入')
            setCurDir(null)
            reset(initFormValue)
          }
        }).catch((error: AxiosError) => {
          console.log(error)
          toast.error("获取文件夹列表失败", {
            description: error.response?.data as string ?? error.message
          })
        })
      }, 600)
    }, [reset, updateCurDir]
  )

  const updateCwd = useCallback(
    (nextCwd: string) => {
      checkCwd(nextCwd).then((response) => {
        if (response.data) {
          setCwd(nextCwd)
          updateDirs(nextCwd)
        } else {
          toast.error("更新路径失败", {
            description: "不是合法的路径"
          })
        }
      }).catch((error: AxiosError) => {
        toast.error("更新路径失败", {
          description: error.response?.data as string ?? error.message
        })
      })
    }, [updateDirs]
  )

  function handleFormChange (values: z.infer<typeof formSchema>) {
    const data = values as CompositionImageDTO
    if (data.text === undefined || data.text.trim() === '') {
      delete data.text
      delete data.textSize
      delete data.textX
      delete data.textY
    }
    getCompositionImage(data)
      .then((response) => {
        setPreviewImgPath(BASE_URL+response.data)
        setImgKey(prevState => prevState + 1)
      })
      .catch((error: AxiosError) => {
        toast.error("获取合成图片失败", {
          description: error.response?.data as string ?? error.message
        })
      })
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    console.log('提交')
    if (curDir === null) return
    const path = getDirPath(cwd, curDir)
    const icoFileName = getIcoFileName(cwd, curDir)
    setIcon(path, icoFileName).then(() => {
      toast.success("图标设置成功")
    }).catch((error: AxiosError) => {
      toast.error("图标设置失败", {
        description: error.response?.data as string ?? error.message
      })
    })
  }

  return (
    <SidebarProvider className=''>
      <SideBarApp cwd={cwd} updateCwd={updateCwd} dirs={dirs} curDir={curDir} updateCurDir={updateCurDir}
                  handleDirDelete={(index) => { setDirs(dirs.filter((_, i) => i !== index)) }}
      />
      <main className='w-full h-screen p-4 flex flex-col items-center'>
        <div className="w-full">
          <SidebarTrigger className='size-10' />
        </div>
        {/* @todo Resizable To Implement */}
        <ResizablePanelGroup direction='vertical'>
          <ResizablePanel className="relative w-full min-h-20 max-h60 p-8">
            {
              previewImgPath ?
                <img key={imgKey} className='h-full max-h-52 mx-auto' src={previewImgPath} alt="Preview"/> :
                <div>请进行图标配置</div>
            }
          </ResizablePanel>
          <ResizableHandle/>
          <ResizablePanel>
            <Card className='size-full overflow-y-auto'>
              <CardHeader>
                <CardTitle>Props</CardTitle>
                <CardDescription>Icon生成配置</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onChange={() => { debounce(form.handleSubmit(handleFormChange), 500) }} onSubmit={handleFormSubmit} action='' className='gap-5 grid grid-cols-3 grid-rows-2 items-end'>
                    {/* @todo 存在更新后form数据重置的问题 */}

                    <Select form={form} title='背景' name='icoFileName' options={icoFileNames} />
                    <Select form={form} title='图标' name='svgFileName' options={svgFileNames} />
                    <div/>

                    <Number form={form} title='图标大小' name='svgSize' min={minSvgSize} />
                    <Number form={form} title='x轴偏移' name='svgX' min={minSvgX} />
                    <Number form={form} title='y轴偏移' name='svgY' min={minSvgY} />

                    <Text form={form} title='文字' name='text' />
                    <div/><div/>

                    <Number form={form} title='字体大小' name='textSize' min={minTextSize} />
                    <Number form={form} title='x轴偏移' name='textX' min={minTextX} />
                    <Number form={form} title='y轴偏移' name='textY' min={minTextY} />
                    {/*<ColorBox form={form} title='文字颜色' name='fontColor' defaultValue={'#ffffff'} />*/}

                    <Input type='submit' value='设置' className="cursor-pointer hover:bg-gray-200" />
                  </form>
                </Form>
              </CardContent>
            </Card>
          </ResizablePanel>
        </ResizablePanelGroup>
        {/*<Button onClick={handleRefresh} variant={"outline"} size={'icon'} className='btn-scale absolute top-5 right-5' ><RefreshCcw color='black' /></Button>*/}
      </main>
      <Toaster />
    </SidebarProvider>
  )
}

export default App
