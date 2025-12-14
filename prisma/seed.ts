import { Format, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";
const prisma = new PrismaClient();
const htmlContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: {
        level: 1,
      },
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Exploring the Wonders of Nature",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Nature has always fascinated humans, offering a perfect blend of beauty and tranquility. From majestic mountains to serene rivers, every corner of our planet has something unique to offer. The diversity of landscapes, climates, and ecosystems is truly astonishing and never fails to inspire awe.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Exploring the outdoors not only rejuvenates the mind but also teaches us valuable lessons about resilience and balance in life. Whether you are hiking in dense forests or walking along peaceful beaches, each experience brings a sense of calm and connection to the natural world.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "[Image: Majestic mountains at sunrise]",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Wildlife Adventures",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Encounters with wildlife are always thrilling. Observing animals in their natural habitat reminds us of the delicate balance that sustains life on Earth. Birds chirping in the morning, deer grazing silently, and the occasional glimpse of a fox weaving through the trees create unforgettable memories.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Every adventure teaches respect for living creatures and the environments they call home. From tracking animal footprints in muddy trails to listening to the sounds of nocturnal life, the richness of wildlife experiences deepens our appreciation for the planet.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "[Image: Deer grazing in a misty forest]",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Forests and Green Spaces",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Forests are the lungs of our planet, providing oxygen and shelter for countless species. Walking beneath towering trees, hearing leaves rustle in the wind, and feeling the soft forest floor beneath your feet evokes a sense of serenity and grounding. Green spaces, whether vast wilderness or urban parks, offer an essential escape from the pressures of modern life.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Eco-Friendly Travel Tips",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Traveling responsibly is essential to preserve the beauty of nature. Always follow local guidelines, reduce waste, and respect wildlife during your adventures. Small actions like using reusable bottles, walking instead of driving, and supporting local communities make a big difference.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Planning your trips thoughtfully ensures that the natural landscapes remain pristine for future generations. Responsible travelers leave minimal footprints, choosing sustainable accommodations and eco-conscious activities.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "[Image: Eco-friendly hiking trail]",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          marks: [
            {
              type: "bold",
            },
          ],
          text: "Connecting with Nature Every Day",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Even if you cannot travel far, connecting with nature daily improves your well-being. Simple activities such as tending a garden, walking barefoot on grass, or observing local birds can reduce stress and increase mindfulness.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Nature is not just a backdrop for adventure; it is a teacher, a healer, and a source of endless inspiration. By embracing sustainable habits and appreciating the natural world around us, we ensure that its wonders endure for generations to come.",
        },
      ],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "[Image: Serene river flowing through the forest]",
        },
      ],
    },
  ],
};
function getRandomReadingTime(min = 5, max = 30) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
async function main() {
  // مثال: إنشاء مستخدم واحد
  await prisma.$transaction(
    async (tx) => {
      // 1️⃣ Users
      const users = await tx.user.findMany();
      if (users.length === 0) return; // تأكد فيه users

      // 2️⃣ Topics
      const topicData = Array.from({ length: 5 }).map(() => ({
        label: faker.word.sample({ length: { min: 4, max: 10 } }),
      }));
      const topics = await tx.topics.createMany({
        data: topicData,
      });

      const blogs = await Promise.all(
        Array.from({ length: 10 }).map(() =>
          tx.blog.create({
            data: {
              content: htmlContent,
              title: faker.lorem.sentence(),
              readingTime: getRandomReadingTime(5, 30),
              authorId: users[Math.floor(Math.random() * users.length)].id,
              cover: {
                created_at: new Date().toISOString(),
                format: Format.webp,
                public_id: "",
                src: faker.image.url(),
                width: 800,
                height: 450,
              },
            },
          })
        )
      );

      // بعد إنشاء blogs، لازم نربط comments, likes, blogTopics
      const createdBlogs = await tx.blog.findMany(); // جلب blogs بعد الإنشاء

      // 4️⃣ Comments
      const commentsData = createdBlogs.flatMap((blog) =>
        Array.from({ length: 3 }).map(() => ({
          blogId: blog.id,
          authorId: users[Math.floor(Math.random() * users.length)].id,
          content: faker.lorem.paragraphs(2),
        }))
      );
      await tx.comment.createMany({ data: commentsData });

      // 5️⃣ Likes
      const likesData = createdBlogs.flatMap((blog) =>
        users.map((user) => ({
          blogId: blog.id,
          userId: user.id,
        }))
      );
      await tx.blogLike.createMany({ data: likesData });

      // 6️⃣ BlogTopics
      const allTopics = await tx.topics.findMany();
      const blogTopicsData = createdBlogs.flatMap((blog) =>
        allTopics.map((topic) => ({
          blogId: blog.id,
          topicId: topic.id,
        }))
      );
      await tx.blogTopics.createMany({ data: blogTopicsData });
    },
    { timeout: 20000 }
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
