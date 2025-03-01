"use client";

import React, { useState } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLinkIcon from '@mui/icons-material/AddLink';
import Grid from '@mui/material/Grid2';

interface TranscribeAddLinkModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  sx?: SxProps<Theme>;
}

export default function TranscribeAddLinkModal({
  open,
  setOpen,
  sx,
}: TranscribeAddLinkModalProps) {
  const [mediaLink, setMediaLink] = useState("");

  const handleClose = () => setOpen(false);

  const handleImport = () => {
    if (mediaLink.trim() === "") return;
    console.log("Imported link:", mediaLink);
    setMediaLink("");
    handleClose();
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
          ...sx,
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Title */}
        
        <Grid container size={{ xs: 2 }}>
            <AddLinkIcon sx={{mr: 2 }}/> 
            <Typography variant="h6" id="modal-title" gutterBottom>
                Import from Link
            </Typography>
        </Grid>
        
       
        {/* Description */}
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                Import audio and video from YouTube, Dropbox, Google Drive, Facebook, Vimeo, X, audio/video URL, and dozens more platforms and services. The link must be publicly accessible.
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
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleImport}
          disabled={!mediaLink.trim()}
        >
          + Import
        </Button>
      </Box>
    </Modal>
  );
}
