import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingScreen = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >
      <CircularProgress size={48} thickness={4} />
      <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingScreen
