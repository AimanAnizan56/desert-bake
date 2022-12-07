import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Customer = () => {
  const router = useRouter();

  return (
    <Button colorScheme={'facebook'} onClick={() => router.push('/signup')}>
      Redirect
    </Button>
  );
};

export default Customer;
