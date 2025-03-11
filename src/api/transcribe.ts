import { headers } from 'next/headers';
import { SERVER_URL } from 'src/config-global';
import axios, { endpoints } from 'src/utils/axios'; // Adjust the import path as needed

interface Segment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResponse {
  filename: string;
  audio_data: string;
  dateTime: string;
  segments: Segment[];
}

// Transcribe function that sends audio to text
export async function transcribe(params: FormData): Promise<TranscriptionResponse> {
  const URL = endpoints.transcribe.audio_to_text;

  try {
    const { data } = await axios.post<TranscriptionResponse>(URL, params);
    
    return {
      filename: data.filename,
      audio_data: data.audio_data,
      segments: data.segments,
      dateTime: data.dateTime
    };
  } catch (error: any) {
    const errorMessage = error.response?.data || 'Failed to transcribe';
    console.error('Transcription Error:', errorMessage); // For debugging purposes
    throw new Error(errorMessage);
  }
}

// Function to import file from a URL
export async function transcribeImportFile(mediaLink: string): Promise<File> {
  try {
      const URL = `${SERVER_URL}/${endpoints.transcribe.import_file}`; // Ensure this is correctly defined
      console.log(URL)
      const response = await fetch(URL, {
          method: "POST", // Use POST method
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file_url: mediaLink }) // Send mediaLink in the request body
      });

      if (!response.ok) {
          throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
      }

      // Convert response to Blob
      const blob = await response.blob();

      // Convert Blob to File
      const file = new File([blob], mediaLink, { type: blob.type });

      return file;
  } catch (error: any) {
      console.error("File Import Error:", error.message);
      throw new Error(error.message || "Failed to import file");
  }
}