import SchemaBuilder from '@giraphql/core';
import { ApolloServer } from 'apollo-server';

interface Giraffe {
  name: string;
  birthday: Date;
  heightMeters: number;
}

const builder = new SchemaBuilder<{
  Object: {
    Giraffe: Giraffe;
  };
}>();

const Giraffe = builder.createObjectType('Giraffe', {
  description: 'Long necks, cool patterns, taller than you.',
  shape: t => ({
    name: t.exposeString('name'),
    age: t.int({
      resolve: parent => {
        const today = new Date(new Date().toDateString());
        const birthday = new Date(parent.birthday.toDateString());
        const ageDifMs = Number(today) - Number(birthday);
        const ageDate = new Date(ageDifMs);

        return Math.abs(ageDate.getUTCFullYear() - 1970);
      },
    }),
    height: t.float({
      resolve: parent => parent.heightMeters,
    }),
  }),
});

const LengthUnit = builder.createEnumType('LengthUnit', {
  values: { Feet: {}, Meters: {} },
});

const Query = builder.createQueryType({
  shape: t => ({
    giraffe: t.field({
      type: Giraffe,
      resolve: () => ({ name: 'James', heightMeters: 5.2, birthday: new Date(2012, 11, 12) }),
    }),
  }),
});

const schema = builder.toSchema([Query, Giraffe, LengthUnit]);

const server = new ApolloServer({ schema });

server.listen(8000, (error: unknown) => {
  if (error) {
    throw error;
  }

  console.log('🚀 Server started at http://127.0.0.1:8000');
});
