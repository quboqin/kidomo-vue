import axios from 'axios'

import { useAuthStore } from '@/stores'

const port = import.meta.env.VITE_PORT
const url = import.meta.env.VITE_BASE_URL
axios.defaults.baseURL = port ? `${url}:${port}` : `${url}`
axios.defaults.timeout = import.meta.env.VITE_TIMEOUT ? +import.meta.env.VITE_TIMEOUT : 5000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

export async function getToken() {
  return await useAuthStore().token
}

axios.interceptors.request.use(
  async (config) => {
    const jwtToken = await useAuthStore().token
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    if (response.status === 200 || response.status === 201 || response.status === 204) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (error) => {
    if (error.status === 401) console.log('login failed')
    return Promise.reject(error)
  }
)

function get<T, U>(path: string, params: T): Promise<U> {
  return new Promise((resolve, reject) => {
    axios
      .get(path, {
        params: params
      })
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function post<T, U>(path: string, params: T): Promise<U> {
  return new Promise((resolve, reject) => {
    axios
      .post(path, params)
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function put<T, U>(path: string, params: T): Promise<U> {
  return new Promise((resolve, reject) => {
    axios
      .put(path, params)
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

function del<T, U>(path: string, params: T): Promise<U> {
  return new Promise((resolve, reject) => {
    axios
      .delete(path, {
        params: params
      })
      .then((response) => {
        resolve(response.data.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function request<T, U>(method: string, path: string, params: T): Promise<U | null> {
  if (method === 'get') {
    return get(path, params)
  } else if (method === 'del') {
    return del(path, params)
  } else if (method === 'post') {
    return post(path, params)
  } else if (method === 'put') {
    return put(path, params)
  } else {
    return new Promise<null>((resolve) => resolve(null))
  }
}

export function result<T, U>(
  method: string,
  path: string,
  params?: T | undefined,
  mockData?: U | undefined
): Promise<U | null> {
  return new Promise((resolve) => {
    if (mockData) return resolve(mockData)
    return resolve(request(method, path, params))
  })
}
