// !wok真服了……导入了这个Sidebar导致一直显示的都只是svg……
// import { Sidebar } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Input } from "../ui/input";
import { ChangeEvent } from "react";
import { Label } from "@radix-ui/react-label";
import { Button } from "../ui/button";
import { X } from "lucide-react";
interface Props {
	cwd: string
	handleCwdChange: (event: ChangeEvent<HTMLInputElement>) => void
	dirs: string[]
	handleDirDelete: (dirIndex: number) => void
	curDir: string
	handleCurDirChange: (curDir: string) => void
}
export default function SideBarApp({ cwd, handleCwdChange, dirs, handleDirDelete, curDir, handleCurDirChange }: Props) {
	// const [cwd, setCwd] = useState("")
	return (
		<Sidebar>
			<SidebarContent className="w-60 h-full">
				<SidebarGroup className="relativ">
					<SidebarHeader className="sticky top-0 p-3 z-10 bg- filter backdrop-blur-sm">
						<Label>正在设置：<br />{cwd.replace(/\/$/g, "") + "/" + curDir}</Label>
						<Input className="text-black bg-transparent" id="dir_input" placeholder="Work Dir" type="text" value={cwd} onChange={handleCwdChange} multiple />
					</SidebarHeader>
					<SidebarGroupContent>
						<SidebarGroupLabel>文件夹列表</SidebarGroupLabel>
						<SidebarMenu>
							{/* {[...dirs, ...dirs, ...dirs, ...dirs, ...dirs, ...dirs].map((dir, index) => ( */}
							{dirs?.map((dir, index) => (
								<SidebarMenuItem key={index} onClick={() => handleCurDirChange(dir)} className={`p-2 flex rounded-lg transition-all  ${curDir === dir ? "bg-primary text-white" : "hover:bg-secondary"}`}>
									<div className="w-">{dir}</div>
									<Button variant={"outline"} onClick={(e) => { e.stopPropagation(); handleDirDelete(index) }} className={`size-6 ml-auto transition-all duration-300 ${curDir === dir ? "scale-50 opacity-0 pointer-events-none" : ""}`}><X color="red" /></Button>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>

	)
}