import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Box, Heading, keyframes, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronDoubleDownIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
import { ironSessionOptions } from '../lib/helper';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Home(props: any) {
  const bounceKayframes = keyframes`
  0% { transform: translateY(5px) }
  25% { transform: translateY(-5px) }
  50% { transform: translateY(5px) }
  75% { transform: translateY(-5px) }
  100% { transform: translateY(5px) }
`;

  const bounceAnimation = `${bounceKayframes} 2s ease-in-out infinite`;

  return (
    <>
      {props.user.id ? <Navbar pageTitle="Homepage" pageDescription="Desert Bake Homepage" currentPage={'Home'} user={props.user} /> : <Navbar pageTitle="Homepage" pageDescription="Desert Bake Homepage" currentPage={'Home'} />}
      <main>
        <Swiper pagination={{ dynamicBullets: true }} modules={[Pagination]} style={{ background: 'gray' }}>
          <SwiperSlide>
            <Box as="div" position={'relative'} cursor={'default'}>
              <Box as="div" w={'100vw'} h={'80vh'}>
                <Image src={'/img/carousel-1.jpg'} style={{ filter: 'blur(2px)' }} fill alt={'caraousel image 1'} />
              </Box>

              <Box as="span" textShadow={'1px 1px 1px rgb(0,0,0)'} color={'white'} position={'absolute'} top={'50%'} right={'50%'} transform={'translate(50%,-50%)'}>
                <Text fontSize={'2xl'} color={'brand.500'} fontWeight={'600'}>
                  Fresh & Delicious
                </Text>

                <Heading textAlign={'center'} as="h1">
                  Welcome to Desert Bake
                </Heading>

                <Text textAlign={'center'}>Premium Quality & Tasty Products</Text>

                <Box as={motion.div} animation={bounceAnimation} bg={'brand.500'} mx={'auto'} mt={'0.8rem'} display={'flex'} alignItems={'center'} justifyContent={'center'} gap={'0.5rem'} w={'10rem'} py={'0.5rem'} px={'0.2rem'} borderRadius={30}>
                  Shop Now <ChevronDoubleDownIcon width="24px" height="24px" />
                </Box>
              </Box>
            </Box>
          </SwiperSlide>
        </Swiper>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  if (req.session.user) {
    if (req.session.user.admin) {
      return {
        redirect: {
          destination: '/admin/',
          permanent: false,
        },
      };
    }
  }

  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
