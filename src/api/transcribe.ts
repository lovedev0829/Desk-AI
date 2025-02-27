import axios, { endpoints } from 'src/utils/axios'; // Adjust the import according to your structure

interface TranscriptionResponse {
  transcribe: any; // Replace 'any' with a more specific type if possible
}

export async function transcribe(params: FormData): Promise<TranscriptionResponse> {
  
  console.log("Transcribe API endpoint", params);

  const URL = endpoints.transcribe.analyze;

  try {
    const response = await axios.post<TranscriptionResponse>(URL, params);
    return { transcribe: response.data.transcribe }; // Assuming the response has a 'transcribe' field
  } catch (error: any) {
    // You can specify the type of error if needed
    throw new Error((error.response && error.response.data) || 'Failed to transcribe');
  }
}
