const fetchApi = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  return response.json() as T;
};
const fetchData = async <T>(
  cityName: string,
  apiKey: string,
  type: 'weather' | 'forecast'
): Promise<T> => {
  const url = `https://api.openweathermap.org/data/2.5/${type}?q=${cityName}&units=metric&appid=${apiKey}&lang=ja`;
  const data = (await fetchApi(url)) as T;
  return data;
};
export default fetchData;
