import Axios, { AxiosError } from 'axios'

const BASE_URL = process.env['NODE_ENV'] === 'production'
    ? '/api/'
    : '//localhost:3030/api/'

var axios = Axios.create({
    withCredentials: true
})

export const httpService = {
    get(endpoint: string, data: any) {
        console.log('endpoint:', endpoint)
        return ajax(endpoint, 'GET', data)
    },
    post(endpoint: string, data: any) {
        return ajax(endpoint, 'POST', data)
    },
    put(endpoint: string, data: any) {
        return ajax(endpoint, 'PUT', data)
    },
    delete(endpoint: string, data: any) {
        return ajax(endpoint, 'DELETE', data)
    }
}

async function ajax(endpoint: string, method = 'GET', data = null) {
    try {
        const res = await axios({
            url: `${BASE_URL}${endpoint}`,
            method,
            data,
            params: (method === 'GET') ? data : null
        })
        return res.data
    } catch (error: any | AxiosError) {
        if (data) delete data['password']
        console.log(`Had Issues ${method}ing to the backend, endpoint: ${endpoint}, with data: `, data)
        console.dir(error)
        if (error.response && error.response.status === 401) {
            sessionStorage.clear()
        }
        throw error
    }
}