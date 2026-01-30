import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography } from '@mui/material';
import VideoForm from './components/VideoForm';
import VideoList from './components/VideoList';
import type { VideoListing } from './types';

const theme = createTheme();

function App() {
  const [editingListing, setEditingListing] = useState<VideoListing | null>(
    null,
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Aikido Video Listings
        </Typography>
        <VideoForm
          editingListing={editingListing}
          onCancel={() => setEditingListing(null)}
        />
        <VideoList onEdit={setEditingListing} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
