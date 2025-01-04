import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, SvgIcon } from '@mui/material';

export const CustomersSearch = ({
  placeholder = 'Buscar...',
  defaultValue = '',
  onChange,
  onKeyPress,
  startAdornment = (
    <InputAdornment position="start">
      <SvgIcon color="action" fontSize="small">
        <MagnifyingGlassIcon />
      </SvgIcon>
    </InputAdornment>
  ),
  children,
  ...rest
}) => (
  <Card 
    sx={{ 
      p: 2, 
      mb: 2, 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between' 
    }}
  >
    <OutlinedInput
      defaultValue={defaultValue}
      fullWidth
      placeholder={placeholder}
      startAdornment={startAdornment}
      onChange={onChange}
      onKeyPress={onKeyPress}
      sx={{ maxWidth: 500, height: '40.5px', marginRight: '4px' }}
      {...rest} // Pasar todas las props adicionales
    />
    {children}
  </Card>
);
