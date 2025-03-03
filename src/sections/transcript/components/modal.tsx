"use client";

import React, { useState, useCallback } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLinkIcon from "@mui/icons-material/AddLink";
import Grid from "@mui/material/Grid2";
import {
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  InstagramIcon,
} from "src/assets/icons";
import LoadingButton from "@mui/lab/LoadingButton";

interface TranscribeAddLinkModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  handleFileImport: (file: File) => void;
  sx?: SxProps<Theme>;
}

export default function TranscribeAddLinkModal({
  open,
  setOpen,
  handleFileImport,
  sx,
}: TranscribeAddLinkModalProps) {
  const [mediaLink, setMediaLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setMediaLink("");
    setOpen(false);
  }, [setOpen]);

  const extractFilename = (url: string) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      return decodedUrl.split("/").pop()?.split("?")[0] || "downloaded_file";
    } catch {
      return "downloaded_file";
    }
  };

  const handleImport = async () => {
    if (!mediaLink.trim()) return;

    try {
      setLoading(true);

      const response = await fetch(mediaLink);
      if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);

      const blob = await response.blob();
      const filename = extractFilename(mediaLink);
      const file = new File([blob], filename, { type: blob.type });

      handleFileImport(file);
      handleClose();
    } catch (error) {
      console.error("Error downloading the file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
      <Box
        sx={{
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          mx: "auto",
          mt: "10%",
          textAlign: "center",
          position: "relative",
          ...sx,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
          aria-label="Close modal"
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Title */}
        <Grid container sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <AddLinkIcon sx={{ mr: 2 }} />
          <Typography variant="h6" id="modal-title" gutterBottom>
            Import from Link
          </Typography>
        </Grid>

        {/* Supported Platforms Icons */}
        <Box sx={{ gap: 2, display: "flex", flexWrap: "wrap", justifyContent: "center", mb: 2 }}>
          {[GoogleIcon, InstagramIcon, FacebookIcon, LinkedinIcon, TwitterIcon, GithubIcon].map(
            (Icon, index) => (
              <Icon key={index} sx={{ width: 24 }} />
            )
          )}
        </Box>

        {/* Description */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          Import audio and video from YouTube, Dropbox, Google Drive, Facebook, Vimeo, X, and more.
          The link must be publicly accessible.
        </Typography>

        {/* Input Field */}
        <TextField
          fullWidth
          label="Media Link"
          variant="outlined"
          placeholder="https://www.youtube.com/watch?v=..."
          value={mediaLink}
          onChange={(e) => setMediaLink(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Import Button */}
        <LoadingButton
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleImport}
          disabled={!mediaLink.trim()}
          loading={loading}
        >
          + Import
        </LoadingButton>
      </Box>
    </Modal>
  );
}