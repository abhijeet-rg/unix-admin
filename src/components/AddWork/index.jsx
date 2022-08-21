import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { Stack } from "@mui/system";
import { filter, includes, join, map } from "lodash";
import imageCompression from "browser-image-compression";
import { some } from "lodash";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const tagNames = ["latest", "furniture", "office"];

const ITEM_HEIGHT = 62;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function AddWork({
  allData,
  file,
  setFile,
  workTags,
  openDialog,
  setOpenDialog,
  alertMessage,
  setAlertMessage,
  handleUploadSubmit,
}) {
  const [compressing, setCompressing] = useState(false);
  function handleClose() {
    setOpenDialog(false);
    setFile({
      fileData: null,
      tags: [],
      priority: "",
    });
  }

  function handleAlertClose() {
    setAlertMessage({
      ...alertMessage,
      open: false,
    });
  }

  async function handleFileUpload(fileEvent) {
    if (!includes(fileEvent?.type, "image")) {
      setAlertMessage({
        open: true,
        severity: "error",
        message: "Please upload image only",
      });
    } else if (some(allData, ["name", fileEvent.name])) {
      setAlertMessage({
        open: true,
        severity: "error",
        message: "File already exists",
      });
    } else if (fileEvent?.size <= 125000) {
      setFile({
        ...file,
        fileData: fileEvent,
      });
    } else {
      const options = {
        maxSizeMB: 1,
        useWebWorker: true,
      };

      try {
        setCompressing(true);
        const compressedFile = await imageCompression(fileEvent, options);
        await setFile({
          ...file,
          fileData: compressedFile,
        });
        setCompressing(false);
      } catch (error) {
        setAlertMessage({
          open: true,
          severity: "error",
          message: "Something went wrong !",
        });
        setCompressing(false);
      }
    }
  }

  function handleChangeTag(event) {
    const {
      target: { value },
    } = event;
    setFile({
      ...file,
      tags: typeof value === "string" ? value.split(",") : value,
    });
  }

  function handlePriorityChange(event) {
    setFile({
      ...file,
      priority: event.target.value,
    });
  }

  return (
    <>
      <Dialog maxWidth="sm" open={openDialog} onClose={handleClose}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontWeight: "600",
          }}
        >
          Add Image{" "}
          <Button
            variant="contained"
            component="label"
            size="small"
            onChange={(e) => handleFileUpload(e.target.files[0])}
          >
            Select File
            <input hidden accept="image/*" type="file" />
          </Button>
        </DialogTitle>
        <DialogContent>
          <Typography
            variant="h5"
            sx={{
              fontSize: "18px",
            }}
          >
            File :-{" "}
            <Typography variant="span" sx={{ opacity: 0.7 }}>
              {compressing ? "Compressing..." : file.fileData?.name}
            </Typography>
          </Typography>

          <Stack direction={"row"} gap={2} flexWrap="wrap" sx={{ mt: "20px" }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={file.tags}
                onChange={handleChangeTag}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => {
                  const data = filter(workTags, (item) =>
                    includes(selected, item?.tagId)
                  );
                  return join(
                    map(data, (item) => item?.title),
                    ", "
                  );
                }}
                MenuProps={MenuProps}
              >
                {workTags.map((item) => (
                  <MenuItem key={item?.id} value={item?.tagId}>
                    <Checkbox checked={file.tags.indexOf(item?.tagId) > -1} />
                    <ListItemText primary={item?.title} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              id="outlined-number"
              label="Priority"
              size="small"
              type="number"
              value={file.priority}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={handlePriorityChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={handleUploadSubmit}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={alertMessage.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alertMessage.severity}
          sx={{ width: "100%" }}
        >
          {alertMessage.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default AddWork;
