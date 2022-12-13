import { Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Loading } from '../components/Loading';
import Navbar from '../components/Navbar';

const About = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading)
    return (
      <>
        <Navbar pageTitle="About" pageDescription="This is about page" currentPage={'About'} />
        <Loading />
      </>
    );

  return (
    <>
      <Navbar pageTitle="About" pageDescription="This is about page" currentPage={'About'} />
      About pagee
    </>
  );
};

export default About;
