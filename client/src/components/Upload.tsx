import ReactDOM from "react-dom";
import { ImageUploader } from ".";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";
import axios from "axios";

const Upload = (props: any) => {
  const handleCloseClick = () => {
    props.onClose();
  };
  const [file, setFile] = useState<FileWithPath | null>(null);

  const handleFileUpload = (file: File) => {
    // Handle file upload logic here
    setFile(file);
  };

  const submitFile = async () => {
    if (!file) {
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/uploadfile/",
        formData
      );
      //console.log("File uploaded successfully:", response.data.extracted_text);
      props.onUploadSuccess(response.data.extracted_text);
    } catch (error) {
      console.error("There was an error uploading the file:", error);
    }
    handleCloseClick();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center m-4">
      <div className="fixed inset-0 bg-black opacity-10"></div>
      <div className="bg-primary bg-white w-3/4 ss:w-2/3 md:w-2/5 h-[60%] ss:h-4/5 sm:p-8 p-4 rounded-xl z-10 flex flex-col justify-center items-center ">
        <div className=" w-[95%] h-4/5 rounded-xl ">
          <ImageUploader onFileUpload={handleFileUpload} />
        </div>
        <div className="w-[95%] h-1/5 flex flex-col ss:flex-row justify-around mt-4 ss:mt-0 ss:justify-between items-center">
          <button
            className="border-[1px] text-typo border-typo py-1 w-full ss:w-0 flex justify-center items-center px-0 ss:px-20 rounded-xl font-light font-mont hover:text-white hover:bg-typo hover:transition"
            onClick={handleCloseClick}
          >
            Close
          </button>
          <button
            onClick={submitFile}
            className=" text-typo bg-bg_bot py-1 w-full ss:w-0 flex justify-center items-center px-0 ss:px-20 rounded-xl font-light font-mont hover:text-white hover:bg-typo hover:transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Upload;
