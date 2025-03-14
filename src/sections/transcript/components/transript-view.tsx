'use client';

import React from 'react';
import { Box } from '@mui/material';
import TranscriptContent from './transcript-content';
import ChatGptMsgPanel from './chatgpt-view';
import type { Theme, SxProps } from '@mui/material/styles';
import type { TranscriptionResponse } from 'src/api/transcribe';

interface TranscribeTextViewProps {
  transcription: TranscriptionResponse;
  sx?: SxProps<Theme>;
}

export default function TranscribeTextView({ transcription, sx }: TranscribeTextViewProps) {
  return (
    <Box sx={{ display: 'flex',  ...sx }}>
      <Box sx={{ flex: 1}}>
        <TranscriptContent transcription={transcription} sx={sx} />
      </Box>
      <Box sx={{ width: '40%'}}>
        <ChatGptMsgPanel />
      </Box>
    </Box>
  );
}