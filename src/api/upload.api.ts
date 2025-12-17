import { apiClient } from "@/api/client";

interface UploadResponse{
    url:string
}
export const uploadImageAndGetUrl = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file); // key 'file' phải đúng theo BE (thường là 'file')
  
    const res = await apiClient.post<UploadResponse>(
      '/file/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  
    return res.data.url;
  };
  
