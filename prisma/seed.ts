/**
 * Demo / Seed Data
 * ----------------
 * Everything created here is clearly demo data for development and review.
 * It is real data stored in the database (not fabricated at render time),
 * but it should be replaced or removed before a production launch.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: 'lighting', name: 'إضاءة', nameEn: 'Lighting', keywords: 'إضاءة,اضاءة,ليد,انارة' },
  { slug: 'furniture', name: 'أثاث', nameEn: 'Furniture', keywords: 'أثاث,اثاث,كنب,كراسي,طاولات' },
  { slug: 'pools', name: 'مسابح', nameEn: 'Pools', keywords: 'مسبح,بركة سباحة' },
  { slug: 'electrical', name: 'كهرباء', nameEn: 'Electrical', keywords: 'كهرباء,كهربائي' },
  { slug: 'plumbing', name: 'سباكة', nameEn: 'Plumbing', keywords: 'سباكة,سباك,صحي' },
  { slug: 'painting', name: 'دهانات', nameEn: 'Painting', keywords: 'دهان,طلاء' },
  { slug: 'hvac', name: 'تكييف', nameEn: 'HVAC', keywords: 'تكييف,مكيف,تبريد' },
  { slug: 'kitchen', name: 'مطابخ', nameEn: 'Kitchen', keywords: 'مطبخ' },
  { slug: 'landscaping', name: 'تنسيق حدائق', nameEn: 'Landscaping', keywords: 'حدائق,تنسيق,نخل' },
  { slug: 'interior-design', name: 'ديكور وتصميم داخلي', nameEn: 'Interior Design', keywords: 'ديكور,تصميم داخلي' },
  { slug: 'security', name: 'أنظمة أمن', nameEn: 'Security', keywords: 'أمن,كاميرات,مراقبة' },
  { slug: 'cleaning', name: 'خدمات تنظيف', nameEn: 'Cleaning', keywords: 'نظافة,تنظيف' },
];

async function main() {
  console.log('Seeding demo data…');

  // --- Admin account (isolated from end-user auth) ---
  const adminPassword = 'Admin@12345';
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin@mashroo.sa' },
    update: {},
    create: {
      name: 'مدير المنصة',
      email: 'admin@mashroo.sa',
      passwordHash: await bcrypt.hash(adminPassword, 10),
      role: 'SUPER_ADMIN',
    },
  });

  // --- Demo sellers/suppliers/providers ---
  const sellerPassword = await bcrypt.hash('Demo@12345', 10);
  const sellers = await Promise.all(
    ['نورة التجارية', 'مؤسسة البناء الحديث', 'متجر الديار'].map((name, i) =>
      prisma.user.upsert({
        where: { email: `seller${i + 1}@mashroo.sa` },
        update: {},
        create: {
          name,
          email: `seller${i + 1}@mashroo.sa`,
          passwordHash: sellerPassword,
          verified: i !== 2,
        },
      }),
    ),
  );

  // --- Categories ---
  const categories: Record<string, Awaited<ReturnType<typeof prisma.category.upsert>>> = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    categories[c.slug] = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: { ...c, order: i },
    });
  }

  // --- Products / Suppliers / Services / Reviews ---
  // Guarded so this script is safe to re-run on every deploy/build (e.g. a
  // Vercel build step) without duplicating demo listings each time.
  const alreadySeeded = (await prisma.product.count()) > 0;
  if (alreadySeeded) {
    console.log('Demo listings already present — skipping catalog seed.');
  } else {
    await seedCatalog(categories, sellers);
  }

  // --- Admin-managed homepage content ---
  await prisma.siteContent.upsert({
    where: { key: 'homepage' },
    update: {},
    create: {
      key: 'homepage',
      value: JSON.stringify({
        heroTitle: 'وش مشروعك؟ وش تحتاج؟',
        heroSubtitle: 'اكتب احتياجك، وخلي مشروع يساعدك تلقى المنتجات والموردين والخدمات المناسبة.',
        discoverTitle: 'اكتشف المنتجات والموردين والخدمات',
        discoverSubtitle: 'كل ما تحتاجه لمشروعك، في مكان واحد.',
      }),
    },
  });

  console.log('\n--- Demo credentials ---');
  console.log(`Admin:  admin@mashroo.sa / ${adminPassword}`);
  console.log('Sellers: seller1@mashroo.sa / Demo@12345 (and seller2, seller3)');
  console.log('------------------------\n');
  console.log(`Seed complete. Admin id: ${admin.id}`);
}

async function seedCatalog(
  categories: Record<string, { id: string }>,
  sellers: { id: string }[],
) {
  const productSeeds = [
    { name: 'طقم إضاءة سقفية LED (٦ قطع)', price: 620, categorySlug: 'lighting', condition: 'NEW', verified: true },
    { name: 'كشاف حديقة خارجي مقاوم للماء', price: 145, categorySlug: 'lighting', condition: 'NEW', verified: false },
    { name: 'كنبة زاوية ٧ مقاعد', price: 3200, categorySlug: 'furniture', condition: 'NEW', verified: true },
    { name: 'طاولة طعام خشب زان + ٦ كراسي', price: 2450, categorySlug: 'furniture', condition: 'USED', verified: false },
    { name: '20 كرسي مطعم قابل للتكديس', price: 3800, categorySlug: 'furniture', condition: 'NEW', verified: true },
    { name: 'مضخة مسبح 1.5 حصان', price: 980, categorySlug: 'pools', condition: 'NEW', verified: true },
    { name: 'لوحة كهرباء فرعية 24 خط', price: 410, categorySlug: 'electrical', condition: 'NEW', verified: false },
    { name: 'خلاط حمام موفر للمياه', price: 165, categorySlug: 'plumbing', condition: 'NEW', verified: true },
    { name: 'دهان خارجي مقاوم للعوامل الجوية (٢٠ لتر)', price: 320, categorySlug: 'painting', condition: 'NEW', verified: false },
    { name: 'مكيف سبليت 24000 وحدة', price: 2100, categorySlug: 'hvac', condition: 'NEW', verified: true },
    { name: 'وحدات مطبخ ألمنيوم مقاس 4 متر', price: 5400, categorySlug: 'kitchen', condition: 'NEW', verified: false },
    { name: 'نخيل زينة داخلي اصطناعي', price: 260, categorySlug: 'landscaping', condition: 'NEW', verified: false },
  ];

  const products = [];
  for (let i = 0; i < productSeeds.length; i++) {
    const p = productSeeds[i];
    const seller = sellers[i % sellers.length];
    products.push(
      await prisma.product.create({
        data: {
          name: p.name,
          description: `${p.name} — بحالة ${p.condition === 'NEW' ? 'جديدة' : 'مستعملة'}، متوفر للشحن داخل المملكة.`,
          price: p.price,
          condition: p.condition,
          images: JSON.stringify([]),
          verified: p.verified,
          stock: 10 + i,
          categoryId: categories[p.categorySlug].id,
          sellerId: seller.id,
        },
      }),
    );
  }

  // --- Suppliers ---
  const supplierSeeds = [
    { name: 'مؤسسة الإضاءة الذكية', specialty: 'توريد وتركيب أنظمة الإضاءة', categorySlug: 'lighting', verified: true, city: 'الرياض' },
    { name: 'دار الأثاث الفاخر', specialty: 'أثاث منزلي وتجاري', categorySlug: 'furniture', verified: true, city: 'جدة' },
    { name: 'شركة المسابح المتحدة', specialty: 'تنفيذ وصيانة المسابح', categorySlug: 'pools', verified: false, city: 'الدمام' },
    { name: 'مؤسسة الكهرباء الآمنة', specialty: 'مقاولات كهربائية معتمدة', categorySlug: 'electrical', verified: true, city: 'الرياض' },
    { name: 'خبراء السباكة', specialty: 'أعمال السباكة والصرف الصحي', categorySlug: 'plumbing', verified: false, city: 'مكة المكرمة' },
  ];
  const suppliers = [];
  for (let i = 0; i < supplierSeeds.length; i++) {
    const s = supplierSeeds[i];
    suppliers.push(
      await prisma.supplier.create({
        data: {
          name: s.name,
          specialty: s.specialty,
          description: `${s.specialty} لمختلف أنواع المشاريع.`,
          city: s.city,
          verified: s.verified,
          categoryId: categories[s.categorySlug].id,
          ownerId: sellers[i % sellers.length].id,
        },
      }),
    );
  }

  // --- Services ---
  const serviceSeeds = [
    { name: 'تركيب أنظمة إضاءة LED', type: 'تركيب وصيانة', categorySlug: 'lighting', areas: ['الرياض', 'الخرج'], verified: true },
    { name: 'تفصيل وتركيب أثاث حسب الطلب', type: 'تفصيل مخصص', categorySlug: 'furniture', areas: ['جدة', 'مكة المكرمة'], verified: false },
    { name: 'صيانة وتنظيف المسابح الدورية', type: 'صيانة دورية', categorySlug: 'pools', areas: ['الدمام', 'الخبر'], verified: true },
    { name: 'أعمال كهربائية عامة للمباني', type: 'مقاولات', categorySlug: 'electrical', areas: ['الرياض'], verified: true },
    { name: 'تنسيق وتصميم الحدائق المنزلية', type: 'تصميم وتنفيذ', categorySlug: 'landscaping', areas: ['الرياض', 'جدة'], verified: false },
  ];
  const services = [];
  for (let i = 0; i < serviceSeeds.length; i++) {
    const s = serviceSeeds[i];
    services.push(
      await prisma.service.create({
        data: {
          name: s.name,
          type: s.type,
          areas: JSON.stringify(s.areas),
          description: `${s.name} بجودة عالية وفريق متخصص.`,
          verified: s.verified,
          categoryId: categories[s.categorySlug].id,
          providerId: sellers[i % sellers.length].id,
        },
      }),
    );
  }

  // --- A handful of real reviews (so only some listings show ratings) ---
  const reviewer = sellers[0];
  await prisma.review.createMany({
    data: [
      { rating: 5, comment: 'جودة ممتازة وتركيب سريع.', authorId: reviewer.id, productId: products[0].id },
      { rating: 4, comment: 'تعامل جيد.', authorId: reviewer.id, productId: products[0].id },
      { rating: 5, comment: 'مورد موثوق فعلاً.', authorId: reviewer.id, supplierId: suppliers[0].id },
      { rating: 4, comment: 'التزام بالمواعيد.', authorId: reviewer.id, serviceId: services[0].id },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
