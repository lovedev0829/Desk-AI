'use client';

import React from 'react';
import { Box, Typography, List, ListItem, Card, Button } from '@mui/material';
import { ChatMessageInput } from './chatgpt-message-input';
import ErrorIcon from '@mui/icons-material/Error';
import GridViewIcon from '@mui/icons-material/GridView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Chat() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: "100%", p: 2 }}>
      {/* Chat Header */}
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        Explore what's inside the document
      </Typography>

      {/* Features List */}
      <List sx={{ flexGrow: 1,   textAlign: 'center' }}>
        {[
          'Chat with documents seamlessly',
          'Access to GPT-4o, Gemini-Pro, Claude-3.5, LLaMA-3.1, Perplexity and more',
          'Search internet for latest information with references',
          'Fetch public URL'
        ].map((feature, idx) => (
          <ListItem key={idx} sx={{ py: 1 }}>
            <Typography variant="body1">- {feature}</Typography>
          </ListItem>
        ))}
      </List>

      <ChatMessageInput />
      <Box sx={{ display: "flex", justifyContent: "center", alignItem: "center"}}>
        <Card sx={{p:3, width: "60%", height: "70px", justifyContent: "center", alignItem: "center", display: "flex", gap: 4}}>
            <ErrorIcon />
            <Box sx={{display: "flex", flexDirection: "row"}}>
                <GridViewIcon />
                <Typography>
                    Prompts
                </Typography>
            </Box>
            <Button variant="text" endIcon={<ExpandMoreIcon  />}>
              GPT-4o-mini
            </Button>
        </Card>
      </Box>
    </Box>
  );
}
