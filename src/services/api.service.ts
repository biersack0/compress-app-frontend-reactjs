import axios from 'axios'

export const apiURL = axios.create({
	baseURL: 'http://localhost:3000/api'
	// baseURL: 'https://compress-app-backend.herokuapp.com/api'
})