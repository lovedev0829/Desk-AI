import { z as zod } from 'zod';

import { schemaHelper } from 'src/components/hook-form';

export type TranscriptSchemaType = zod.infer<typeof TranscriptSchema>;

export const TranscriptSchema = zod.object({
  speakers: zod.string().min(1, { message: 'Speaker is required!' }),
  file: schemaHelper.file({ message: 'File upload is required!' }),
  lang: zod.string().nonempty("Lang is required!")
});