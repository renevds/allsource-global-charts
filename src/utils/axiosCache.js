export class cachedAxiosInstance {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async get(url, options) {
    const {params} = options;
    const cacheKey = url + '-' + Object.values(params).map(a => JSON.stringify(a)).sort().toString();
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      return {data: JSON.parse(cached)};
    }
    const res = await this.axiosInstance.get(url, options);
    try{
      sessionStorage.setItem(cacheKey, JSON.stringify(res.data));
    }catch (e){
      console.log(`Failed to cache ${url} probably to big.`)
    }

    return res;
  }
}