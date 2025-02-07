// !wok真服了……导入了这个Sidebar导致一直显示的都只是svg……
// import { Sidebar } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import {ArrowRight, MoveLeft, X} from "lucide-react";
import {useState} from "react";
interface Props {
	cwd: string
	updateCwd: (nextCwd: string) => void
	dirs: string[]
	curDir: string|null
	handleDirDelete: (dirIndex: number) => void
	updateCurDir: (curCwd: string, nextCurDir: string) => void
}
export default function SideBarApp({ cwd, updateCwd, dirs, curDir, updateCurDir, handleDirDelete }: Props) {
	const [userInput, setUserInput] = useState<string>(cwd)

	return (
		<Sidebar>
			<SidebarContent className="w-60 h-full">
				<SidebarGroup className="relativ">
					<SidebarHeader className="sticky top-0 p-3 z-10 bg- filter backdrop-blur-sm">
						<Label>正在设置：<br />{cwd.replace(/\/$/g, "") + "/" + curDir}</Label>
						<Input className="text-black bg-transparent h-8" id="dir_input" placeholder="Work Dir" type="text" multiple
									 value={userInput}
									 onChange={(event) => {
										 setUserInput(event.target.value)
									 }}
									 onKeyDown={(event) => {
										 if (event.key === "Enter") {
											 updateCwd(userInput)
										 }
									 }}
						/>
						<button
							className="my-1 flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-4 py-1"
							onClick={() => {
								let nextCwd = cwd.slice(0, cwd.lastIndexOf("/"))
								if (!nextCwd.includes("/")) nextCwd += "/"
								updateCwd(nextCwd)
								setUserInput(nextCwd)
							}}
						>
							<span className="mr-2">返回上一级</span>
							<MoveLeft />
						</button>
					</SidebarHeader>
					<SidebarGroupContent>
						<SidebarGroupLabel>文件夹列表</SidebarGroupLabel>
						<SidebarMenu>
							{/* {[...dirs, ...dirs, ...dirs, ...dirs, ...dirs, ...dirs].map((dir, index) => ( */}
							{dirs?.map((dir, index) => (
								<SidebarMenuItem key={index} onClick={() => updateCurDir(cwd, dir)} className={`p-2 flex rounded-lg transition-all  ${curDir === dir ? "bg-primary text-white" : "hover:bg-secondary"}`}>
									<div className="w-">{dir}</div>
									<Button variant={"outline"}
													onClick={(e) => {
														e.stopPropagation();
														if (curDir === dir) {
															const nextCwd = cwd.endsWith("/") ? cwd + dir : cwd + "/" + dir
															updateCwd(nextCwd)
															setUserInput(nextCwd)
														}
														else handleDirDelete(index)
													}}
													className={`size-6 ml-auto transition-all duration-300`}>
										{ curDir === dir ? <ArrowRight color="black" /> : <X color="red" /> }
									</Button>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}