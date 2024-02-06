"use server"
import { PostDetail } from '@/src/types/post';

export const getCyclePosts = async (id:number)=>{
    const url = `${process.env.NEXT_PUBLIC_WEBAPP_URL}/api/cycle/${id}/posts`;
    const fr = await fetch(url);
    const posts = fr.ok? await fr.json() as PostDetail[] : [];
    return posts;
}
