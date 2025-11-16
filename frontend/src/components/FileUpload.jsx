import React, { useState, useRef } from 'react';
import axios from 'axios';
import './FileUpload.css';

const FileUpload = ({ 
  onUploadSuccess, 
  onUploadError, 
  multiple = false, 
  category = 'general',
  accept = '',
  maxSize = 50, // MB
  disabled = false,
  className = ''
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // 支持的文件类型
  const allowedExtensions = [
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx',
    'txt', 'md', 'jpg', 'jpeg', 'png', 'gif', 'bmp',
    'zip', 'rar', '7z', 'tar', 'gz'
  ];

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragOver(false);
    
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const validateFile = (file) => {
    // 检查文件大小
    const maxSizeBytes = maxSize * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return `文件 "${file.name}" 大小超过 ${maxSize}MB 限制`;
    }

    // 检查文件类型
    const extension = getFileExtension(file.name).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return `不支持的文件类型: ${extension}`;
    }

    return null;
  };

  const uploadFiles = async (files) => {
    if (disabled || uploading) return;

    // 验证所有文件
    for (const file of files) {
      const error = validateFile(file);
      if (error) {
        if (onUploadError) {
          onUploadError(error);
        }
        return;
      }
    }

    setUploading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      if (multiple) {
        files.forEach(file => {
          formData.append('files', file);
        });
        formData.append('category', category);

        const response = await axios.post('/api/files/upload-multiple', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            // 这里可以添加进度回调
          }
        });

        if (response.data.success) {
          if (onUploadSuccess) {
            onUploadSuccess(response.data.data);
          }
        }
      } else {
        formData.append('file', files[0]);
        formData.append('category', category);

        const response = await axios.post('/api/files/upload', formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.success) {
          if (onUploadSuccess) {
            onUploadSuccess(response.data.data);
          }
        }
      }
    } catch (error) {
      console.error('文件上传失败:', error);
      const errorMessage = error.response?.data?.message || '文件上传失败';
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
      // 清空文件输入框
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getFileExtension = (filename) => {
    return filename.split('.').pop() || '';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`file-upload ${className}`}>
      <div 
        className={`upload-area ${dragOver ? 'drag-over' : ''} ${disabled ? 'disabled' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && !uploading && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          disabled={disabled || uploading}
        />

        {uploading ? (
          <div className="upload-progress">
            <div className="loading-spinner"></div>
            <p>正在上传文件...</p>
          </div>
        ) : (
          <div className="upload-content">
            <div className="upload-icon">📁</div>
            <h4>
              {multiple ? '点击选择文件或拖拽多个文件到此处' : '点击选择文件或拖拽文件到此处'}
            </h4>
            <p>
              支持格式: PDF, Word, Excel, PowerPoint, 图片, 压缩包等
            </p>
            <p className="size-limit">
              单文件大小限制: {maxSize}MB
            </p>
            <div className="upload-button">
              <button type="button" disabled={disabled || uploading}>
                选择文件
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="file-types-info">
        <h5>支持的文件类型:</h5>
        <div className="file-type-tags">
          <span className="type-tag">📕 PDF</span>
          <span className="type-tag">📘 Word</span>
          <span className="type-tag">📗 Excel</span>
          <span className="type-tag">📊 PPT</span>
          <span className="type-tag">📝 文本</span>
          <span className="type-tag">🖼️ 图片</span>
          <span className="type-tag">🗜️ 压缩包</span>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;