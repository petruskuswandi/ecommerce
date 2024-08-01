import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Fade,
  IconButton,
  Typography,
  Modal,
  Button,
  LinearProgress,
  Link,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import iziToast from "izitoast";
import { useUploadServicesMutation } from "../../../state/api/serviceApi";

const UploadServices = ({ open, close, onUploadSuccess }) => {
  const [uploadServices, { data, isSuccess, isLoading, error, reset }] =
    useUploadServicesMutation();
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
        const formData = new FormData();
        formData.append("file", file);
        uploadServices(formData);
      }
    },
    [uploadServices]
  );

  const resetUpload = () => {
    setFileName("");
    setUploadStatus("idle");
    reset();
  };

  useEffect(() => {
    if (isSuccess) {
      setUploadStatus("success");
      iziToast.success({
        title: "Success",
        message: data?.message,
        position: "topRight",
        timeout: 3000,
      });
      reset();
      close();
      onUploadSuccess();
    }

    if (error) {
      setUploadStatus("error");
      iziToast.error({
        title: "Error",
        message: error?.data?.message || "An error occurred during upload",
        position: "topRight",
        timeout: 5000,
      });
      reset();
    }
  }, [isSuccess, data, error, reset, close, onUploadSuccess]);

  const downloadTemplate = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      {
        name: "Suede Deep Clean",
        description: "Specialized cleaning service for suede shoes.",
        category: "Deep Cleaning",
        price: 50000,
        estimatedDuration: JSON.stringify({ days: 0, hours: 8 }),
        materials: JSON.stringify([
          { name: "Suede Cleaner", cost: 2000 },
          { name: "Suede Brush", cost: 1000 },
        ]),
        laborCost: 35000,
        applicableShoeTypes: JSON.stringify(["Suede"]),
        images: JSON.stringify([
          { link: "https://example.com/images/suede-clean-1.jpg" },
          { link: "https://example.com/images/suede-clean-2.jpg" },
        ]),
        note: "Includes application of suede protector after cleaning.",
      },
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Services");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(data, "services_template.xlsx");
  };

  return (
    <Modal open={open} onClose={close}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 400 },
            maxWidth: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            outline: "none",
          }}
        >
          <IconButton
            onClick={close}
            sx={{ position: "absolute", right: 8, top: 8 }}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2" gutterBottom>
            Upload Services
          </Typography>

          {uploadStatus === "loading" ? (
            <Box sx={{ width: "100%", mt: 2 }}>
              <LinearProgress />
            </Box>
          ) : (
            <>
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 3,
                  textAlign: "center",
                  cursor: "pointer",
                  "&:hover": { borderColor: "primary.main" },
                }}
                onClick={() => document.getElementById("file-input").click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                />
                <CloudUploadIcon sx={{ fontSize: 48, color: "primary.main" }} />
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {fileName || "Click or drag file to upload"}
                </Typography>
              </Box>
              {uploadStatus === "error" && (
                <Box sx={{ textAlign: "center", color: "error.main", mt: 2 }}>
                  <ErrorOutlineIcon sx={{ fontSize: 24 }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Upload failed. Please try again.
                  </Typography>
                </Box>
              )}
              {uploadStatus === "success" && (
                <Box sx={{ textAlign: "center", color: "success.main", mt: 2 }}>
                  <CheckCircleOutlineIcon sx={{ fontSize: 24 }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Upload successful!
                  </Typography>
                </Box>
              )}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Link
                  component="button"
                  variant="body2"
                  onClick={downloadTemplate}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <DownloadIcon sx={{ mr: 1 }} />
                  Download Template
                </Link>
              </Box>
            </>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={uploadStatus === "idle" ? close : resetUpload}
            disabled={uploadStatus === "loading"}
          >
            {uploadStatus === "idle"
              ? "Cancel"
              : uploadStatus === "loading"
              ? "Uploading..."
              : "Try Again"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default UploadServices;
