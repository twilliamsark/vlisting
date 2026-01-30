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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { useVideoStore } from '../store/videoStore';
import { getThumbnailUrl } from '../utils/youtube';
import type { VideoListing } from '../types';

interface VideoListProps {
  onEdit: (listing: VideoListing) => void;
}

const techniques = [
  'Bokken Suburi',
  'General Exercise',
  'Gokyo',
  'Hiji Kata',
  'Iaido Only',
  'Ikkyo',
  'Iriminage',
  'Jo Kata',
  'Kaitennage',
  'Kokyuho',
  'Kokyunage',
  'Kotegaeshi',
  'Nikyo',
  'Sankyo',
  'Shihonage',
  'Udekimenage',
];
const formats = [
  'Aiki Toho',
  'Jo no Tebiki',
  'Ken no Tebiki',
  'Ken ti Jo',
  'Ken ti Ken',
  'Other',
  'Oyo',
  'Suwariwaza',
  'Tiado',
];
const directions = ['Omote', 'Ura'];
const attacks = [
  'Shomenuchi',
  'Katatedori',
  'Ryotedori',
  'Yokomenuchi',
  'Tsuki',
  'Other',
];

export default function VideoList({ onEdit }: VideoListProps) {
  const { listings, deleteListing } = useVideoStore();

  const [sortBy, setSortBy] = useState<
    'name' | 'technique' | 'format' | 'direction' | 'attack'
  >('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [filterTechnique, setFilterTechnique] = useState<string>('');
  const [filterFormat, setFilterFormat] = useState<string>('');
  const [filterDirection, setFilterDirection] = useState<string>('');
  const [filterAttack, setFilterAttack] = useState<string>('');

  const filteredListings = useMemo(() => {
    return listings.filter(
      (listing) =>
        (!filterTechnique || listing.technique === filterTechnique) &&
        (!filterFormat || listing.format === filterFormat) &&
        (!filterDirection || listing.direction === filterDirection) &&
        (!filterAttack || listing.attack === filterAttack),
    );
  }, [listings, filterTechnique, filterFormat, filterDirection, filterAttack]);

  const sortedListings = useMemo(() => {
    return [...filteredListings].sort((a, b) => {
      const aVal = (a[sortBy] || '').toString();
      const bVal = (b[sortBy] || '').toString();
      if (sortOrder === 'asc') {
        return aVal.localeCompare(bVal);
      } else {
        return bVal.localeCompare(aVal);
      }
    });
  }, [filteredListings, sortBy, sortOrder]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  return (
    <>
      <Box sx={{ mt: 4, mb: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Technique</InputLabel>
          <Select
            value={filterTechnique}
            label="Technique"
            onChange={(e) => setFilterTechnique(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {techniques.map((tech) => (
              <MenuItem key={tech} value={tech}>
                {tech}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Format</InputLabel>
          <Select
            value={filterFormat}
            label="Format"
            onChange={(e) => setFilterFormat(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {formats.map((fmt) => (
              <MenuItem key={fmt} value={fmt}>
                {fmt}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Direction</InputLabel>
          <Select
            value={filterDirection}
            label="Direction"
            onChange={(e) => setFilterDirection(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {directions.map((dir) => (
              <MenuItem key={dir} value={dir}>
                {dir}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Attack</InputLabel>
          <Select
            value={filterAttack}
            label="Attack"
            onChange={(e) => setFilterAttack(e.target.value)}
          >
            <MenuItem value="">
              <em>All</em>
            </MenuItem>
            {attacks.map((atk) => (
              <MenuItem key={atk} value={atk}>
                {atk}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
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
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
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
    </>
  );
}
