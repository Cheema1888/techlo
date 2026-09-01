"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from "lucide-react";

interface UploadedFileItem {
  id: string;
  name: string;
  size: string;
  type: string;
}

interface FileUploadDropzoneProps {
  files: UploadedFileItem[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFileItem[]>>;
  acceptedFormats?: string;
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  files,
  setFiles,
  acceptedFormats = ".zip,.rar,.stl,.step,.stp,.pdf,.kicad_pcb,.kicad_sch",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFiles = (fileList: FileList) => {
    const newItems: UploadedFileItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const f = fileList[i];
      const sizeStr =
        f.size > 1024 * 1024
          ? (f.size / (1024 * 1024)).toFixed(1) + " MB"
          : (f.size / 1024).toFixed(0) + " KB";
      newItems.push({
        id: `f-${Date.now()}-${i}`,
        name: f.name,
        size: sizeStr,
        type: f.name.split(".").pop()?.toUpperCase() || "FILE",
      });
    }
    setFiles((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="space-y-3">
      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-techlo-cyan bg-techlo-cyan/10 shadow-glow-cyan"
            : "border-techlo-border hover:border-techlo-cyan/50 bg-techlo-surface/40 hover:bg-techlo-surface/70"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFormats}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-techlo-surface border border-techlo-border flex items-center justify-center text-techlo-cyan shadow-sm">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-white">
            Drag & drop project files here, or <span className="text-techlo-cyan">Browse</span>
          </p>
          <p className="text-xs text-slate-400">
            Supports Gerber Archive (.zip), 3D CAD (.stl, .step), KiCad & Schematics (.pdf) up to 50MB
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-bold text-slate-300 block">
            Attached Files ({files.length})
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-techlo-surface border border-techlo-border text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="px-2 py-1 bg-techlo-cyan/20 text-techlo-cyan rounded font-mono font-bold text-[10px]">
                    {file.type}
                  </div>
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{file.size}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
