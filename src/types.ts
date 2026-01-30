export interface VideoListing {
  id: string;
  name: string;
  url: string;
  technique: string;
  format: string;
  direction?: string;
  attack?: string;
  videoId?: string; // extracted from URL for thumbnail
}
