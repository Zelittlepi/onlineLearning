import React from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileList = ({ 
  files = [], 
  onDownload, 
  onPreview, 
  onDelete,
  showActions = true,
  className = '' 
}) => {

  const getFileIcon = (extension) => {
    if (!extension) return '📄';
    
    switch (extension.toLowerCase()) {
      case 'pdf':
        return '📕';
      case 'doc':
      case 'docx':
        return '📘';
      case 'ppt':
      case 'pptx':
        return '📊';
      case 'xls':
      case 'xlsx':
        return '📗';
      case 'txt':
      case 'md':
        return '📝';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
        return '🖼️';
      case 'zip':
      case 'rar':
      case '7z':
      case 'tar':
      case 'gz':
        return '🗜️';
      default:
        return '📄';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUploadTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const handleDownload = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const downloadUrl = `/api/files/download/${file.filePath}`;
      
      const response = await axios.get(downloadUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });

      // 创建下载链接
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName || file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      if (onDownload) {
        onDownload(file);
      }
    } catch (error) {
      console.error('文件下载失败:', error);
      alert('文件下载失败');
    }
  };

  const handlePreview = async (file) => {
    try {
      const token = localStorage.getItem('token');
      const previewUrl = `/api/files/preview/${file.filePath}`;
      
      // 对于图片和PDF，打开新窗口预览
      const previewableTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'pdf'];
      if (previewableTypes.includes(file.extension?.toLowerCase())) {
        const authUrl = `${previewUrl}?token=${encodeURIComponent(token)}`;
        window.open(authUrl, '_blank');
      } else {
        // 对于其他文件类型，直接下载
        handleDownload(file);
      }

      if (onPreview) {
        onPreview(file);
      }
    } catch (error) {
      console.error('文件预览失败:', error);
      alert('文件预览失败');
    }
  };

  const handleDelete = async (file) => {
    if (!window.confirm(`确定要删除文件 "${file.originalName || file.fileName}" 吗？`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const deleteUrl = `/api/files/${file.filePath}`;
      
      await axios.delete(deleteUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (onDelete) {
        onDelete(file);
      }
    } catch (error) {
      console.error('文件删除失败:', error);
      alert('文件删除失败');
    }
  };

  if (!files || files.length === 0) {
    return (
      <div className={`file-list empty ${className}`}>
        <div className="empty-state">
          <div className="empty-icon">📂</div>
          <p>暂无文件</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`file-list ${className}`}>
      <h5>附件文件 ({files.length})</h5>
      
      {files.map((file, index) => (
        <div key={file.id || index} className="file-item">
          <div className="file-info">
            <div className="file-icon">
              {getFileIcon(file.extension)}
            </div>
            
            <div className="file-details">
              <div className="file-name">
                {file.originalName || file.fileName}
              </div>
              <div className="file-meta">
                <span className="file-size">
                  {formatFileSize(file.fileSize)}
                </span>
                {file.uploadTime && (
                  <span className="upload-time">
                    {formatUploadTime(file.uploadTime)}
                  </span>
                )}
                <span className="file-type">
                  {file.extension?.toUpperCase() || '未知'}
                </span>
              </div>
            </div>
          </div>

          {showActions && (
            <div className="file-actions">
              <button 
                className="file-action-btn preview"
                onClick={() => handlePreview(file)}
                title="预览/打开"
              >
                👁️ 预览
              </button>
              
              <button 
                className="file-action-btn download"
                onClick={() => handleDownload(file)}
                title="下载"
              >
                ⬇️ 下载
              </button>

              {onDelete && (
                <button 
                  className="file-action-btn delete"
                  onClick={() => handleDelete(file)}
                  title="删除"
                >
                  🗑️ 删除
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileList;