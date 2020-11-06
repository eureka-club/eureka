import { GetServerSideProps, NextPage } from 'next';
import { Container, Col, Row, Table } from 'react-bootstrap';

import SimpleLayout from '../components/layouts/SimpleLayout';
import { getDbConnection } from '../lib/db';

interface User {
  id: string;
  userName: string;
  roles: string[];
  createdAt: string;
}

interface Props {
  users: User[];
}

const DbPage: NextPage<Props> = ({ users }) => {
  return (
    <SimpleLayout title="Welcome">
      <Container className="mw-800px">
        <Row>
          <Col>
            <h1>Database users:</h1>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>username</th>
                  <th>roles</th>
                  <th>created at</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.userName}</td>
                    <td>{user.roles}</td>
                    <td>{new Date(user.createdAt).toISOString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </SimpleLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const connection = await getDbConnection();
  const table = connection('user');
  const users = await table.select('id', 'user_name', 'roles', 'created_at');

  return {
    props: {
      users: users.map((user) => ({
        id: user.id,
        userName: user.user_name,
        roles: user.roles,
        createdAt: user.created_at,
      })),
    },
  };
};

export default DbPage;
