import { useState } from 'react'

export const useUpload = () => {
	const [filesToUpload, setFilesToUpload] = useState<File[]>([])
	// const [filesToUpload, setFilesToUpload] = useState<FileList | null>(null)

	const handleChangeFiles = (files: File[]) => {
		setFilesToUpload(files)
	}

	const removeFile = (position: number) => {
		const filesArray = (filesToUpload == null) ? [] : [...filesToUpload]
		filesArray.splice(position, 1)

		const filesUpload = filesArray as unknown as File[]
		setFilesToUpload(filesUpload)
	}

	return {
		filesToUpload,
		setFilesToUpload,
		removeFile,
		handleChangeFiles
	}
}