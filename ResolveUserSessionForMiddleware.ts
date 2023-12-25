import { getServerSession } from "next-auth";

export default async function useSESSION(){
    const session = await getServerSession();
    return session
    // {user:{language:'french'}};
}