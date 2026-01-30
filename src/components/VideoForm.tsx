import { useForm, Controller } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
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
  direction: yup.string().optional().default(''),
  attack: yup.string().optional().default(''),
  stance: yup.string().optional().default(''),
});

interface FormData {
  name: string;
  url: string;
  technique: string;
  format: string;
  direction: string;
  attack: string;
  stance: string;
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
const stances = ['Aihanmi', 'Gyakuhanmi', 'Other'];

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
          direction: editingListing.direction || '',
          attack: editingListing.attack || '',
          stance: editingListing.stance || '',
        }
      : {
          name: '',
          url: '',
          technique: '',
          format: '',
          direction: '',
          attack: '',
          stance: '',
        },
  });

  useEffect(() => {
    if (editingListing) {
      reset({
        name: editingListing.name,
        url: editingListing.url,
        technique: editingListing.technique,
        format: editingListing.format,
        direction: editingListing.direction || '',
        attack: editingListing.attack || '',
        stance: editingListing.stance || '',
      });
    } else {
      reset({
        name: '',
        url: '',
        technique: '',
        format: '',
        direction: '',
        attack: '',
        stance: '',
      });
    }
  }, [editingListing, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    const videoId = extractVideoId(data.url);
    if (videoId) {
      const { direction, attack, stance, ...rest } = data;
      const listingData = {
        ...rest,
        videoId,
        ...(direction && direction.trim() && { direction }),
        ...(attack && attack.trim() && { attack }),
        ...(stance && stance.trim() && { stance }),
      };
      if (editingListing) {
        updateListing(editingListing.id, listingData);
        onCancel();
      } else {
        addListing(listingData);
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
      <Controller
        name="direction"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Direction (Optional)</InputLabel>
            <Select {...field} label="Direction (Optional)">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {directions.map((dir) => (
                <MenuItem key={dir} value={dir}>
                  {dir}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="attack"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Attack (Optional)</InputLabel>
            <Select {...field} label="Attack (Optional)">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {attacks.map((atk) => (
                <MenuItem key={atk} value={atk}>
                  {atk}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      />
      <Controller
        name="stance"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <FormControl fullWidth margin="normal">
            <InputLabel>Stance (Optional)</InputLabel>
            <Select {...field} label="Stance (Optional)">
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {stances.map((st) => (
                <MenuItem key={st} value={st}>
                  {st}
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
