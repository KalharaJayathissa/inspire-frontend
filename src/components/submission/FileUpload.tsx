import React from 'react';
import { FileUploadProps } from './types';

const FileUpload: React.FC<FileUploadProps> = ({
  file,
  isDragOver,
  fileInputRef,
  onFileChange,
  onDragOver,
  onDragLeave,
  onDrop
}) => {
  return (
    <div className="space-y-4">
      <label
        htmlFor="file"
        className="block text-sm font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-purple-400 dark:to-teal-400 mb-3"
      >
        PDF Document Upload
      </label>

      {/* Premium Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 
          backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          shadow-[0_8px_32px_rgba(31,38,135,0.15)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]
          hover:shadow-[0_12px_40px_rgba(31,38,135,0.25)] dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]
          hover:scale-[1.02] hover:-translate-y-1
          ${
            isDragOver
              ? "border-blue-400/60 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-teal-50/50 dark:from-blue-900/30 dark:via-purple-900/20 dark:to-teal-900/30 scale-105 shadow-[0_16px_50px_rgba(59,130,246,0.35)]"
              : "border-gray-200/40 dark:border-gray-600/40 hover:border-blue-300/50 dark:hover:border-blue-500/50"
          }
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          ref={fileInputRef}
          id="file"
          type="file"
          accept=".pdf"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-describedby="file-help"
        />

        <div className="space-y-4">
          <div className="relative">
            <div className="text-6xl mb-4 transform transition-transform duration-300 hover:scale-110">
              {file ? "✅" : "📄"}
            </div>
            {!file && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-teal-400/20 rounded-full blur-xl"></div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-base font-medium bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent dark:from-gray-200 dark:to-gray-100">
              {file ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-lg flex items-center justify-center gap-2">
                  <span className="animate-bounce">✓</span>
                  {file.name}
                </span>
              ) : (
                <>
                  <span className="font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
                    Click to upload
                  </span>
                  <span className="mx-2 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                  <span className="font-semibold">
                    drag and drop
                  </span>
                </>
              )}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 px-4 py-2 rounded-full bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30">
              <span className="font-medium">
                Accepted formats:
              </span>{" "}
              PDF files only
            </p>
          </div>
        </div>

        {/* Animated border glow effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-teal-500/20 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none blur-sm"></div>
      </div>

      <div className="mt-3 p-3 rounded-xl bg-gradient-to-r from-gray-50/50 to-gray-100/50 dark:from-gray-800/30 dark:to-gray-700/30 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30">
        <p
          id="file-help"
          className="text-sm font-medium bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent dark:from-gray-300 dark:to-gray-100"
        >
          {file ? (
            <span className="flex items-center justify-between">
              <span className="text-emerald-600 dark:text-emerald-400">
                📎 {file.name}
              </span>
              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full text-black dark:text-black font-medium">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>💡</span>
              <span>
                Select a PDF file to upload your document
              </span>
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default FileUpload;