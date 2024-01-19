import { findAll } from "@/src/facades/user";
import { UserDetail } from "@/src/types/user";
import { Prisma } from "@prisma/client";

export const getUsers = async (props?: Prisma.UserFindManyArgs): Promise<UserDetail[]> => {
    const users = await findAll(props);
    return users;
};