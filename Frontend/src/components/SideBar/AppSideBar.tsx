// !wok真服了……导入了这个Sidebar导致一直显示的都只是svg……
// import { Sidebar } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Input } from "../ui/input";
import { ChangeEvent } from "react";
import { Label } from "@radix-ui/react-label";
interface Props {
	cwd: string
	handleCwdChange: (event: ChangeEvent<HTMLInputElement>) => void
	dirs: string[]
	curDir: string
	handleCurDirChange: (curDir: string) => void
}
export default function SideBarApp({ cwd, handleCwdChange, dirs, curDir, handleCurDirChange }: Props) {
	// const [cwd, setCwd] = useState("")
	return (
		<Sidebar>
			<SidebarContent className="w-60 h-full">
				<SidebarGroup className="relativ">
					<SidebarHeader className="sticky top-0 p-3 z-10 bg- filter backdrop-blur-sm">
						<Label>正在设置{cwd.replace(/\/$/g, "") + "/" + curDir}</Label>
						<Input className="text-black bg-transparent" id="dir_input" placeholder="Work Dir" type="text" value={cwd} onChange={handleCwdChange} multiple />
					</SidebarHeader>
					<SidebarGroupContent>
						<SidebarGroupLabel>文件夹列表</SidebarGroupLabel>
						<SidebarMenu>
							{/* {[...dirs, ...dirs, ...dirs, ...dirs, ...dirs, ...dirs].map((dir, index) => ( */}
							{dirs.map((dir, index) => (
								<SidebarMenuItem key={index} onClick={() => handleCurDirChange(dir)} className={`p-2 rounded-lg transition-all  ${curDir === dir ? "bg-primary text-white" : "hover:bg-secondary"}`}>
									{dir}
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>

	)
}