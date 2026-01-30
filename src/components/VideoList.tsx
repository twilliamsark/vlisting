import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from '@mui/material';
import { useVideoStore } from '../store/videoStore';
import { getThumbnailUrl } from '../utils/youtube';
import type { VideoListing } from '../types';

interface VideoListProps {
  onEdit: (listing: VideoListing) => void;
}

export default function VideoList({ onEdit }: VideoListProps) {
  const { listings, deleteListing } = useVideoStore();

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thumbnail</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>URL</TableCell>
            <TableCell>Technique</TableCell>
            <TableCell>Format</TableCell>
            <TableCell>Direction</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {listings.map((listing) => (
            <TableRow key={listing.id}>
              <TableCell>
                {listing.videoId && (
                  <img
                    src={getThumbnailUrl(listing.videoId)}
                    alt="Thumbnail"
                    style={{ width: 120, height: 90 }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.png'; // placeholder
                    }}
                  />
                )}
              </TableCell>
              <TableCell>{listing.name}</TableCell>
              <TableCell>
                <a href={listing.url} target="_blank" rel="noopener noreferrer">
                  {listing.url}
                </a>
              </TableCell>
              <TableCell>{listing.technique}</TableCell>
              <TableCell>{listing.format}</TableCell>
              <TableCell>{listing.direction || ''}</TableCell>
              <TableCell>
                <Button
                  variant="outlined"
                  sx={{ mr: 1, width: 100 }}
                  onClick={() => onEdit(listing)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ width: 100 }}
                  onClick={() => deleteListing(listing.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
