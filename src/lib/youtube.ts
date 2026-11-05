import 'server-only';
import { google } from 'googleapis';
import { HttpError } from './http';

export function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(shorts\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[8]?.length === 11 ? match[8] : null;
}

function parseDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return '00:00';
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  let result = hours > 0 ? `${hours}:` : '';
  result += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  return result;
}

export interface VideoData {
  youtubeId: string;
  title: string;
  thumbnail: string | null;
  duration: string;
}

export async function fetchVideoData(url: string): Promise<VideoData> {
  const videoId = extractVideoId(url || '');
  if (!videoId) throw new HttpError(400, 'Invalid YouTube URL');

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (apiKey && apiKey !== 'your_youtube_api_key_here') {
    try {
      const youtube = google.youtube({ version: 'v3', auth: apiKey });
      const res = await youtube.videos.list({ part: ['snippet', 'contentDetails'], id: [videoId] });
      const info = res.data.items?.[0];
      if (!info) throw new HttpError(404, 'Video not found');
      return {
        youtubeId: videoId,
        title: info.snippet?.title || 'Untitled video',
        thumbnail: info.snippet?.thumbnails?.high?.url || info.snippet?.thumbnails?.default?.url || null,
        duration: parseDuration(info.contentDetails?.duration || ''),
      };
    } catch (err) {
      if (err instanceof HttpError) throw err;
      console.error('YouTube API v3 failed, falling back to oEmbed', (err as Error).message);
    }
  }

  // Fallback: oEmbed (no API key needed, but no duration)
  const oembed = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const res = await fetch(oembed, { cache: 'no-store' });
  if (!res.ok) throw new HttpError(400, 'Could not fetch video data. Check URL or API key.');
  const data = await res.json();
  return { youtubeId: videoId, title: data.title, thumbnail: data.thumbnail_url ?? null, duration: '00:00' };
}
