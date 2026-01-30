import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';
import { useVideoStore } from '../store/videoStore';
import { extractVideoId } from '../utils/youtube';
import type { VideoListing } from '../types';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  url: yup
    .string()
    .required('URL is required')
    .test('is-youtube', 'Invalid YouTube URL', (value) =>
      value ? !!extractVideoId(value) : false,
    ),
  technique: yup.string().required('Technique is required'),
  format: yup.string().required('Format is required'),
});

interface FormData {
  name: string;
  url: string;
  technique: string;
  format: string;
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

interface VideoFormProps {
  editingListing: VideoListing | null;
  onCancel: () => void;
}

export default function VideoForm({
  editingListing,
  onCancel,
}: VideoFormProps) {
  const addListing = useVideoStore((state) => state.addListing);
  const updateListing = useVideoStore((state) => state.updateListing);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: editingListing
      ? {
          name: editingListing.name,
          url: editingListing.url,
          technique: editingListing.technique,
          format: editingListing.format,
        }
      : {
          name: '',
          url: '',
          technique: '',
          format: '',
        },
  });

  useEffect(() => {
    if (editingListing) {
      reset({
        name: editingListing.name,
        url: editingListing.url,
        technique: editingListing.technique,
        format: editingListing.format,
      });
    } else {
      reset({
        name: '',
        url: '',
        technique: '',
        format: '',
      });
    }
  }, [editingListing, reset]);

  const onSubmit = (data: FormData) => {
    const videoId = extractVideoId(data.url);
    if (videoId) {
      if (editingListing) {
        updateListing(editingListing.id, { ...data, videoId });
        onCancel();
      } else {
        addListing({ ...data, videoId });
        reset();
      }
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 2 }}>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        )}
      />
      <Controller
        name="url"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <TextField
            {...field}
            label="YouTube URL"
            fullWidth
            margin="normal"
            error={!!errors.url}
            helperText={errors.url?.message}
          />
        )}
      />
      <Controller
        name="technique"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.technique}>
            <InputLabel>Technique</InputLabel>
            <Select {...field} label="Technique">
              {techniques.map((tech) => (
                <MenuItem key={tech} value={tech}>
                  {tech}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="format"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth margin="normal" error={!!errors.format}>
            <InputLabel>Format</InputLabel>
            <Select {...field} label="Format">
              {formats.map((fmt) => (
                <MenuItem key={fmt} value={fmt}>
                  {fmt}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Button type="submit" variant="contained" sx={{ mt: 2, mr: 1 }}>
        {editingListing ? 'Update Listing' : 'Add Listing'}
      </Button>
      {editingListing && (
        <Button variant="outlined" sx={{ mt: 2 }} onClick={onCancel}>
          Cancel
        </Button>
      )}
    </Box>
  );
}
