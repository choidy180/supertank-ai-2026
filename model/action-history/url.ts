import { API_BASE } from './constants';

export const buildImageNameUrl = (imgPath: string) =>
  `${API_BASE}/api/images/${encodeURIComponent(imgPath)}`;

export const buildImageUrl = (imgPath: string, imgName: string) =>
  `${API_BASE}/api/images/${encodeURIComponent(imgPath)}/${encodeURIComponent(
    imgName,
  )}`;

export const buildSttUrl = (sttName: string) =>
  `${API_BASE}/api/STT/${encodeURIComponent(sttName)}`;

export const buildTextUrl = (logName: string) =>
  `${API_BASE}/api/text/${encodeURIComponent(logName)}`;

export const buildVideoUrl = (videoName: string) =>
  `${API_BASE}/api/videos/${encodeURIComponent(videoName)}`;
