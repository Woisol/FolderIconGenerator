import { UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Label as RadLabel } from "../ui/label";
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Slider as RadSlider } from "../ui/slider";
import { useState } from "react";

interface SelectOption {
	form: UseFormReturn
	title: string;
	name: string;
	options: string[];
	handleValueChange: (value: string) => void;
}
function Label({ title }: { title: string }) {
	return <FormLabel className="ml-2" htmlFor={title}>{title}</FormLabel>
}
export function Select({ form, title, name, options, handleValueChange }: SelectOption) {
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<FormLabel title={title} />
				<FormControl>
					<RadSelect {...field}>
						<SelectTrigger id={title}>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{options.map((preset) => (<SelectItem value={preset} onSelect={() => handleValueChange(preset)}>{preset}</SelectItem>))}
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
	title: string;
	name: string;
	// handleValueChange: (value: string) => void;
}
export function Text({ form, title, name }: TextOption) {
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<Label title={title} />
				<FormControl>
					<Input type='text' placeholder={title}  {...field} />
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
	// value: number;
	// handleValueChange: (value: number) => void;
}
export function Number({ form, title, name, }: NumberOption) {
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem>
				<Label title={title} />
				<FormControl>
					<Input type='number' placeholder={title}  {...field} />
				</FormControl>
				<FormMessage />
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
	const [sliderValue, setSliderValue] = useState(defaultValue)
	return (
		<FormField control={form.control} name={name} render={({ field }) => (
			<FormItem className="fle">
				<Label title={title} />
				<div className="flex">
					<RadSlider defaultValue={[defaultValue]} min={min} max={max} step={step} form={name} onValueChange={(values) => { setSliderValue(values[0]) }} />
					<FormControl>
						<Input type="hidden"  {...field} value={sliderValue} />
					</FormControl>
					{/* // !wok一直报错……注意FormControl不能有多个Child！ */}
					{/* <span className="mx-3">{form.getValues(name)}</span> */}
					<span className="mx-3">{sliderValue}</span>
				</div>
				{/* <FormMessage /> */}
			</FormItem>
		)} />
	)
}