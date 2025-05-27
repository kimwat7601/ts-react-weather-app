const fetchApi = async <T>(url: string): Promise<T> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found');
      }
      throw new Error(`Weather API Error:${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch weather data');
  }
};
const fetchData = async <T>(
  cityName: string,
  apiKey: string,
  type: 'weather' | 'forecast'
): Promise<T> => {
  const url = `https://api.openweathermap.org/data/2.5/${type}?q=${cityName}&units=metric&appid=${apiKey}&lang=ja`;
  return fetchApi<T>(url);
};
export default fetchData;
