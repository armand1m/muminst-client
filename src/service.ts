import axios, { AxiosRequestConfig } from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

console.log(baseUrl)

const apiRequest = (
    page: string,
    method: AxiosRequestConfig['method'],
    data?: { [key: string]: any }
) => axios({ url: `${baseUrl}/${page}`, method, data })

export const getChannels = () => apiRequest('channels', 'GET')
export const getSounds = () => apiRequest('sounds', 'GET')
export const playSound = (soundName: string) =>
    apiRequest('play-sound', 'POST', { soundName })
