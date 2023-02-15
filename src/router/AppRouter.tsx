import { Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/Home/HomePage'
import { NotFound } from '@/pages/NotFound/NotFound'

export const AppRouter = () => {
	return (
		<Routes>
			<Route path="/" element={ <HomePage /> } />
			<Route path="/*" element={ <NotFound /> } />
		</Routes>
	)
}
