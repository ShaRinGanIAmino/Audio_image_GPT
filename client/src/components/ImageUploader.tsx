import React, { useCallback, useState } from "react";
import { useDropzone, FileWithPath, FileRejection } from "react-dropzone";
import { arrow } from "../assets";

interface DropzoneProps {
  onFileUpload: (file: FileWithPath) => void;
}

const ImageUploader: React.FC<DropzoneProps> = ({ onFileUpload }) => {
  const [selectedFile, setSelectedFile] = useState<FileWithPath | null>(null);

  const onDrop = useCallback(
    (
      acceptedFiles: FileWithPath[],
      fileRejections: FileRejection[],
      event: React.DragEvent<HTMLDivElement>
    ) => {
      if (acceptedFiles.length > 0) {
        setSelectedFile(acceptedFiles[0]);
        onFileUpload(acceptedFiles[0]);
      }
    },
    []
  );
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  console.log(selectedFile);
  return (
    <div
      {...getRootProps()}
      className={`dropzone ${
        isDragActive ? "active" : ""
      } bg-bg_user w-full h-full rounded-xl flex justify-center items-center border-dashed border-typo border-[1px] cursor-pointer p-4`}
    >
      <input {...getInputProps()} accept="image/*" />
      {selectedFile ? (
        <p className=" w-full break-words text-typo text-center">
          {selectedFile.path}
        </p>
      ) : (
        <div className=" flex flex-col justify-center items-center gap-4">
          <p className=" w-full break-words text-[#CACACA]">
            Drop the image or upload it
          </p>
          <img src={arrow} alt="upload" className="upload" />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
