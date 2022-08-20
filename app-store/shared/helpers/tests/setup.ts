import prisma from "@app-store/shared/helpers/prisma";
import faker from "@faker-js/faker";

export async function setup() {
  const createUser = prisma.user.create({
    data: {
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      email: faker.internet.email(),
      emailVerified: faker.date.past(),
    },
  });

  const [user] = await Promise.all([createUser]);

  return { user };
}
