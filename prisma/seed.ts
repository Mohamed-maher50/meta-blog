// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// helper for random pick
const randomPick = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

async function main() {
  // 1. Topics
  const topicNames = ["Technology", "Science", "Art", "Health", "Travel"];
  const topics = await Promise.all(
    topicNames.map((label, index) =>
      prisma.topics.upsert({
        where: { label },
        update: {},
        create: { label, topPosition: index + 1 },
      })
    )
  );

  // 2. Users
  const usersData = [
    {
      name: "Alice",
      email: "alice@example.com",
      password: "hashedpassword",
      Social: {
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
      },
    },
    {
      name: "Bob",
      email: "bob@example.com",
      password: "hashedpassword",
      Social: {
        instagram: "",
        facebook: "",
        twitter: "",
        linkedin: "",
      },
    },
    {
      name: "Charlie",
      email: "charlie@example.com",
      password: "hashedpassword",
      Social: {
        instagram: "",
        facebook: "charlie_fb",
        twitter: "",
        linkedin: "",
      },
    },
  ];

  const users = await Promise.all(
    usersData.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: u,
      })
    )
  );

  // 3. Blogs
  const blogs = await Promise.all(
    users.map((user, i) =>
      prisma.blog.create({
        data: {
          title: `Sample Blog ${i + 1}`,
          content: { body: `Content for blog ${i + 1}` },
          authorId: user.id,
          cover: {
            public_id: `cover${i + 1}`,
            width: 800,
            height: 600,
            format: "jpg",
            created_at: new Date().toISOString(),
            src: `https://picsum.photos/800/600?random=${i + 1}`,
          },
          images: [
            {
              width: 800,
              height: 600,
              src: `https://picsum.photos/800/600?random=${i + 10}`,
              name: `image${i + 1}`,
            },
          ],
          readingTime: 5 + i,
        },
      })
    )
  );

  // 4. BlogTopics (assign random topic)
  for (const blog of blogs) {
    const topic = randomPick(topics);
    await prisma.blogTopics.create({
      data: {
        blogId: blog.id,
        topicId: topic.id,
      },
    });
  }

  // 5. Favorites & Likes
  for (const user of users) {
    const blog = randomPick(blogs);
    await prisma.favorites.create({
      data: {
        blogId: blog.id,
        userId: user.id,
      },
    });
    await prisma.blogLike.create({
      data: {
        blogId: blog.id,
        userId: user.id,
      },
    });
  }

  // 6. Comments + CommentLikes
  for (const blog of blogs) {
    const author = randomPick(users);
    const comment = await prisma.comment.create({
      data: {
        content: `Comment on ${blog.title}`,
        blogId: blog.id,
        authorId: author.id,
      },
    });

    // CommentLike
    const liker = randomPick(users.filter((u) => u.id !== author.id));
    await prisma.commentLike.create({
      data: {
        commentId: comment.id,
        userId: liker.id,
      },
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
