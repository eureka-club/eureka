import { Prisma } from "@prisma/client";
import { backOfficeData } from "@/src/types/backoffice";
import { prisma } from "@/src/lib/prisma";

export interface findProps {
  id: number;
  select?: Record<string, boolean>;
  include?: boolean;
}
export const find = async (props: findProps) => {
  const { id, select = undefined, include = true } = props;

  return prisma.backOfficeSettings.findUnique({
    where: {
      id,
    },
    include: {
      sliderImages: { select: { storedFile: true, originalFilename: true } },
    },
  });
};

export const create = async (
  id: number,
  data: Prisma.BackOfficeSettingsCreateInput
) => {
  return prisma.backOfficeSettings.create({
    data,
  });
};

export const update = async (
  id: number,
  data: Prisma.BackOfficeSettingsUpdateInput
) => {
  return prisma.backOfficeSettings.update({
    data,
    where: { id },
  });
};
