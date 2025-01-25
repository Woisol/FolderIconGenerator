// !wok真服了……导入了这个Sidebar导致一直显示的都只是svg……
// import { Sidebar } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { Input } from "../ui/input";
import { ChangeEvent, useState } from "react";

export default function SideBarApp({ curDir, handleCurDirChange }: { curDir: string, handleCurDirChange: (curDir: string) => void }) {
	const [cwd, setCwd] = useState("")
	const [dirs, setDirs] = useState(["Code", "Coding", "Game", "System"])
	function handleCwdChange(e: ChangeEvent<HTMLInputElement>) {
		// dtodo To Implement 调用go打开文件夹选择框
		setCwd(e.target.value)

	}
	return (
		<Sidebar>
			<SidebarContent className="w-60 h-full">
				<SidebarGroup>
					<SidebarHeader>
						<Input id="dir_input" placeholder="Work Dir" type="text" value={cwd} onChange={handleCwdChange} multiple />
					</SidebarHeader>
					<SidebarGroupContent>
						<SidebarGroupLabel>文件夹列表</SidebarGroupLabel>
						<SidebarMenu>
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