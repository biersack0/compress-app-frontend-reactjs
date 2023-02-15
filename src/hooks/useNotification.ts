import { useState } from 'react'

export interface StateNotification{
    show: boolean;
    data: string[];
    type: 'success' | 'warning' | 'error'
}

export const useNotification = ()=>{
	const [showNotification, setShowNotification] = useState<StateNotification>({
		show: false,
		data: [''],
		type : 'success'
	})

	return {
		showNotification,
		setShowNotification
	}
}