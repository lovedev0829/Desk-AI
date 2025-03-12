"use client";

import React, { useState } from "react";
import type { Theme, SxProps } from "@mui/material/styles";
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddLinkIcon from '@mui/icons-material/AddLink';
import Grid from '@mui/material/Grid2';
import LoadingButton from "@mui/lab/LoadingButton";
import {
  GithubIcon,
  GoogleIcon,
  TwitterIcon,
  FacebookIcon,
  LinkedinIcon,
  InstagramIcon,
} from 'src/assets/icons';
import { transcribeImportFile } from "src/api/transcribe";

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

  const [mediaLink, setMediaLink] = useState<string>("");
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState<boolean>(false)

const handleImport = async () => {

  if (mediaLink.trim() === "") return;

  try {
    
    setLoading(true)
    await transcribeImportFile(mediaLink).then((improtedFile: File) => {
        console.log("transcribeImportFile", improtedFile)
        setLoading(false)
        handleFileImport(improtedFile);
        setMediaLink("");
        handleClose();
    });

  } catch (error) {
    console.error("Error downloading the file:", error);
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
        <Grid container size={{ xs: 2 }} sx={{ display: "flex", justifyContent:"center", mb: 2 }}>
            <AddLinkIcon sx={{mr: 2 }}/> 
            <Typography variant="h6" id="modal-title" gutterBottom>
                Import from Link
            </Typography>
        </Grid>

        <Box sx={{ gap: 2, display: 'flex', flexWrap: 'wrap', justifyContent: "center", mb:2 }}>
            <GoogleIcon sx={{ width: 24 }} />
            <InstagramIcon sx={{ width: 24 }} />
            <FacebookIcon sx={{ width: 24 }} />
            <LinkedinIcon sx={{ width: 24 }} />
            <TwitterIcon sx={{ width: 24 }} />
            <GithubIcon sx={{ width: 24 }} />
        </Box>
        
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
