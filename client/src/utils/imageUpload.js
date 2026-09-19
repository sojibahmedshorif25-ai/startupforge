export const uploadImageToCloud = async (file) => {
  if (!file) return null;
  const imgbbKey = import.meta.env.VITE_IMGBB_KEY;
  if (imgbbKey && imgbbKey !== 'undefined' && imgbbKey.trim() !== '') {
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        return data.data.url;
      }
    } catch {
      // fallback to base64 Data URL
    }
  }

  // Base64 Data URL Fallback (Works 100% locally and in production without external API keys)
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
};
