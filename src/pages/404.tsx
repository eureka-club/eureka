import Error from 'next/error';
import { NextPage } from 'next';

const NotFoundPage: NextPage = () => <Error statusCode={404} />;

export default NotFoundPage;
