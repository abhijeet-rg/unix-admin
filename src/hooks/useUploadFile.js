import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storageDb } from "../utils/firebaseCongif";

function useUploadFile(
  setAlertMessage,
  setprogress,
  setOpenDialog,
  setAllData,
  setFile
) {
  const imagesCollectionRef = collection(db, "work-images");

  function handleUploadFile(file) {
    const storageRef = ref(storageDb, `work-images/${file?.fileData?.name}`);
    setprogress(true);
    uploadBytes(storageRef, file?.fileData)
      .then((value) => {
        getDownloadURL(value.ref)
          .then((url) => {
            const document = {
              name: file.fileData.name,
              tags: file.tags,
              priority: file.priority,
              imgSrc: url,
              time: file.time,
            };
            addDoc(imagesCollectionRef, document)
              .then((data) => {
                setOpenDialog(false);
                setprogress(false);
                setAllData((item) => [...item, { id: data.id, ...document }]);
                setAlertMessage({
                  open: true,
                  severity: "success",
                  message: "Image file Uploaded",
                });
                setFile({
                  fileData: null,
                  tags: [],
                  priority: "",
                });
              })
              .catch((err) => {
                console.log("Get Url Error ", err);
                setprogress(false);
                setAlertMessage({
                  open: true,
                  severity: "error",
                  message: "Failed to store the file",
                });
              });
          })
          .catch((error) => {
            console.log("Get Url Error ", error);
            setprogress(false);
            setAlertMessage({
              open: true,
              severity: "error",
              message: "Failed to get the URL",
            });
          });
      })
      .catch((error) => {
        console.log("File Upload Error ", error);
        setprogress(false);
        setAlertMessage({
          open: true,
          severity: "error",
          message: "File Uploading Failed",
        });
      });
  }

  return { handleUploadFile };
}

export default useUploadFile;
