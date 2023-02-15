import { Box, Container, Flex, Heading } from '@chakra-ui/react';
import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { withIronSessionSsr } from 'iron-session/next';
import { GetServerSideProps } from 'next';
import Navbar from '../components/Navbar';
import { ironSessionOptions } from '../lib/helper';

type PropsType = {
  user: {
    id: number;
    name: string;
    email: string;
    admin: boolean;
  };
};

const contact = {
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE,
  map: process.env.NEXT_PUBLIC_GOOGLE_MAP_EMBED,
};

const About = (props: PropsType) => {
  return (
    <>
      {props.user.id ? <Navbar pageTitle="About Us" pageDescription="This is page that display about dessert bake" currentPage={'About'} user={props.user} /> : <Navbar pageTitle="About Us" pageDescription="This is page that display about dessert bake" currentPage="About" />}

      <main>
        <Container maxW="container.md" py="3rem">
          <Box as="section" mb="2rem">
            <Heading as="h1" fontSize="1.7rem" mb="1.5rem">
              About us
            </Heading>

            <Box as="div">
              <Box as="p" textAlign="justify" mb="1.3rem">
                Welcome to Dessert Bake, a bakery located in Kuala Berang, Terengganu. We&apos;ve been serving up delicious treats to our community for 4 years, and we&apos;re passionate about using only the freshest, highest-quality ingredients in all of our baked goods.
              </Box>

              <Box as="p" textAlign="justify" mb="1.3rem">
                Our bakery was founded by Nik Badzlin Husna in 2018, with the goal of creating a warm, welcoming space where customers could enjoy freshly-baked cakes, dessert and beverage. Over the years, we&apos;ve expanded our menu to include a wide variety of cakes, dessert, and baverage, but
                we&apos;ve never lost sight of our commitment to quality.
              </Box>

              <Box as="p" textAlign="justify" mb="1.3rem">
                At Dessert Bake, we believe that baking is both an art and a science. That&apos;s why we take the time to perfect our recipes and techniques, using only the best ingredients and the most innovative baking methods. We&apos;re proud to offer a range of treats that are both delicious
                and beautiful, and we&apos;re constantly experimenting with new flavors and designs.
              </Box>

              <Box as="p" textAlign="justify">
                Whether you&apos;re looking for a special occasion cake, a delicious beverage, or just a sweet treat to brighten your day, we&apos;ve got you covered. Come visit us at our bakery in Kuala Berang, Terengganu, and experience the magic of Dessert Bake for yourself.
              </Box>
            </Box>
          </Box>

          <Box as="section" mb="2rem">
            <Heading as="h1" fontSize="1.7rem" mb="2rem">
              Contact Us
            </Heading>

            <Flex flexDir="column" gap="1rem">
              <Flex flexDir="row" gap="1rem" alignItems="center">
                <MapPinIcon width="24px" />
                <Box as="span">{contact.address}</Box>
              </Flex>

              <Flex flexDir="row" gap="1rem" alignItems="center">
                <EnvelopeIcon width="24px" />
                <Box as="span">{contact.email}</Box>
              </Flex>

              <Flex flexDir="row" gap="1rem" alignItems="center">
                <PhoneIcon width="24px" />
                <Box as="span">{contact.phone}</Box>
              </Flex>
            </Flex>
          </Box>

          <Box as="section">
            <Heading as="h1" fontSize="1.7rem" mb="2rem">
              Our Location
            </Heading>

            <Flex justifyContent="center">
              <iframe src={contact.map} width="600" height="450" style={{ border: 0, boxShadow: 'var(--box-shadow)' }} allowFullScreen={true} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </Flex>
          </Box>
        </Container>
      </main>
    </>
  );
};

export default About;

export const getServerSideProps: GetServerSideProps = withIronSessionSsr(async ({ req }) => {
  return {
    props: {
      user: req.session.user ? req.session.user : {},
    },
  };
}, ironSessionOptions);
