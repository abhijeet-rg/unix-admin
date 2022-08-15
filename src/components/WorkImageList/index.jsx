import { Button } from "@mui/material";
import { useState } from "react";
import AddWork from "../AddWork";
import { WorkImageWrapper } from "./style";

function WorkImageList() {
  const [file, setFile] = useState({
    fileData: null,
    tags: [],
    priority: "",
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState({
    open: false,
    severity: "",
    message: "",
  });
  return (
    <>
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
      <AddWork
        file={file}
        setFile={setFile}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        alertMessage={alertMessage}
        setAlertMessage={setAlertMessage}
      />
    </>
  );
}

export default WorkImageList;
