import { Prisma } from '@prisma/client';

export const UserSumarySpec = {
  select:{
    id:true,
    name:true,
    image:true,
    countryOfOrigin:true,
    tags:true,
    photos:true,
    email:true,
    roles:true,
  }
} 

export type UserSumary = Prisma.UserGetPayload<typeof UserSumarySpec> & {
  type?:'user',
}
