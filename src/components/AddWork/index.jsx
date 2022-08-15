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
import { includes } from "lodash";
import React, { useState } from "react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const tagNames = ["latest", "furniture", "office"];

const ITEM_HEIGHT = 48;
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
  file,
  setFile,
  openDialog,
  setOpenDialog,
  alertMessage,
  setAlertMessage,
}) {
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

  function handleFileUpload(fileEvent) {
    if (!includes(fileEvent?.type, "image")) {
      setAlertMessage({
        open: true,
        severity: "error",
        message: "Please upload image only",
      });
    } else if (fileEvent?.size >= 125000) {
      setAlertMessage({
        open: true,
        severity: "error",
        message: "Image Size is greater than 1 MB",
      });
    } else {
      setFile({
        ...file,
        fileData: fileEvent,
      });
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
              {file.fileData?.name}
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
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {tagNames.map((name) => (
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={file.tags.indexOf(name) > -1} />
                    <ListItemText primary={name} />
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
          <Button size="small" variant="contained" onClick={handleClose}>
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
