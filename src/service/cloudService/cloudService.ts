import axios from "axios";

// === CẤU HÌNH ===
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


interface ProgressCallback {
  (percent: number): void;
}

export const uploadToCloudinary = async (
  file: File,
  onProgress?: ProgressCallback
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  // Tự động nhận diện audio/video
  if (file.type.startsWith("video/") || file.type.startsWith("audio/")) {
    formData.append("resource_type", "auto");
  }

  try {
    console.log(`Đang upload: ${file.name} (${file.type})`);

    const response = await axios.post<{ secure_url?: string }>(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        // BỎ QUA LỖI TYPE CHO onUploadProgress
        // @ts-ignore
        onUploadProgress: (progressEvent: any) => {
          if (onProgress && progressEvent.lengthComputable) {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percent);
          }
        },
      } as any // Dùng as any để bỏ qua kiểm tra type
    );

    if (response.data && response.data.secure_url) {
      return response.data.secure_url;
    }

    throw new Error("Không nhận được secure_url");
  } catch (error: any) {
    const msg =
      error.response?.data?.error?.message ||
      error.message ||
      "Lỗi upload không xác định";
    console.error("Upload error:", msg);
    throw new Error(msg);
  }
};