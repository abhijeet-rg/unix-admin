import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import moment from "moment";

import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { DeleteForever, Edit } from "@mui/icons-material";
import AddWork from "../AddWork";
import { WorkImageWrapper, WorkImageListWrapper } from "./style";
import { db, storageDb } from "../../utils/firebaseCongif";
import { filter, includes, join, map, sortBy } from "lodash";
import useUploadFile from "../../hooks/useUploadFile";
import { deleteObject, ref } from "firebase/storage";

function WorkImageList() {
  const [allData, setAllData] = useState([]);
  const [showData, setShowData] = useState([]);
  const [workTags, setWorkTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(0);
  const [progress, setprogress] = useState(false);
  const [file, setFile] = useState({
    fileData: null,
    tags: [],
    priority: "",
  });
  const [deleteDocument, setDeleteDoc] = useState({
    name: "",
    open: false,
    id: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    open: false,
    severity: "",
    message: "",
  });

  const { handleUploadFile } = useUploadFile(
    setAlertMessage,
    setprogress,
    setOpenDialog,
    setAllData,
    setFile
  );

  useEffect(() => {
    getDocs(collection(db, "work-tags"))
      .then((data) => {
        setWorkTags(
          sortBy(
            map(data.docs, (docs) => ({ ...docs.data(), id: docs.id })),
            "priority"
          )
        );
      })
      .catch((error) => console.log("tags error ", error));
    getDocs(collection(db, "work-images"))
      .then((item) => {
        setAllData(map(item.docs, (docs) => ({ ...docs.data(), id: docs.id })));
      })
      .catch((error) => {
        console.log("Get Image Error ", error);
        setAlertMessage({
          open: true,
          severity: "error",
          message: "Failed to get image store",
        });
      });
  }, []);

  useEffect(() => {
    if (selectedTag === 0) {
      setShowData(allData);
    } else {
      setShowData(
        sortBy(
          filter(allData, (item) => includes(item.tags, selectedTag)),
          "priority"
        )
      );
    }
  }, [allData, selectedTag]);

  function handleUploadSubmit() {
    if (
      file.fileData instanceof Blob &&
      file.tags.length &&
      Number(file.priority) > 0
    ) {
      handleUploadFile({ ...file, time: moment().format() });
    } else {
      setAlertMessage({
        open: true,
        severity: "error",
        message: "Input is wrong or missing",
      });
    }
  }

  function handleDeleteDoc() {
    setprogress(true);
    deleteObject(ref(storageDb, `work-images/${deleteDocument.name}`))
      .then(() => {
        deleteDoc(doc(db, "work-images", deleteDocument.id))
          .then(() => {
            setprogress(false);
            setAlertMessage({
              open: true,
              severity: "success",
              message: "Image file deleted",
            });
            setAllData(filter(allData, (i) => i.id !== deleteDocument.id));
            setDeleteDoc({ name: "", open: false, id: "" });
          })
          .catch((error) => {
            setprogress(false);
            console.log("image file delete Error", error);
            setAlertMessage({
              open: true,
              severity: "error",
              message: "Uh-oh Failed to delete Image file",
            });
            setDeleteDoc({ name: "", open: false, id: "" });
          });
      })
      .catch((error) => {
        setprogress(false);
        console.log("image delete Error", error);
        setAlertMessage({
          open: true,
          severity: "error",
          message: "Uh-oh Failed to delete Image",
        });
        setDeleteDoc({ name: "", open: false, id: "" });
      });
  }

  return (
    <Box>
      <WorkImageWrapper>
        <div className="heading">
          <h2>Add Work</h2>
          <p>
            Add image to your webpage in work section with suitable Tag and
            Prioity.
          </p>
        </div>
        <Button
          size="small"
          variant="contained"
          onClick={() => setOpenDialog(true)}
        >
          Add Image
        </Button>
      </WorkImageWrapper>
      <Stack
        direction={"row"}
        justifyContent="center"
        gap={2}
        flexWrap={"wrap"}
      >
        <Button
          size="small"
          variant={selectedTag === 0 ? "contained" : "outlined"}
          onClick={() => setSelectedTag(0)}
        >
          All
        </Button>
        {map(workTags, (tag) => (
          <Button
            key={tag.id}
            size="small"
            variant={selectedTag === tag.tagId ? "contained" : "outlined"}
            onClick={() => setSelectedTag(tag.tagId)}
            sx={{ mx: "5px" }}
          >
            {tag.title}
          </Button>
        ))}
      </Stack>
      <AddWork
        allData={allData}
        file={file}
        setFile={setFile}
        workTags={workTags}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
        handleUploadSubmit={handleUploadSubmit}
      />
      <WorkImageListWrapper>
        <ul>
          {map(showData, (data) => (
            <li key={data.id}>
              <figure>
                <img src={data.imgSrc} alt="image" />
              </figure>
              <div className="detail">
                <h6>
                  <span>{data.name}</span>
                  <DeleteForever
                    onClick={() =>
                      setDeleteDoc({
                        open: true,
                        id: data.id,
                        name: data.name,
                      })
                    }
                  />
                </h6>
                <div className="tags">
                  Tags:{" "}
                  {join(
                    map(
                      filter(workTags, (item) =>
                        includes(data.tags, item?.tagId)
                      ),
                      (item) => item?.title
                    ),
                    ", "
                  )}
                </div>
                <ul className="priority-time">
                  <li>Priority: {data.priority}</li>
                  <li>{moment(data.time).fromNow()}</li>
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </WorkImageListWrapper>
      <Dialog
        open={deleteDocument.open}
        onClose={() => setDeleteDoc({ ...deleteDoc, open: false })}
      >
        <DialogTitle>Are you sure to delete ?</DialogTitle>
        <DialogContent>{deleteDocument.name}</DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={() => setDeleteDoc({ open: false, id: "" })}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleDeleteDoc}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop sx={{ color: "#fff", zIndex: "9999" }} open={progress}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}

export default WorkImageList;
