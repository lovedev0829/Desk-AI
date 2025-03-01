import { CONFIG } from 'src/global-config';

import { Transcribe } from 'src/sections/transcript/transcribe';

// ----------------------------------------------------------------------

export const metadata = { title: `Page Transcript | Dashboard - ${CONFIG.appName}` };

export default function TextView() {
  return <Transcribe title="Transcribed File" />;
}
