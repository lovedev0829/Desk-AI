'use client';

import React from 'react';
import { Box, Typography, List, ListItem, TextField, IconButton, Divider } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

export default function ChatPanel() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
      {/* Chat Header */}
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 3 }}>
        Explore what's inside the document
      </Typography>

      {/* Features List */}
      <List sx={{ flexGrow: 1 }}>
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

      <Divider sx={{ mb: 2 }} />

      {/* Chat Input */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Send a message"
          fullWidth
          size="small"
        />
        <IconButton color="primary">
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
