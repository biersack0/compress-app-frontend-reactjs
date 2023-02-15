/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./index.html',
		'./src/**/*.{vue,js,ts,jsx,tsx}',
	],
	theme: {
		extend: {},
		container: {
			center: true,
			padding: '2rem'
		},
		fontFamily: {
			'roboto': 'RobotoRegular',
			'planecrash': 'PlaneCrash',
			'bebasneue': 'BebasNeueRegular'
		}
	},
	plugins: [],
}
