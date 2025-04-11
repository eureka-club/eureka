import { GetServerSideProps } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import { Button, Table } from "@mui/material";
import { IoEyeOutline } from "react-icons/io5";
import { DeleteOutline } from "@mui/icons-material";
import { dehydrate, QueryClient,  useQueryClient } from "react-query";
import useUsers, { getUsers } from "@/src/useUsers";
import Filters from "./components/Filters";
import { useRouter } from "next/router";
import { UserSumary } from "@/src/types/UserSumary";
import slugify from "slugify";

export default function Users() {
   
    const {data: users} = useUsers({});
    const router=useRouter();
    const qc=useQueryClient();
    function viewUser(e:any,user:UserSumary){
        const sts = `${user.name}-${user.id}`;
        router.push(`/mediatheque/${slugify(sts, { lower: true })}`);
    }
    async function deleteUser(e:any,user: UserSumary) {
        const confirmation = await confirm(`Are you sure you want to delete user ${user.email}?`);
        if (!confirmation) {return;}
        const url = `/api/user/${user.id}`;

        const fr = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: user.id }),
        });
        if (fr.ok) {
            const data = await fr.json();
            if(data?.error)
                alert(`Error deleting user ${user.email}, Error: ${data?.error}`);
            else if(data?.user){
                qc.invalidateQueries('USERS');
                alert(`User ${data?.user.email} deleted successfully`);
            }
        } 
    }

    return (
        <div>
        <h1>Users</h1>
        <Filters/>
        <Table>
        <thead>
            <tr>
                <th>Id</th>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {users?.map((user) => (
                <tr key={user.id} style={{ padding: '1rem', marginBottom: '1rem', border: '1px solid lightgray' }}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.roles}</td>
                    <td style={{ display: 'flex', gap: '1rem' }}>
                        <Button variant='contained' size="small" onClick={(e)=>viewUser(e,user)} startIcon={<IoEyeOutline/>}>View</Button>
                        <Button variant='contained' size="small" color="warning" onClick={(e)=>deleteUser(e,user)} startIcon={<DeleteOutline/>} disabled={user?.roles.includes('admin')}>Delete</Button>
                    </td>
                </tr>))}
        </tbody>
        </Table>
        </div>
    );
}
export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const qc = new QueryClient();

    const users = await getUsers();
    qc.prefetchQuery({
        queryKey: ['USERS'],
        queryFn: () => users,
    });
    const session = (await getSession(ctx)) as unknown as Session;
    if (session == null || !session.user.roles.includes('admin')) {
        return { notFound: true };
    }
    return {
        props: {
            session,
            dehydratedState: dehydrate(qc),
        },
    };
}