import axios from 'axios'
import Pending from './pending'
import { isFunction } from './utils/is'

export default class XYAxios {
    #opts
    #instance

    constructor(options = {}) {
        const {
            enableAbortController,
            interceptorRequest,
            interceptorRequestCatch,
            interceptorResponse,
            interceptorResponseCatch,
        } = options

        this.#opts = {
            ...options,
        }
        this.#instance = axios.create(this.#opts)

        const pending = new Pending()

        this.#instance.interceptors.request.use(
            (request) => {
                // 取消重复请求
                if (enableAbortController && request.enableAbortController !== false) {
                    pending.add(request)
                }

                if (isFunction(interceptorRequest)) {
                    interceptorRequest(request)
                }

                return request
            },
            (err) => {
                if (isFunction(interceptorRequestCatch)) {
                    interceptorRequestCatch(err)
                }
                return Promise.reject(err)
            }
        )

        this.#instance.interceptors.response.use(
            (response) => {
                pending.remove(response.config)

                if (isFunction(interceptorResponse)) {
                    interceptorResponse(response, pending)
                }

                if(response.data.code === '10000'){
                    return response.data
                }

                return response
            },
            (err) => {
                if (isFunction(interceptorResponseCatch)) {
                    interceptorResponseCatch(err)
                }
                return Promise.reject(err)
            }
        )
    }

    get store() {
        return this.#instance
    }

    /**
     * 请求
     * @param config
     * @returns {Promise<unknown>}
     */
    request(config = {}) {
        return new Promise((resolve, reject) => {
            this.#instance
                .request({
                    //...this.#opts,
                    ...config,
                })
                .then(
                    (res) => {
                        resolve(res.data)
                    },
                    (err) => {
                        reject(err)
                    }
                )
                .catch((err) => {
                    reject(err)
                })
        })
    }

    /**
     * POST 请求
     * @param {string} url
     * @param {object} data
     * @param {object} config
     * @returns {Promise<unknown>}
     */
    post(url = '', data = {}, config = {}) {
        return this.request({
            method: 'post',
            url,
            data,
            ...config,
        })
    }

    /**
     * GET 请求
     * @param {string} url
     * @param {object} params
     * @param {object} config
     * @returns {Promise<unknown>}
     */
    get(url = '', params = {}, config = {}) {
        return this.request({
            method: 'get',
            url,
            params,
            ...config,
        })
    }

    /**
     * DELETE 请求
     * @param {string} url
     * @param {object} data
     * @param config
     * @returns {Promise<unknown>}
     */
    delete(url, data = {}, config = {}) {
        return this.request({
            method: 'delete',
            url,
            data,
            ...config,
        })
    }

    /**
     * PUT 请求
     * @param {string} url
     * @param {object} data
     * @param config
     * @returns {Promise<unknown>}
     */
    put(url, data = {}, config = {}) {
        return this.request({
            method: 'put',
            url,
            data,
            ...config,
        })
    }

    /**
     * 上传
     * @param {string} url
     * @param {File} formData
     * @param {object} config
     * @returns {Promise<unknown>}
     */
    upload(url = '', formData = {}, config = {}) {
        return this.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            ...config,
        })
    }

    /**
     * 下载
     * @param {string} url
     * @param {object} config
     * @returns {Promise<unknown>}
     */
    download(url = '', config = {}) {
        return this.request({
            url,
            baseURL: '',
            method: 'get',
            responseType: 'blob',
            ...config,
        })
    }
}
