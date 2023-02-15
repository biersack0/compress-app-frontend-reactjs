import { Switch } from '@headlessui/react'

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

interface Parameters {
	isChecked: boolean;
	onChange: ((checked: boolean) => void)
}

export const CSwitch = ( { isChecked, onChange }: Parameters ) => {
	return (
		<Switch
			checked={ isChecked }
			onChange={ onChange }
			className={ classNames(
				isChecked ? 'bg-indigo-600' : 'bg-gray-200',
				'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
			) }>
			<span className="sr-only">Use setting</span>
			<span
				aria-hidden="true"
				className={ classNames(
					isChecked ? 'translate-x-5' : 'translate-x-0',
					'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200') }/>
		</Switch>
	)
}
