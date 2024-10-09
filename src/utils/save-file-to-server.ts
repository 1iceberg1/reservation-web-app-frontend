import axios, { endpoints } from './axios';

const saveFileToServer = async (file: File, storageId: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('storageId', storageId);

    const { data } = await axios.post(endpoints.upload, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('File uploaded successfully:', data);

    return data.id;
  } catch (error) {
    console.error('Error uploading file:', error);
  }
  return '';
};

export default saveFileToServer;
