export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileType = (mimeType) => {
  if (!mimeType) return 'Tệp';
  
  if (mimeType.includes('pdf')) return 'PDF';
  if (mimeType.includes('word')) return 'Tài liệu Word';
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'Bảng tính Excel';
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'Trình chiếu';
  if (mimeType.includes('text/plain')) return 'Tệp văn bản';
  if (mimeType.includes('image')) return 'Hình ảnh';
  
  return 'Tệp';
};
