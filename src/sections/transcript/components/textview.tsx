'use client';

import React, { useRef, useState } from 'react';
import type { Theme, SxProps } from '@mui/material/styles';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import type { TranscriptionResponse } from 'src/api/transcribe';
import { FileThumbnail } from 'src/components/file-thumbnail';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { jsPDF } from 'jspdf';

// Helper function to format seconds into mm:ss
function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

interface TranscribeTextViewProps {
  transcription: TranscriptionResponse;
  sx?: SxProps<Theme>;
}

export default function TranscribeTextView({
  transcription,
  sx,
}: TranscribeTextViewProps) {

  const data = transcription;
  const [toggleTimeStamp, setToggleTimeStamp] = useState(true);
  const transcriptPanel = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioSrc = data.audio_data
    ? `data:audio/mp3;base64,${data.audio_data}`
    : `/audio/${data.filename}`;

  const handleSegmentClick = (start: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.current.play();
    }
  };

  // Download PDF from the HTML content of the transcript panel.
  const handleDownloadPDF = async (): Promise<void> => {
    if (transcriptPanel.current) {
      const doc = new jsPDF();
      // Use jsPDF's html method to convert the panel HTML to PDF.
      await doc.html(transcriptPanel.current.innerText, {
        callback: (doc) => {
          doc.save(`${data.filename}_transcript.pdf`);
        },
      });
    }
  };

  // Download DOC: Extract the innerText and create a DOC file.
  const handleDownloadDOC = (): void => {
    if (transcriptPanel.current) {
        const textContent = transcriptPanel.current.innerText;
        const blob = new Blob([textContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.filename}_transcript.doc`;
        link.click();
        URL.revokeObjectURL(url);
    }
  };

  // Download TXT: Extract the innerText and create a plain text file.
  const handleDownloadTXT = (): void => {
    if (transcriptPanel.current) {
        const textContent = transcriptPanel.current.innerText;
        const blob = new Blob([textContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.filename}_transcript.txt`;
        link.click();
        URL.revokeObjectURL(url);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, p: 2, ...sx }}>
      {/* Transcription Card */}
      <Card component="div" sx={{ maxWidth: 900, margin: 'auto', mt: 4 }}>
        <CardContent ref={transcriptPanel}>
          <Typography variant="h5" gutterBottom>
            {data.filename}
          </Typography>
  
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {data.dateTime}
          </Typography>
  
          <Box sx={{ mt: 2 }}>
            {data.segments.map((segment, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  cursor: 'pointer',
                  p: 1,
                  borderRadius: 1,
                  '&:hover': { backgroundColor: 'grey.200' },
                }}
                onClick={() => handleSegmentClick(segment.start)}
              >
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Typography
                    variant="caption"
                    style={{ display: toggleTimeStamp ? 'block' : 'none' }}
                    color="gray"
                  >
                    ({formatTime(segment.start)} - {formatTime(segment.end)})
                  </Typography>
                  <Typography variant="body1">{segment.text}</Typography>
                </Stack>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
  
      {/* Floating Audio Player */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          backgroundColor: 'white',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000,
          p: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <audio controls src={audioSrc} style={{ width: '60%' }} ref={audioRef}>
          Your browser does not support the audio element.
        </audio>
      </Box>
  
      {/* Floating Side Menu */}
      <Box
        sx={{
          position: 'fixed',
          right: 20,
          top: '48%',
          transform: 'translateY(-50%)',
          width: 300,
          backgroundColor: 'white',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          borderRadius: 2,
          zIndex: 1000,
          p: 2,
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Typography variant="h6" gutterBottom>
          Export
        </Typography>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton onClick={handleDownloadPDF}>
              <FileThumbnail file="example.pdf" sx={{ width: '25px', mr:1 }} />
              <ListItemText primary="Download PDF" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleDownloadDOC}>
              <FileThumbnail file="example.doc" sx={{ width: '25px', mr:1 }} />
              <ListItemText primary="Download DOCX" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleDownloadTXT}>
              <TextSnippetIcon sx={{ fontSize: 30, mr:1 }} />
              <ListItemText primary="Download TXT" />
            </ListItemButton>
          </ListItem>
        </List>

        {/* Advanced Export Section */}
        <Typography variant="h6" sx={{ mt: 3 }} gutterBottom>
          Advanced Export
        </Typography>
        <List disablePadding>
          <ListItem disablePadding>
            <ListItemButton>
              <FormControlLabel
                label="Show Timestamps"
                control={
                  <Checkbox
                    size="medium"
                    defaultChecked={true}
                    onChange={() => setToggleTimeStamp(!toggleTimeStamp)}
                  />
                }
                sx={{ textTransform: 'capitalize' }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" id="chatgpt" style={{ width: 25, marginRight: 7 }}>
                <path fill="#67a090" fillRule="evenodd" d="m60,12c0-4.42-3.58-8-8-8H12c-4.42,0-8,3.58-8,8v40c0,4.42,3.58,8,8,8h40c4.42,0,8-3.58,8-8V12h0Z"></path>
                <path fill="#fff" fillRule="evenodd" d="m19.6,18.63c-7.88,1.09-10.82,11.17-5.88,16.95-1.18,3.49.16,7.91,2.94,10.95,2.72,2.97,6.71,4.59,10.81,2.96.03.25.13.5.29.72,2.34,3.07,6.8,3.58,10.7,2.07,3.11-1.2,5.78-3.63,6.68-6.73,2.64-.76,4.85-2.85,6.13-5.48,1.79-3.7,1.74-8.39-1.34-11.68.1-.19.18-.38.24-.54,1.03-2.86.36-6.18-1.44-8.84-2.39-3.53-6.7-5.87-11.27-4.56-.1-.13-.2-.25-.29-.37-2.32-3.04-6.73-3.8-10.6-2.61-3.45,1.06-6.37,3.63-6.98,7.15h0Zm19.59,13.41l.07,9.81c0,.51-.25.99-.69,1.27,0,0-4.63,2.99-8.56,5.11.05.05.09.1.14.16,1.57,2.06,4.61,2.1,7.23,1.09,2.69-1.04,5.07-3.26,5.07-6.18v-9.18l-3.28-2.09h0Zm-22.88,5.71c-.24,2.29.85,4.87,2.57,6.75,2,2.18,4.97,3.46,7.99,1.98,3.19-1.55,7.69-4.36,9.39-5.44l-.02-2.96-8.97,4.9c-.43.23-.94.25-1.37.03,0,0-5.74-2.78-9.59-5.28h0Zm28.47-5.72c.43.28.69.75.69,1.27v8.9c1.33-.73,2.41-1.98,3.11-3.43,1.48-3.06,1.31-7.1-2.08-9.38-2.86-1.93-6.56-4.13-8.11-5.04l-3.07,1.68,9.45,6.01h0Zm-25.28-10.34c-5.77,1.28-7.26,9.69-2.03,13.22,2.93,1.98,7.36,4.23,9.05,5.07l3.13-1.71-9.45-6.02c-.43-.27-.69-.75-.69-1.26v-9.3h0Zm12.82,5.97s-3.5,1.91-3.53,1.93v4.59l3.86,2.46s3.52-1.92,3.57-1.94l-.03-4.57-3.86-2.46h0Zm2.31-11.97c-1.64-1.89-4.59-2.13-7.15-1.34-2.64.81-4.98,2.78-4.98,5.65v10.18l3.28,2.09-.08-10.82c0-.54.28-1.04.75-1.31,0,0,4.31-2.49,8.18-4.45h0Zm12.87,10.75c.51-1.89-.06-4-1.23-5.73-1.91-2.81-5.49-4.68-9.17-2.89-3.09,1.51-6.82,3.6-8.39,4.49l.03,3.9,8.97-4.9c.46-.25,1.02-.24,1.47.02,0,0,4.62,2.67,8.33,5.11h0Z"></path>
              </svg>
                <Box>
                    <ListItemText primary="ChatGPT" />
                    <Typography variant="caption">
                        Summarize and chat with this transcript
                    </Typography>
                </Box>
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="google-translate" style={{ width: 25, marginRight: 7 }}>
                <path fill="#e6e6e6" d="M479.068 96h-216.32l-22.515 87.1-8.083 57.242 43.329 120.845 6.957 146.639h196.633c18.184 0 32.932-14.748 32.932-32.932V128.932C512 110.748 497.252 96 479.068 96z"></path>
                <path fill="#3a5bbc" d="m368.696 416-86.261 91.826L251.882 416l12.466-33.479z"></path>
                <path fill="gray" d="M469.565 244.174v-20.87h-79.304v-29.217h-20.87v29.217H297.92v20.87h115.89c-6.446 13.572-17.621 35.215-32.978 58.035-14.132-17.649-23.062-29.931-23.168-30.077l-6.129-8.445-16.892 12.255 6.127 8.445c.477.658 10.876 14.963 27.338 35.3-11.222 13.749-31.808 36.106-42.655 46.952l14.756 14.756c9.362-9.362 28.774-30.214 41.426-45.327 16.459 19.553 32.523 37.194 47.854 52.526l7.378 7.378 14.758-14.755-7.378-7.378C428.408 358 411.728 339.575 394.6 319.04c22.133-31.823 36.48-61.956 42.2-74.866h32.765z"></path>
                <path fill="#518ef8" d="M349.329 357.523 368.696 416H32.932C14.734 416 0 401.252 0 383.068V37.106C0 18.922 14.734 4.174 32.932 4.174h199.416L262.748 96l45.607 137.739 40.974 123.784z"></path>
                <path fill="#fff" d="M149.301 287.374c-42.77 0-77.565-34.795-77.565-77.565s34.795-77.565 77.565-77.565c20.704 0 40.182 8.065 54.845 22.712l-14.749 14.766c-10.723-10.71-24.961-16.608-40.097-16.608-31.263 0-56.696 25.433-56.696 56.696s25.433 56.696 56.696 56.696c27.698 0 50.82-19.967 55.733-46.261h-55.731v-20.87h77.565v10.435c-.001 42.769-34.796 77.564-77.566 77.564z"></path>
              </svg>
            <Box>
                <ListItemText primary="Translate" />
                <Typography variant="caption">
                    Translate this transcript to 134+ languages
                </Typography>
            </Box>
            </ListItemButton>
          </ListItem>
            <ListItem disablePadding>
                <ListItemButton>
                <ModeEditIcon sx={{ fontSize: 27, mr: 1 }} />
                <ListItemText primary="Edit Transcript" />
                </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <CloudDownloadIcon sx={{ fontSize: 27, mr: 1 }} />
              <ListItemText primary="Download Audio" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
