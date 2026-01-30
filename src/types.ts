export interface VideoListing {
  id: string;
  name: string;
  url: string;
  technique: string;
  format: string;
  videoId?: string; // extracted from URL for thumbnail
}
