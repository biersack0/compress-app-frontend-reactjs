export class Utils{
	static currentYear():string{
		const currentYear = new Date().getFullYear()
		return String(currentYear)
	}

	static saveFile(data?: BlobPart[], nameFile = 'compressed.zip'){
		const url = URL.createObjectURL(new Blob(data))
		const link = document.createElement('a')
		link.href = url
		link.setAttribute('download', nameFile)
		document.body.appendChild(link)
		link.click()
	}

	static validFiles(files: FileList | null): boolean{
		const filesAllowed = ['image/png','image/jpg','image/jpeg']

		if (files !== null) {
			const filesArray = Array.from(files)

			const isAllowed =  filesArray.every((file: File) => {
				return filesAllowed.includes( file.type )
			})
			
			return isAllowed
		}

		return false
	}
}