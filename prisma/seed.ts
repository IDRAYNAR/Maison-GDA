import { PrismaClient, Gender } from '../src/generated/prisma';

const prisma = new PrismaClient();

const toSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

async function main() {
  console.log('🌱 Démarrage du seed...');

  console.log('🔥 Purge de la base de données...');
  await prisma.favorite.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.user.deleteMany();
  console.log('🔥 Base de données purgée.');

  const testUser = await prisma.user.create({
    data: {
      id: 'user_test_gda',
      name: 'Test User GDA',
      email: 'test.gda@example.com',
    },
  });
  console.log(`👤 Utilisateur de test créé: ${testUser.name}`);

  const brandData = [
    { name: 'Jean Couturier', description: 'Parfums de luxe et créations olfactives.' },
    { name: 'Fragranza', description: 'Créateur de parfums rares et précieux.' },
    { name: 'Maison Massimo', description: 'L\'excellence de la parfumerie de niche.' },
    { name: 'Stephane Humbert Lucas 777', description: 'Haute parfumerie, luxe et spiritualité.' },
    { name: 'Les Liquides Imaginaires', description: 'Parfums comme des énigmes.' },
    { name: 'Rosendo Mateu', description: 'Maître parfumeur, créations d\'exception.' },
    { name: 'Mancera', description: 'Intensité des parfums d\'orient, modernité française.' },
    { name: 'Montale', description: 'Les trésors olfactifs de l\'Arabie.' },
    { name: 'Kajal', description: 'Luxe et élégance inspirés par la beauté.' },
    { name: 'Nishane', description: 'Première maison de parfum de niche d\'Istanbul.' },
    { name: 'Atelier des Ors', description: 'Haute parfumerie poétique.' },
    { name: 'Les Princes Du Golfe', description: 'Les senteurs envoûtantes du Golfe.' },
    { name: 'Maison Berliner', description: 'Parfums de créateur, audacieux et contemporains.' },
  ];

  await prisma.brand.createMany({
    data: brandData.map((b) => ({ ...b, slug: toSlug(b.name), website: '' })),
  });
  const brands = await prisma.brand.findMany();
  const brandMap = new Map(brands.map((b) => [b.name, b.id]));
  console.log(`🏷️ ${brands.length} marques créées.`);

  const categoryData = [
    { name: 'Gourmand', description: 'Parfums aux notes sucrées et appétissantes.' },
    { name: 'Fruité', description: 'Senteurs fraîches et vives de fruits.' },
    { name: 'Floral', description: 'Bouquets de fleurs, du plus léger au plus opulent.' },
    { name: 'Oriental', description: 'Accords chauds, sensuels et épicés.' },
    { name: 'Frais', description: 'Notes hespéridées, aquatiques et vertes.' },
    { name: 'Boisé', description: 'Senteurs de bois, de la forêt au bois précieux.' },
    { name: 'Épicé', description: 'Caractère et chaleur des épices du monde.' },
  ];
  await prisma.category.createMany({
    data: categoryData.map((c) => ({ ...c, slug: toSlug(c.name) })),
  });
  const categories = await prisma.category.findMany();
  const categoryMap = new Map(categories.map((c) => [c.name, c.id]));
  console.log(`📂 ${categories.length} catégories créées.`);

  const productsData = [
    {
      name: 'Vanilla Exotica',
      description: 'Un aller simple vers une île paradisiaque. Vanille solaire, fleurs exotiques et coco soyeuse… Ce parfum, c’est la caresse d’un coucher de soleil sur peau salée. Idéal pour celles et ceux qui veulent sentir l’été toute l’année.',
      price: 70,
      volume: 100,
      topNotes: ['noix de coco', 'pêche', 'muguet'],
      heartNotes: ['jasmin', 'ylang-ylang', 'fleur de tiaré', 'sucre de canne'],
      baseNotes: ['vanille', 'bois de santal', 'musc'],
      brandId: brandMap.get('Jean Couturier')!,
      categoryId: categoryMap.get('Gourmand')!,
    },
    {
      name: 'Coeur Blanc',
      description: 'Un moment suspendu, comme une étreinte au petit matin. La coco fondante, la vanille caressante et le musc blanc délicat enveloppent la peau d’un nuage tendre et lumineux. C’est la douceur d’un instant intime… rien que pour vous.',
      price: 70,
      volume: 100,
      topNotes: ['noix de coco crémeuse (de Tahiti)', 'vanille sucrée (de Madagascar)'],
      heartNotes: ['bois de cèdre élégant'],
      baseNotes: ['musc blanc pur et enveloppant'],
      brandId: brandMap.get('Fragranza')!,
      categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'La Rose Bleue',
        description: 'Rose Bleu, c\'est la fraîcheur d\'un matin lumineux, où les agrumes éclatent comme un sourire. Un cœur doux et fruité glisse vers un fond musqué, chaud et réconfortant.',
        price: 100,
        volume: 100,
        topNotes: ['orange', 'bergamote', 'citron'],
        heartNotes: ['notes fruitées', 'florales et sucrées'],
        baseNotes: ['muscs blancs', 'ambre vanillé', 'bois de cèdre'],
        brandId: brandMap.get('Maison Massimo')!,
        categoryId: categoryMap.get('Floral')!,
    },
    {
        name: 'Gold Signature',
        description: 'Gold Signature incarne l\'élégance chaleureuse et lumineuse. Une ouverture fraîche et épicée qui révèle un cœur floral délicat, posé sur un fond riche, vanillé et boisé. Parfait pour marquer les moments précieux avec raffinement et charisme.',
        price: 100,
        volume: 100,
        topNotes: ['bergamote', 'citron', 'poivre rose'],
        heartNotes: ['jasmin', 'fleur d\'oranger', 'rose'],
        baseNotes: ['bois de santal', 'patchouli', 'vanille', 'ambre'],
        brandId: brandMap.get('Maison Massimo')!,
        categoryId: categoryMap.get('Oriental')!,
    },
    {
        name: 'Soleil de Jeddah Mango Kiss',
        description: 'Soleil de Jeddah Mango Kiss est une invitation à un voyage paradisiaque. Les notes acidulées de mandarine et de mangue pétillent dès l\'ouverture, tandis que la fraîcheur d\'un sorbet coco contraste avec les facettes sucrées de l\'ylang-ylang. Une douceur addictive d\'ambre solaire et d\'absolu de vanille sublime les gourmandises facétieuses.',
        price: 190,
        volume: 50,
        topNotes: ['Mangue', 'Huile de Camomille Sauvage', 'Fleur d\'Oranger'],
        heartNotes: ['Ylang Ylang', 'Ambre', 'Noix de Coco'],
        baseNotes: ['Beurre d\'iris', 'Benjoin de Siam', 'Vanille de Madagascar'],
        brandId: brandMap.get('Stephane Humbert Lucas 777')!,
        categoryId: categoryMap.get('Fruité')!,
    },
    {
        name: 'Blanche Bete',
        description: 'Blanche Bête est une invitation à un voyage sensoriel dans un jardin féerique, où la pureté d\'un cheval mythique se mêle à la magie des fleurs blanches. Son accord lacté et musqué évoque une douceur enveloppante, tandis que ses notes florales et gourmandes créent une aura mystérieuse et envoûtante. Un parfum mixte qui incarne l\'amour et le mystère, parfait pour ceux qui souhaitent se connecter à leur imaginaire et à leur créativité.',
        price: 190,
        volume: 100,
        topNotes: ['Graine d\'ambrette', 'Accord lacté'],
        heartNotes: ['Jasmin', 'Tubéreuse', 'Encens'],
        baseNotes: ['Fève tonka', 'Cacao', 'Vanille musquée'],
        brandId: brandMap.get('Les Liquides Imaginaires')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Numero 5',
        description: 'Rosendo Mateu 5, c\'est ce moment intense où une explosion d\'épices et de fleurs envoûtantes se transforme en un sillage chaud, musqué et légèrement gourmand. Une fragrance charnelle, mystérieuse et sophistiquée — idéale pour une soirée intime ou pour laisser une impression captivante.',
        price: 140,
        volume: 100,
        topNotes: ['épices', 'poivre noir', 'cardamome', 'fleurs exotiques (jasmin, muguet, rose)'],
        heartNotes: ['œillet', 'bois de cèdre', 'patchouli', 'cuir'],
        baseNotes: ['ambre', 'musc', 'vanille', 'fève tonka', 'benjoin (et même accord fraise gourmand)'],
        brandId: brandMap.get('Rosendo Mateu')!,
        categoryId: categoryMap.get('Oriental')!,
    },
    {
        name: 'Instant Crush',
        description: 'Imaginez-vous lors d\'une soirée en extérieur, vêtue d\'un trench chic. Une bouffée chaleureuse de safran et d\'agrume s\'élance, suivie d\'un cœur floral somptueux avant de s\'épanouir en un sillage sensuel de vanille et de bois creux. Instant Crush capte l\'attention — un parfum audacieux, à la fois chaud et frais.',
        price: 100,
        volume: 120,
        topNotes: ['safran', 'gingembre', 'mandarine & bergamote siciliennes'],
        heartNotes: ['amberwood', 'rose du Maroc', 'jasmin d\'Égypte', 'patchouli indonésien'],
        baseNotes: ['vanille de Madagascar', 'santal', 'musc blanc', 'mousse de chêne'],
        brandId: brandMap.get('Mancera')!,
        categoryId: categoryMap.get('Oriental')!,
    },
    {
        name: 'Arabians Tonka',
        description: 'Arabians Tonka est une explosion gourmande et intense : safran épicé et oud chaud s\'unissent à la douceur envoûtante de la tonka et du sucre. Un parfum signé niche, chaud et sensuel, avec un sillage incroyable.',
        price: 100,
        volume: 100,
        topNotes: ['safran', 'bergamote'],
        heartNotes: ['oud', 'rose de Bulgarie'],
        baseNotes: ['fève tonka', 'sucre de canne', 'ambre', 'musc blanc', 'mousse de chêne'],
        brandId: brandMap.get('Montale')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Almaz',
        description: 'Almaz est une explosion fruitée et gourmande — bergamote et cassis frais en tête, évoluant vers un cœur floral crémeux, avant un fond chaud de vanille, tonka et musc doux. Une fragrance unisexe lumineuse et délicate, idéale tous les jours, avec ce petit plus luxe discret.',
        price: 150,
        volume: 100,
        topNotes: ['bergamote', 'cassis', 'citron d\'Amalfi', 'mandarine'],
        heartNotes: ['framboise', 'héliotrope', 'jasmin/iris', 'rose turque'],
        baseNotes: ['musc', 'bois (santal)', 'vanille de Madagascar', 'fève tonka', 'ambre', 'sucré brun/caroon'],
        brandId: brandMap.get('Kajal')!,
        categoryId: categoryMap.get('Fruité')!,
    },
    {
        name: 'Hacivat',
        description: 'Hacivat, c\'est l\'éclat d\'un cocktail fruité – ananas juteux, agrumes pétillants – qui s\'adoucit en un cœur boisé floral avant de s\'ancrer dans un sillage sec, profond et raffiné. Un chypre moderne, unisexe, à la tenue impressionnante.',
        price: 160,
        volume: 100,
        topNotes: ['bergamote', 'ananas', 'pamplemousse'],
        heartNotes: ['jasmin', 'patchouli', 'cèdre'],
        baseNotes: ['clearwood® (bois sec)', 'mousse de chêne', 'bois boisé'],
        brandId: brandMap.get('Nishane')!,
        categoryId: categoryMap.get('Fruité')!,
    },
    {
        name: 'Lune Feline',
        description: 'Lune Féline est une vanille fumée et cuirée, magnifiée par des épices chaudes et des bois profonds. Une vanille sauvage, enveloppée d\'un souffle balsamique et animal — idéale pour les soirées d\'automne et d\'hiver, à porter avec audace.',
        price: 150,
        volume: 100,
        topNotes: ['cannelle', 'cardamome', 'poivre rose – l\'ouverture est épicée et vibrante'],
        heartNotes: ['cèdre', 'ambre gris', 'styrax', 'notes boisées et vertes – cœur dense et somptueux'],
        baseNotes: ['vanille de Tahiti', 'baume du Pérou', 'musc – sillage gourmand et animal'],
        brandId: brandMap.get('Atelier des Ors')!,
        categoryId: categoryMap.get('Oriental')!,
    },
    {
        name: 'Vanilla Island',
        description: 'Vanilla Island, c\'est un voyage sensoriel : l\'éclat rafraîchissant de la bergamote, suivi d\'un bouquet floral exotique, avant une finale enveloppante de vanille ambrée. Parfait pour une ambiance estivale et élégante autour de soi, à tout moment.',
        price: 130,
        volume: 100,
        topNotes: ['bergamote (ouverture vive et lumineuse)'],
        heartNotes: ['fleurs tropicales exotiques (bouquet flamboyant)'],
        baseNotes: ['vanille intense et chaleureuse (finale sensuelle et orientale)'],
        brandId: brandMap.get('Les Princes Du Golfe')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Emeraude Gourmande',
        description: 'Emeraude Gourmande est un voyage exotique : l\'intensité gourmande de la noix de coco, du caramel et des fruits rouges, adoucie par des fleurs blanches fraîches, se pose sur une base chaleureuse et enveloppante de musc et vanille. Un parfum mixte, solaire et sensuel, parfait à porter en toute saison pour évoquer l\'évasion.',
        price: 50,
        volume: 50,
        topNotes: ['noix de coco', 'caramel', 'bergamote', 'orange', 'fruits rouges'],
        heartNotes: ['jasmin sambac', 'fleurs d\'oranger', 'patchouli'],
        baseNotes: ['musc moderne', 'vanille'],
        brandId: brandMap.get('Les Princes Du Golfe')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Musc Vanille',
        description: 'Musc Vanille est un parfum chaleureux et gourmand où les agrumes frais s\'ouvrent sur un cœur musqué enrichi de nuances pralinées, avant de s\'épanouir en une vanille douce et ambrée. Une fragrance réconfortante, parfaite pour un moment intime, qui enveloppe délicatement la peau d\'un voile sucré et réconfortant.',
        price: 50,
        volume: 50,
        topNotes: ['bergamote', 'orange douce'],
        heartNotes: ['musc blanc', 'fleurs blanches', 'praliné gourmand'],
        baseNotes: ['vanille gourmande', 'ambre', 'bois blancs'],
        brandId: brandMap.get('Les Princes Du Golfe')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Desir de Nuit',
        description: 'Desir de Nuit est une fragrance envoûtante où la douceur de la fève tonka s\'ouvre sur un cœur floral élégant d\'iris et de jasmin, soutenu par la profondeur du cèdre. En fond, les notes chaleureuses d\'amandes et de bois de santal apportent une touche orientale et sensuelle. Ce parfum mixte, à la fois mystérieux et raffiné, est idéal pour les soirées spéciales ou les moments où l\'on souhaite laisser une empreinte olfactive mémorable.',
        price: 40,
        volume: 50,
        topNotes: ['fève tonka'],
        heartNotes: ['iris', 'jasmin', 'cèdre'],
        baseNotes: ['amandes', 'bois de santal'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Oriental')!,
    },
    {
        name: 'Bonbec',
        description: 'Bonbec est un parfum gourmand et fruité qui mêle fraîcheur des agrumes et cassis à un cœur floral délicat, avant de laisser s\'épanouir un fond chaleureux de caramel, vanille et musc. Une joyeuse douceur de vivre, douce et élégante, parfaitement raffinée au quotidien.',
        price: 40,
        volume: 50,
        topNotes: ['bergamote', 'mandarine', 'cassis'],
        heartNotes: ['jasmin', 'rose', 'fruits rouges'],
        baseNotes: ['caramel', 'vanille', 'musc'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Sucre Pink',
        description: 'Sucre Pink est une gourmandise olfactive qui débute par une explosion fruitée de framboise et cassis, suivie d\'un cœur floral délicat de rose et jasmin. Le fond vanille et caramel, adouci par le musc, apporte une douceur chaleureuse et addictive. Parfait pour ceux qui aiment les parfums sucrés, féminins et élégants.',
        price: 40,
        volume: 50,
        topNotes: ['framboise', 'cassis'],
        heartNotes: ['rose', 'jasmin'],
        baseNotes: ['vanille', 'caramel', 'musc'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Halim',
        description: 'Halim est une fragrance gourmande et sensuelle qui s\'ouvre sur la douceur chaleureuse du sucre roux, évoluant vers un cœur enveloppant de vanille. En fond, l\'orchidée apporte une touche florale raffinée, créant un parfum à la fois doux et élégant. Parfait pour les moments où l\'on souhaite se sentir enveloppé de chaleur et de confort.',
        price: 40,
        volume: 50,
        topNotes: ['sucre roux'],
        heartNotes: ['vanille'],
        baseNotes: ['orchidée'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
    {
        name: 'Janeiro',
        description: 'Janeiro est une fragrance fraîche, lumineuse et florale. L\'ouverture vive d\'agrumes et d\'épices laisse place à un cœur délicat mêlant jasmin, muguet et fleur d\'oranger. La base musquée et boisée apporte une élégance douce et boisée pour un usage quotidien. Il évoque la vitalité et la douceur d\'un matin ensoleillé.',
        price: 40,
        volume: 50,
        topNotes: ['bergamote', 'citron', 'poivre rose'],
        heartNotes: ['jasmin', 'muguet', 'fleur d\'oranger'],
        baseNotes: ['musc blanc', 'cèdre', 'ambre blanc'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Frais')!,
    },
    {
        name: 'Buteur',
        description: 'Buteur est une fragrance estivale et sensuelle qui s\'ouvre sur des notes acidulées et fougueuses d\'orange, le citron de Sicile et la bergamote de Calabre. Son voyage se poursuit grâce à des notes de cœur fruitées et enivrantes, avant de dévoiler un fond séducteur mêlant musc blanc, vanille de Madagascar et ambre. Ce parfum est idéal pour les journées d\'été, frais, pétillant et ensoleillé, parfait pour ceux qui recherchent une fragrance qui les rend irrésistibles.',
        price: 40,
        volume: 50,
        topNotes: ['orange', 'citron de Sicile', 'bergamote de Calabre'],
        heartNotes: ['fruits'],
        baseNotes: ['musc blanc', 'vanille de Madagascar', 'ambre'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Fruité')!,
    },
    {
        name: 'Retourne-Toi',
        description: 'Retourne Toi est une fragrance envoûtante et mystérieuse qui séduit dès les premières notes. Son ouverture douce et intrigante de caramel, fruits rouges et pêche est rehaussée par la chaleur épicée du safran et la profondeur audacieuse du cuir. Au cœur, des accords de poivre rose, de gingembre et de bois précieux s\'entrelacent pour créer une énergie vibrante, entre intensité et raffinement. En fond, la richesse sensuelle du oud s\'accorde avec le benjoin, le baumier du Pérou, tandis que le musc prolonge une sensation enveloppante et addictive. Ce parfum est une expérience olfactive inoubliable qui éveille les sens.',
        price: 40,
        volume: 50,
        topNotes: ['caramel', 'fruits rouges', 'pêche', 'safran', 'cuir'],
        heartNotes: ['poivre rose', 'notes boisées', 'gingembre'],
        baseNotes: ['vanille', 'oud', 'benjoin', 'musc', 'baumier du Pérou'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Oriental')!,
    },
    {
        name: 'Vanille Speculoos',
        description: 'Vanille Spéculos est une fragrance gourmande et chaleureuse qui évoque la douceur des biscuits épicés. Son ouverture de musc blanc est suivie par un cœur boisé de santal, tandis que les notes de fond de pomme et d\'oud apportent une touche fruitée et boisée. Ce parfum est idéal pour ceux qui recherchent une expérience olfactive réconfortante et nostalgique.',
        price: 40,
        volume: 50,
        topNotes: ['musc blanc'],
        heartNotes: ['bois de santal'],
        baseNotes: ['pomme', 'oud'],
        brandId: brandMap.get('Maison Berliner')!,
        categoryId: categoryMap.get('Gourmand')!,
    },
  ];

  const finalProducts = productsData.map(p => ({
    ...p,
    slug: toSlug(p.name),
    originalPrice: p.price + 15,
    images: [`/products/${toSlug(p.name)}.png`],
    concentration: 'Eau de Parfum',
    gender: Gender.UNISEX,
    featured: Math.random() > 0.5,
    inStock: true,
  }))

  for (const productData of finalProducts) {
    await prisma.product.create({
      data: productData,
    });
  }

  console.log(`🧴 ${finalProducts.length} produits créés.`);

  const createdProducts = await prisma.product.findMany({ take: 5 });
  for (const product of createdProducts) {
    await prisma.favorite.create({
      data: {
        userId: testUser.id,
        productId: product.id,
      },
    });
  }
  console.log(`❤️ ${createdProducts.length} favoris créés pour l'utilisateur de test.`);

  console.log('✅ Seed terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 