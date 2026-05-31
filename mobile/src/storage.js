import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async getJSON(key, fallback = null) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  async setJSON(key, value) {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
  async remove(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  },
};
