import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'poppins', sans-serif`,
    body: `'poppins', sans-serif`,
  },
  colors: {
    brand: {
      '50': '#F7F2EE',
      '100': '#E9D9CE',
      '200': '#DAC1AF',
      '300': '#CCA98F',
      '400': '#BD9170',
      '500': '#AF7950',
      '600': '#8C6140',
      '700': '#694830',
      '800': '#463020',
      '900': '#231810',
    },
  },
});

export default theme;
