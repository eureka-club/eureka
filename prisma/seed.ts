import { PrismaClient } from '@prisma/client';

import dayjs from 'dayjs';

import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
const forceDelete = true;
const prisma = new PrismaClient();

const regions: Record<string, unknown> = {
  'Sub-Saharan Africa': {
    angola: 'Angola',
    benin: 'Benin',
    botswana: 'Botswana',
    'burkina-faso': 'Burkina-Faso',
    burundi: 'Burundi',
    'cabo-verde': 'Cabo Verde ',
    cameroon: 'Cameroon',
    'central-african-republic': 'Central African Republic',
    chad: 'Chad',
    'comoros-islands': 'Comoros Islands',
    congo: 'Congo',
    'cote-d-ivoire': "Côte d'Ivoire",
    'democratic-republic-of-the-congo': 'Democratic Republic of the Congo',
    djibouti: 'Djibouti',
    'equatorial-guinea': 'Equatorial Guinea',
    eritrea: 'Eritrea',
    eswatini: 'Eswatini',
    ethiopia: 'Ethiopia',
    gabon: 'Gabon',
    gambia: 'Gambia',
    ghana: 'Ghana',
    guinea: 'Guinea',
    'guinea-bissau': 'Guinea-Bissau',
    kenya: 'Kenya',
    lesotho: 'Lesotho',
    liberia: 'Liberia',
    madagascar: 'Madagascar',
    malawi: 'Malawi',
    mali: 'Mali',
    mauritania: 'Mauritania',
    mauritius: 'Mauritius',
    mozambique: 'Mozambique',
    namibia: 'Namibia',
    niger: 'Niger',
    nigeria: 'Nigeria',
    rwanda: 'Rwanda',
    'sao-tome-and-principe': 'São Tomé and Príncipe',
    senegal: 'Senegal',
    seychelles: 'Seychelles',
    'sierra-leone': 'Sierra Leone',
    somalia: 'Somalia',
    'south-africa': 'South Africa',
    'south-sudan': 'South Sudan',
    tanzania: 'Tanzania',
    togo: 'Togo',
    uganda: 'Uganda',
    zambia: 'Zambia',
    zimbabwe: 'Zimbabwe',
  },
  'Northern America': {
    canada: 'Canada',
    'saint-pierre-and-miquelon': 'Saint-Pierre and Miquelon',
    'united-states': 'United States',
    bermudas: 'Bermudas',
  },
  'Latin America and the Caribbean': {
    'antigua-and-barbuda': 'Antigua and Barbuda',
    argentina: 'Argentina',
    bahamas: 'Bahamas',
    barbados: 'Barbados',
    belize: 'Belize',
    bolivia: 'Bolivia',
    brazil: 'Brazil',
    chile: 'Chile',
    colombia: 'Colombia',
    'costa-rica': 'Costa Rica',
    cuba: 'Cuba',
    dominica: 'Dominica',
    'dominican-republic': 'Dominican Republic',
    ecuador: 'Ecuador',
    'el-salvador': 'El Salvador',
    grenada: 'Grenada',
    guatemala: 'Guatemala',
    guyana: 'Guyana',
    haiti: 'Haiti',
    honduras: 'Honduras',
    jamaica: 'Jamaica',
    mexico: 'Mexico',
    nicaragua: 'Nicaragua',
    panama: 'Panama',
    paraguay: 'Paraguay',
    peru: 'Peru',
    'saint-kitts-and-nevis': 'Saint Kitts and Nevis',
    'saint-lucia': 'Saint Lucia',
    'saint-vincent-and-the-grenadines': 'Saint Vincent and the Grenadines',
    suriname: 'Suriname',
    'trinidad-and-tobago': 'Trinidad and Tobago',
    uruguay: 'Uruguay',
    venezuela: 'Venezuela',
  },
  Antarctica: {
    antarctica: 'Antarctica',
  },
  Asia: {
    afghanistan: 'Afghanistan',
    azerbaijan: 'Azerbaijan',
    bangladesh: 'Bangladesh',
    bhutan: 'Bhutan',
    brunei: 'Brunei',
    cambodia: 'Cambodia',
    china: 'China',
    'east-timor': 'East Timor',
    india: 'India',
    indonesia: 'Indonesia',
    japan: 'Japan',
    kazakhstan: 'Kazakhstan',
    kyrgyzstan: 'Kyrgyzstan',
    laos: 'Laos',
    malaysia: 'Malaysia',
    maldives: 'Maldives',
    mongolia: 'Mongolia',
    myanmar: 'Myanmar',
    nepal: 'Nepal',
    'north-korea': 'North Korea',
    pakistan: 'Pakistan',
    philippines: 'Philippines',
    singapore: 'Singapore',
    'south-korea': 'South Korea',
    'sri-lanka': 'Sri Lanka',
    tajikistan: 'Tajikistan',
    thailand: 'Thailand',
    turkmenistan: 'Turkmenistan',
    uzbekistan: 'Uzbekistan',
    vietnam: 'Vietnam',
  },
  Oceania: {
    australia: 'Australia',
    'cook-islands': 'Cook Islands',
    'kiribati-islands': 'Kiribati Islands',
    'federated-states-of-micronesia': 'Federated States of Micronesia',
    'fiji-islands': 'Fiji Islands',
    'marshall-islands': 'Marshall Islands',
    nauru: 'Nauru',
    niue: 'Niue',
    'new-zealand': 'New Zealand',
    palau: 'Palau',
    'papua-new-guinea': 'Papua New Guinea',
    samoa: 'Samoa',
    'solomon-islands': 'Solomon Islands',
    tonga: 'Tonga',
    tuvalu: 'Tuvalu',
    vanuatu: 'Vanuatu',
  },
  Europe: {
    albania: 'Albania',
    andorra: 'Andorra',
    armenia: 'Armenia',
    austria: 'Austria',
    belarus: 'Belarus',
    belgium: 'Belgium',
    'bosnia-herzegovina': 'Bosnia-Herzegovina',
    bulgaria: 'Bulgaria',
    croatia: 'Croatia',
    cyprus: 'Cyprus',
    'czech-republic': 'Czech Republic',
    denmark: 'Denmark',
    estonia: 'Estonia',
    finland: 'Finland',
    france: 'France',
    georgia: 'Georgia',
    germany: 'Germany',
    greece: 'Greece',
    hungary: 'Hungary',
    iceland: 'Iceland',
    ireland: 'Ireland',
    italy: 'Italy',
    kosovo: 'Kosovo',
    latvia: 'Latvia',
    liechtenstein: 'Liechtenstein',
    lithuania: 'Lithuania',
    luxembourg: 'Luxembourg',
    'malta-republic': 'Malta',
    moldova: 'Moldova',
    monaco: 'Monaco',
    montenegro: 'Montenegro',
    netherlands: 'Netherlands',
    norway: 'Norway',
    poland: 'Poland',
    portugal: 'Portugal',
    'republic-of-north-macedonia': 'Republic of North Macedonia',
    romania: 'Romania',
    russia: 'Russia',
    'san-marino': 'San Marino',
    serbia: 'Serbia ',
    slovakia: 'Slovakia',
    slovenia: 'Slovenia',
    spain: 'Spain',
    sweden: 'Sweden',
    switzerland: 'Switzerland',
    turkey: 'Turkey',
    ukraine: 'Ukraine',
    'united-kingdom': 'United Kingdom',
    vatican: 'Vatican',
  },
  'Middle East/North Africa': {
    algeria: 'Algeria',
    bahrain: 'Bahrain',
    egypt: 'Egypt',
    iran: 'Iran',
    iraq: 'Iraq',
    israel: 'Israel',
    jordan: 'Jordan',
    kuwait: 'Kuwait',
    lebanon: 'Lebanon',
    libya: 'Libya',
    morocco: 'Morocco',
    oman: 'Oman',
    'palestinian-territories': 'Palestinian Territories',
    qatar: 'Qatar',
    'saudi-arabia': 'Saudi Arabia',
    sudan: 'Sudan',
    syria: 'Syria',
    tunisia: 'Tunisia',
    'united-arab-emirates': 'United Arab Emirates',
    yemen: 'Yemen',
  },
};
type TermCreateManyInput = {
  taxonomyId: number;
  parentId?: number | null;
  creatorId?: number | null;
  label: string;
  code: string;
  description: string;
  weight?: number | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

const countriesData = (r: string, taxonomyId: number, creatorId: number, parentId?: number): TermCreateManyInput[] => {
  const data = regions[r] as Record<string, unknown>;
  const res = Object.keys(data).map((d) => ({
    creatorId,
    label: data[d] as string,
    code: d,
    description: d,
    createdAt: dayjs().utc().format(),
    updatedAt: dayjs().utc().format(),
    taxonomyId,
    parentId: parentId || null,
  }));
  return res;
};

const regionsData = (taxonomyId: number, creatorId: number) => {
  const data = regions as Record<string, unknown>;
  return Object.keys(data).map((d) => {
    return {
      creatorId,
      label: d,
      code: d,
      description: d,
      createdAt: dayjs().utc().format(),
      updatedAt: dayjs().utc().format(),
      taxonomyId,
    };
  });
};

const forceDeleteCountriesFn = async () => {
  const removedTerms = prisma.taxonomy.update({
    where: {
      code: 'region',
    },
    data: {
      terms: {
        deleteMany: {},
      },
    },
  });
  const transactions = [
    removedTerms,
    prisma.taxonomy.delete({
      where: {
        code: 'region',
      },
    }),
  ];

  try {
    await prisma.$transaction(transactions);
  } catch (error) {
    console.log({ error });
  }
};

const populateRegions = async (admin: { id: number }) => {
  if (forceDelete) await forceDeleteCountriesFn();
  let regionTax = await prisma.taxonomy.findFirst({ where: { code: 'region' } });

  if (!regionTax) {
    regionTax = await prisma.taxonomy.create({
      data: {
        creatorId: admin.id,
        label: 'Region',
        code: 'region',
        description: 'Region',
        createdAt: dayjs().utc().format(),
        updatedAt: dayjs().utc().format(),
      },
    });
  }

  let regionsAll = await prisma.term.findMany();
  if (!regionsAll.length) {
    await prisma.term.createMany({ data: regionsData(regionTax.id, admin.id) });
  }
  regionsAll = await prisma.term.findMany();

  const countriesAll = await prisma.term.findMany({
    where: { parentId: { not: null } },
  });
  // console.log("countriesAll ",countriesAll);
  if (!countriesAll.length) {
    const promises: unknown[] = [];
    regionsAll.forEach((r: { code: string; id: number }) => {
      if (regionTax) {
        const countr = countriesData(r.code, regionTax.id as number, admin.id, r.id);
        console.log('countr ', countr);
        promises.push(prisma.term.createMany({ data: countr }));
      }
    });
    await Promise.all(promises);
  }
};

async function main() {
  const admin = await prisma.user.findFirst({ where: { roles: 'admin' } });
  if (admin) {
    await populateRegions(admin);
  } else console.error('Not user admin found');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
