import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableSortLabel,
} from '@mui/material';
import { useVideoStore } from '../store/videoStore';
import { getThumbnailUrl } from '../utils/youtube';
import type { VideoListing } from '../types';

interface VideoListProps {
  onEdit: (listing: VideoListing) => void;
}

export default function VideoList({ onEdit }: VideoListProps) {
  const { listings, deleteListing } = useVideoStore();

  const [sortBy, setSortBy] = useState<
    'name' | 'technique' | 'format' | 'direction' | 'attack'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedListings = useMemo(() => {
    return [...listings].sort((a, b) => {
      const aVal = (a[sortBy] || '').toString();
      const bVal = (b[sortBy] || '').toString();
      if (sortOrder === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [listings, sortBy, sortOrder]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Thumbnail</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'name'}
                direction={sortBy === 'name' ? sortOrder : 'asc'}
                onClick={() => handleSort('name')}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell>URL</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'technique'}
                direction={sortBy === 'technique' ? sortOrder : 'asc'}
                onClick={() => handleSort('technique')}
              >
                Technique
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'format'}
                direction={sortBy === 'format' ? sortOrder : 'asc'}
                onClick={() => handleSort('format')}
              >
                Format
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'direction'}
                direction={sortBy === 'direction' ? sortOrder : 'asc'}
                onClick={() => handleSort('direction')}
              >
                Direction
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'attack'}
                direction={sortBy === 'attack' ? sortOrder : 'asc'}
                onClick={() => handleSort('attack')}
              >
                Attack
              </TableSortLabel>
            </TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedListings.map((listing) => (
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
              <TableCell>{listing.attack || ''}</TableCell>
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
