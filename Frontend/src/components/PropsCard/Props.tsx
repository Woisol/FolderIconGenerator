import { Input } from "../ui/input";
import { Label as RadLabel } from "../ui/label";
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider as RadSlider } from "../ui/slider";

interface SelectOption {
	title: string;
	options: string[];
	handleValueChange: (value: string) => void;
}
function Label({ title }: { title: string }) {
	return <RadLabel className="ml-2" htmlFor={title}>{title}</RadLabel>
}
export function Select({ title, options, handleValueChange }: SelectOption) {
	return (
		<div>
			<Label title={title} />
			<RadSelect>
				<SelectTrigger id={title}>
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					{options.map((preset) => (<SelectItem value={preset} onSelect={() => handleValueChange(preset)}>{preset}</SelectItem>))}
				</SelectContent>
			</RadSelect>
		</div>
	)
}
interface TextOption {
	title: string;
	value: string;
	handleValueChange: (value: string) => void;
}
export function Text({ title, value, handleValueChange }: TextOption) {
	return (
		<div>
			<Label title={title} />
			<Input type='text' placeholder={title} value={value} onChange={(e) => { handleValueChange(e.target.value) }} />
		</div>
	)
}
interface NumberOption {
	title: string;
	value: number;
	handleValueChange: (value: number) => void;
}
export function Number({ title, value, handleValueChange }: NumberOption) {
	return (
		<div>
			<Label title={title} />
			<Input type='number' placeholder={title} value={value} onChange={(e) => { handleValueChange(e.target.value) }} />
		</div>
	)
}
interface SliderOption {
	title: string;
	value: number;
	defaultValue: number;
	min: number;
	max: number;
	step: number;
	handleValueChange: (value: number) => void;
}
export function Slider({ title, value, defaultValue, min = 0, max, step, handleValueChange }: SliderOption) {
	return (
		<div>
			<Label title={title} />
			<div className="flex">
				<RadSlider defaultValue={[defaultValue]} min={min} max={max} step={step} value={[value]} onValueChange={(value) => { handleValueChange(value) }} />
				<span className="mx-3">{value}</span>
			</div>
		</div>
	)
}