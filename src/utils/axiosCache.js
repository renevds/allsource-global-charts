export class cachedAxiosInstance {
  constructor(axiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  async get(url, ...props) {
    console.log(url)
    const cached = sessionStorage.getItem(url);
    if (cached) {
      return {data: JSON.parse(cached)};
    }
    const res = await this.axiosInstance.get(url, ...props);
    sessionStorage.setItem(url, JSON.stringify(res.data));
    return res;
  }
}