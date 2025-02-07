import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider as RadSlider } from "../ui/slider";
import { useEffect } from "react";
import {Checkbox} from "@/components/ui/checkbox.tsx";

interface SelectOption {
	form: UseFormReturn
	title: string;
	name: string;
	options: string[];
	defaultValue?: string;
}
function Label({ title }: { title: string }) {
	return <FormLabel className="ml-2" htmlFor={title}>{title}</FormLabel>
}
export function Select({ form, title, name, options, defaultValue }: SelectOption) {
	if (defaultValue && !form.getValues(name)) form.setValue(name, defaultValue)
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<Label title={title} />
				<FormControl>
					<RadSelect onValueChange={(value) => form.setValue(name, value)} {...field}>
						<SelectTrigger id={title}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{options.map((preset, index) => (<SelectItem key={index} value={preset} >{preset}</SelectItem>))}
							{/* onSelect={() => form.setValue(name, preset)} */}
						</SelectContent>
					</RadSelect>
				</FormControl>
				<FormMessage />
			</FormItem>
		)} />
	)
}
interface TextOption {
	form: UseFormReturn;
	defaultValue?: string;
	title: string;
	name: string;
	// handleValueChange: (value: string) => void;
}
export function Text({ form, defaultValue, title, name }: TextOption) {
	if (defaultValue && !form.getValues(name)) form.setValue(name, defaultValue)
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<Label title={title} />
				<FormControl>
					{/* defaultValue ? defaultValue : */}
					<Input type='text' placeholder={title} defaultValue={defaultValue}  {...field} />
				</FormControl>
				<FormMessage />
			</FormItem>
		)} />
	)
}
interface NumberOption {
	form: UseFormReturn;
	title: string;
	name: string;
	max?: number;
	min?: number;
	defaultValue?: number;
	// value: number;
	// handleValueChange: (value: number) => void;
}
export function Number({ form, title, name, max, min, defaultValue }: NumberOption) {
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<Label title={title} />
				<FormControl>
					<Input type='number' max={max} min={min} defaultValue={defaultValue} placeholder={title}
								 {...{...field, onChange: (e) => { form.setValue(name, window.Number(e.target.value)) }}} />
				</FormControl>
				<FormMessage />
			</FormItem>
		)} />
	)
}
interface ColorBoxOption {
	form: UseFormReturn;
	title: string;
	name: string;
	defaultValue: string;
}
export function ColorBox({ form, title, name, defaultValue }: ColorBoxOption) {
	useEffect(() => form.setValue(name, defaultValue), [])
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<Label title={title} />
				<FormControl>
					{/* defaultValue ? defaultValue : */}
					<Input type='color' placeholder={title} defaultValue={defaultValue}  {...field} />
				</FormControl>
				<FormMessage />
			</FormItem>
		)} />
	)
}
interface CheckBoxOption {
	form: UseFormReturn;
	title: string;
	name: string;
}
export function CheckBox({ form, title, name }: CheckBoxOption) {
	//useEffect(() => form.setValue(name, defaultValue), [])
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<FormControl>
					<Checkbox checked={field.value} onCheckedChange={field.onChange} />
				</FormControl>
				<FormLabel className="text-sm font-normal">
					{title}
				</FormLabel>
				{/*<FormMessage />*/}
			</FormItem>
		)} />
	)
}
interface SliderOption {
	form: UseFormReturn;
	title: string;
	name: string
	// value: number;
	defaultValue: number;
	min: number;
	max: number;
	step: number;
	// handleValueChange: (value: number) => void;
}
export function Slider({ form, title, name, defaultValue, min = 0, max, step }: SliderOption) {
	// const [sliderValue, setSliderValue] = useState(defaultValue)
	// !https://duhan.dev/posts/inserting-shadcn-slider-datepicker-into-react-hook-form/
	useEffect(() => form.setValue(name, defaultValue), [])
	return (
		<FormField control={form.control} name={name} render={() => (
			<FormItem className="fle">
				<Label title={title} />
				<div className="flex">
					<FormControl>
						<RadSlider defaultValue={[defaultValue]} min={min} max={max} step={step} form={name} onValueChange={(values) => form.setValue(name, values[0])} />
						{/* <Input type="hidden"  {...field} value={sliderValue} /> */}
					</FormControl>
					{/* // !wok一直报错……注意FormControl不能有多个Child！ */}
					<span className="mx-3">{form.getValues(name)}</span>
					{/* <span className="mx-3">{sliderValue}</span> */}
				</div>
				{/* <FormMessage /> */}
			</FormItem>
		)} />
	)
}