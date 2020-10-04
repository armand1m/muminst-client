import axios, { AxiosRequestConfig } from 'axios'

const baseUrl = process.env.REACT_APP_API_URL

console.log(baseUrl)

const apiRequest = (page: string, method: AxiosRequestConfig['method']) =>
    axios({ url: `${baseUrl}/${page}`, method })

export const getChannels = () => apiRequest('channels', 'GET')
