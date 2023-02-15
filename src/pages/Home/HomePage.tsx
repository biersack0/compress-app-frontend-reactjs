import { SyntheticEvent, useState } from 'react'
import Dropzone from 'react-dropzone'
import { Disclosure } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon, XIcon } from '@heroicons/react/outline'
import { DocumentIcon } from '@heroicons/react/outline'
import { Navbar, Footer } from '@/components/organisms'
import { CSwitch, CNotification } from '@/components/atoms'
import { useUpload, useNotification } from '@/hooks'
import { FileService } from '@/services/file.service'

const timeline = [
	{
		id: 1,
		content: 'Click the “Upload File” button or drag and drop to upload your files.',
	},
	{
		id: 2,
		content: 'Click on the “Convert” button to start the conversion.'
	},
	{
		id: 3,
		content: 'Download your converted images.'
	}
]

enum FileOptions {
	quality = 'quality',
	formatFilename = 'formatFilename',
	ajustImage = 'ajustImage'
}

export const HomePage = () => {
	const {filesToUpload, setFilesToUpload, removeFile} = useUpload()

	const [fileOptions, setFileOptions] = useState({
		quality: 80,
		formatFilename: false,
		ajustImage: false
	})
	const {quality, formatFilename, ajustImage} = fileOptions
	
	const handleChangeFileOptions = (value:React.ChangeEvent<HTMLInputElement> | boolean, property: FileOptions) => {
		setFileOptions(()=>({
			...fileOptions,
			[property]: (typeof value == 'boolean') ? value : parseInt(value.target.value)
		}))
	}

	const {showNotification, setShowNotification} = useNotification()

	const handleDropFiles = (files: File[])=>{
		setFilesToUpload([
			...filesToUpload,
			...files
		])
	}

	const handleConvert = async (event: SyntheticEvent) => {
		event.preventDefault()
		const formData = new FormData()
		
		if (filesToUpload == null || filesToUpload.length == 0) {
			return setShowNotification({
				show: true,
				data: ['You must upload at least 1 file.'],
				type : 'error'
			})
		}
		
		for (const file of filesToUpload) {
			formData.append('files', file)
		}

		try {
			const res = await new FileService().compress(formData, quality, formatFilename, ajustImage)
			const url = URL.createObjectURL(new Blob([res.data]))
			const link = document.createElement('a')
			link.href = url
			link.setAttribute('download','compressed.zip')
			document.body.appendChild(link)
			link.click()
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			const err = JSON.parse( await error.response.data.text())
		
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const errors:string[] = err['errors'].map((err: any) => Object.values(err)[0])
			setShowNotification({
				show: true,
				data: errors,
				type : 'error'
			})
		}
	}

	return (
		<div className="min-h-full">
			<Navbar/>
			{showNotification.show && <CNotification setShowNotification={ setShowNotification } showNotification ={ showNotification } />}

			<main className="-mt-32">
				<div className="container pb-12 px-4 sm:px-6 lg:px-8">
					<div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
						<div>
							<Dropzone 
								accept={ {
									'image/png': ['.png'],
									'image/jpg': ['.jpg'],
									'image/jpeg': ['.jpeg']
								} }
								onDrop={ handleDropFiles }>
								{({getRootProps, getInputProps}) => (
									<div { ...getRootProps() } className='border-2 border-gray-300 border-dashed rounded-md p-6 text-center'>
										<input { ...getInputProps() } />

										{(filesToUpload==null || filesToUpload.length == 0) ? 
											<div>
												<svg
													className="mx-auto h-12 w-12 text-gray-400"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
													aria-hidden="true"
												>
													<path
														d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
														strokeWidth={ 2 }
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												<p className='text-sm text-gray-600'>
													<span className='cursor-pointer font-medium text-indigo-600'>Upload a file</span>
													<span className='pl-1'>or drag and drop</span>
												</p>
												<p className="text-xs text-gray-600">PNG, JPG, JPEG up to 7MB</p>
											</div>
											:
											<div>
												{
													Array.from(filesToUpload).map((file, idx) =>(
														<div key={ idx } className={ 'flex justify-between my-1' }>
															<div className='flex align-middle'>
																<DocumentIcon className="h-6 w-6 mr-2 text-red-500 inline-block" aria-hidden="true" />
																<span className='text-gray-500'>{file.name} </span>
																<span className='ml-2 text-gray-500'>{(file.size / (1024*1024)).toFixed(2) } MB</span>
															</div>
															<XIcon className="h-6 w-6 text-red-500 inline-block col-auto cursor-pointer" aria-hidden="true" 
																onClick={ (e)=>{
																	e.stopPropagation()
																	removeFile(idx)
																} }
															/>
														</div>
													))
												}
											</div>
										}
									</div>
								)}
							</Dropzone>

							<div className='flex justify-center mt-6'>
								<button
									type="button"
									onClick={ handleConvert }
									className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Convert
								</button>
							</div>

							<div className="max-w-lg mx-auto mt-6">
								<Disclosure defaultOpen>
									{({ open}) => (
										<>
											<Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-base text-gray-700">
												<span className='font-medium'>Advanced settings (optional)</span>
												<ChevronDownIcon
													className={ `${
														open ? 'rotate-180 transform' : ''
													} h-5 w-5 text-indigo-600` }
												/>
											</Disclosure.Button>
											<Disclosure.Panel className="px-4 pt-4 pb-2">
												<div className='mb-2'>
													<p className='text-sm text-gray-500'>Image quality</p>
													<input className='appearance-none rounded-lg bg-gray-300 h-2 mr-2' style={ {width: 'calc(100% - 3rem)'} } type="range" min="1" max="100" value={ quality } onChange= { (e)=> handleChangeFileOptions(e, FileOptions.quality) }/>
													<input className='inline-block bg-white text-gray-500 border-2 w-10 text-center' pattern='[0-9]{0,13}' type="text" value={ quality } onChange={ (e)=>{
														if (e.target.value == '') {
															setFileOptions(()=>({
																...fileOptions,
																quality: 0
															}))
														}
														else if (Number(e.target.value) > 100) {
															setFileOptions(()=>({
																...fileOptions,
																quality: 100
															}))
														}
														else if (e.target.validity.valid && Number(e.target.value) <= 100 ) {
															setFileOptions(()=>({
																...fileOptions,
																quality: parseInt(e.target.value)
															}))
														}
													} }/>
												</div>

												<div className='flex align-middle mb-2'>
													<CSwitch isChecked={ formatFilename } onChange={ (value)=> handleChangeFileOptions(value, FileOptions.formatFilename) } />
													<span className='text-sm text-gray-500 ml-2'>Replace blank space with dash in filename.</span>
												</div>

												<div className='flex align-middle'>
													<CSwitch isChecked={ ajustImage } onChange={ (value)=> handleChangeFileOptions(value, FileOptions.ajustImage) } />
													<span className='text-sm text-gray-500 ml-2'>Set width image to 1920px if it greater.</span>
												</div>
											</Disclosure.Panel>
										</>
									)}
								</Disclosure>
							</div>

							<p className="text-base text-center font-medium text-gray-700 mt-6 mb-4">How to Convert Images?</p>
							{
								timeline.map((event)=>(
									<div className='grid grid-cols-12 gap-4 my-2' key={ event.id }>
										<div className='col-span-1 mx-auto'>
											<span className={ 'h-6 w-6 rounded-full flex items-center justify-center bg-indigo-600 ' }>
												<CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
											</span>
										</div>
										<div className='col-span-11 flex items-center'>
											<p className="text-base text-gray-500">
												{event.content}
											</p>
										</div>
									</div>
								))
							}
						</div>
					</div>
				</div>
			</main>

			<Footer/>
		</div>
	)
}