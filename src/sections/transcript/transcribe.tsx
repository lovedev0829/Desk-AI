'use client';

import Typography from '@mui/material/Typography';
import { DashboardContent } from 'src/layouts/dashboard';
import type { Theme, SxProps } from '@mui/material/styles';

// ----------------------------------------------------------------------
type Props = {
  title?: string;
  sx?: SxProps<Theme>;
};

export function Transcribe({ title, sx }: Props) {

  const renderContent = () => (
      <>
        hello
      </>
  );

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4"> {title} </Typography>
      {renderContent()}
    </DashboardContent>
  );
}
