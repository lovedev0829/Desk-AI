'use client';

import React, { useState, useRef } from 'react';
import {
  Box, Tabs, Tab, Typography, Stack, Checkbox, FormControlLabel, Button,
  IconButton, Menu, MenuItem, Divider, Paper
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import type { TranscriptionResponse } from 'src/api/transcribe';
import type { Theme, SxProps } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const formatTime = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${(seconds % 60).toFixed(2)}`;

const LANGS = [
    { value: '2', label: 'English' },
    { value: '3', label: 'Hebrew' },
];

interface TranscribeTextViewProps {
    transcription: TranscriptionResponse;
    sx?: SxProps<Theme>;
}

export default function TranscriptContent({ transcription, sx }: TranscribeTextViewProps) {

  const audioRef = useRef<HTMLAudioElement>(null);
  const [topTab, setTopTab] = useState(0);
  const [sideTab, setSideTab] = useState(0);
  const [showSpeaker, setShowSpeaker] = useState(true);
  const [showTimestamp, setShowTimestamp] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const data = transcription;
  
  const handleSegmentClick = (start: number) => {
    console.log(start)
    if (audioRef.current) {
      audioRef.current.currentTime = start;
      audioRef.play();
    }
  };

  return (
    <Box sx={{ display: 'flex', width: '100%',  }}>
      <Box sx={{ flex: 1, p: 2 }}>
        <Tabs value={topTab} onChange={(_, v) => setTopTab(v)}>
          <Tab label="Transcript" />
          <Tab label="Formatted Text" />
          <Tab label="Subtitle" />
        </Tabs>

        <Stack direction="row" spacing={2} alignItems="center" mt={2}>
            <FormControlLabel
                control={<Checkbox checked={showSpeaker} onChange={() => setShowSpeaker(!showSpeaker)} />}
                label="Show Speaker"
            />
            <FormControlLabel
                control={<Checkbox checked={showTimestamp} onChange={() => setShowTimestamp(!showTimestamp)} />}
                label="Show Timestamp"
            />
            <Box sx={{ flexGrow: 1 }} />

            <Button
                variant="contained"
                endIcon={<ExpandMoreIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
            >
                Export
            </Button>
            <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => setAnchorEl(null)}>PDF</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>DOCX</MenuItem>
                <MenuItem onClick={() => setAnchorEl(null)}>TXT</MenuItem>
            </Menu>
            <IconButton><ContentCopyIcon /></IconButton>
            <IconButton><EditIcon /></IconButton>
            <FormControl  style={{ width: '20%', marginTop: 1 }} >
                <InputLabel id="lang-select-label">Languages</InputLabel>
                <Select name="lang" label="Languages"  labelId="lang-select-label" sx={{height: "48px"}}>
                    {LANGS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </Select>   
            </FormControl>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Paper elevation={2} sx={{ p: 2, height: "60vh", overflow: "auto" }}>
        {data.segments.map((segment, idx) => (
            <Box
              key={idx}
              sx={{ p: 1, cursor: 'pointer', '&:hover': { bgcolor: 'action.hover' }, borderRadius: 1 }}
              onClick={() => handleSegmentClick(segment.start)}
            >
              <Stack direction="row" spacing={1}>
                <Typography variant="subtitle2" color="primary">
                  {idx + 1}.
                </Typography>
                {showSpeaker && (
                  <Typography variant="subtitle2" color="primary">
                    {/* [Speaker {segment.speaker}] */}
                  </Typography>
                )}
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {segment.text}
                </Typography>
                {showTimestamp && (
                  <Typography variant="caption" color="text.secondary">
                    [{formatTime(segment.start)}]
                  </Typography>
                )}
              </Stack>
            </Box>
          ))}
        </Paper>
        <Box sx={{ mt: 2 }}>
          <audio ref={audioRef} controls style={{ width: '100%' }} src={`/audio/${data.filename}`} />
        </Box>
      </Box>

      <Box sx={{ width: '100px', display: 'flex'}}>
        <Tabs
          orientation="vertical"
          value={sideTab}
          onChange={(_, v) => setSideTab(v)}
          sx={{ borderRight: 1, borderColor: 'divider', width: '100px' }}
        >
          <Tab label="Transcript" />
          <Tab label="Speakers" />
          <Tab label="Summary" />
          <Tab label="Key Points" />
          <Tab label="AI Content" />
        </Tabs>
      </Box>
    </Box>
  );
}