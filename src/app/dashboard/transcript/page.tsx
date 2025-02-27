import { CONFIG } from 'src/global-config';

import { TranscriptView } from 'src/sections/transcript/view';

// ----------------------------------------------------------------------

export const metadata = { title: `Page Transcript | Dashboard - ${CONFIG.appName}` };

export default function Page() {
  return <TranscriptView title="Transcribe Files" />;
}
