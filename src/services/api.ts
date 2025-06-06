type FetchOptions = {
  signal?: AbortSignal;
};

const fetchApi = async <T>(url: string, options?: FetchOptions): Promise<T> => {
  try {
    const response = await fetch(url, { signal: options?.signal });
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found');
      }
      throw new Error(`Weather API Error:${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch weather data');
  }
};
const fetchData = async <T>(
  cityName: string,
  apiKey: string,
  type: 'weather' | 'forecast',
  options?: FetchOptions
): Promise<T> => {
  const url = `https://api.openweathermap.org/data/2.5/${type}?q=${cityName}&units=metric&appid=${apiKey}&lang=ja`;
  return fetchApi<T>(url, options);
};
export default fetchData;
