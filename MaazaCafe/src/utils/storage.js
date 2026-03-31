export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
};

export const removeData = (key) => {
  localStorage.removeItem(key);
};

export const clearAllData = () => {
  localStorage.clear();
};