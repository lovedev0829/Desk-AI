import axios, { endpoints } from 'src/utils/axios'; // Adjust the import path as needed

interface Segment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResponse {
  filename: string;
  audio_data: string;
  segments: Segment[];
}

export async function transcribe(params: FormData): Promise<TranscriptionResponse> {
  const URL = endpoints.transcribe.analyze;

  try {

    const { data } = await axios.post<TranscriptionResponse>(URL, params);

    return {
      filename: data.filename,
      audio_data: data.audio_data,
      segments: data.segments,
    };

  } catch (error: any) {
    throw new Error(error.response?.data || 'Failed to transcribe');
  }
}
