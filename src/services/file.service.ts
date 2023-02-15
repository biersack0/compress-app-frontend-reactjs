import { apiURL } from './api.service'

export class FileService {
	async compress(formData: FormData, quality: number, formatFilename: boolean, ajustImage: boolean) {
		const data  = await apiURL.post(`/file?quality=${quality}&format-filename=${formatFilename}&ajust-image=${ajustImage}`, formData, {responseType: 'blob'})
		
		return data
	}
}
