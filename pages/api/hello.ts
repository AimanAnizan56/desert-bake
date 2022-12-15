// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  data: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
  };
  support: {
    url: string;
    text: string;
  };
};

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const user = {
    data: {
      id: 2,
      email: 'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name: 'Weaver',
      avatar: 'https://reqres.in/img/faces/2-image.jpg',
    },
    support: {
      url: 'https://reqres.in/#support-heading',
      text: 'To keep ReqRes free, contributions towards server costs are appreciated!',
    },
  };
  res.status(200).json(user);
}
