// * Libs
import { prisma } from "@/lib/prisma";

export default async function getOrganizationId() {
  const { id: organizationId } = (await prisma.organizations.findFirst({
    where: { userId: 1 },
    select: { id: true },
  })) as { id: number };

  return organizationId;
}
