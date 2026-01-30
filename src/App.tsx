import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline, Container, Typography, Button, Box } from '@mui/material';
import Papa from 'papaparse';
import VideoForm from './components/VideoForm';
import VideoList from './components/VideoList';
import { useVideoStore } from './store/videoStore';
import { extractVideoId } from './utils/youtube';
import type { VideoListing } from './types';

const theme = createTheme();

interface CsvRow {
  name: string;
  url: string;
  technique: string;
  format: string;
  direction?: string;
  attack?: string;
  stance?: string;
}

function App() {
  const [editingListing, setEditingListing] = useState<VideoListing | null>(
    null,
  );
  const { listings, addListing, updateListing } = useVideoStore();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        header: true,
        complete: (results: Papa.ParseResult<CsvRow>) => {
          results.data.forEach((row: CsvRow) => {
            const name = row.name;
            const url = row.url;
            const technique = row.technique;
            const format = row.format;
            const direction = row.direction;
            const attack = row.attack;
            const stance = row.stance;
            if (name && url && technique && format) {
              const videoId = extractVideoId(url);
              if (videoId) {
                const existing = listings.find((l) => l.url === url);
                const listingData = {
                  name,
                  url,
                  technique,
                  format,
                  videoId,
                  ...(direction && { direction }),
                  ...(attack && { attack }),
                  ...(stance && { stance }),
                };
                if (existing) {
                  updateListing(existing.id, listingData);
                } else {
                  addListing(listingData);
                }
              }
            }
          });
        },
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Aikido Video Listings
        </Typography>
        <Box sx={{ mb: 2 }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
            id="csv-file"
          />
          <label htmlFor="csv-file">
            <Button variant="contained" component="span">
              Import CSV
            </Button>
          </label>
        </Box>
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
