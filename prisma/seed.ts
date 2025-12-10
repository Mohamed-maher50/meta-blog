import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

// AUTHOR ID
const AUTHOR_ID = "692edc11c36caec5872c927b";

// TOPICS IDs
const TOPIC_IDS = [
  "645f1a3b8f1b2c001a2d3e4f",
  "645f1a3b8f1b2c001a2d3e50",
  "645f1a3b8f1b2c001a2d3e51",
  "645f1a3b8f1b2c001a2d3e52",
  "645f1a3b8f1b2c001a2d3e53",
  "692edcb7c36caec5872c927d",
  "692edcb7c36caec5872c927e",
  "692edcb8c36caec5872c927f",
  "692edcb8c36caec5872c9280",
  "692edcb8c36caec5872c9281",
  "692edcb9c36caec5872c9282",
  "692edcb9c36caec5872c9283",
  "692edcb9c36caec5872c9284",
  "692edcbac36caec5872c9285",
  "692edcbac36caec5872c9286",
  "692edcbcc36caec5872c9287",
  "692edcbcc36caec5872c9288",
  "692edcbdc36caec5872c9289",
  "692edcbdc36caec5872c928a",
  "692edcbdc36caec5872c928b",
  "692edda9c36caec5872c9292",
  "692eddb8c36caec5872c9293",
  "692eddbec36caec5872c9294",
  "692eddc7c36caec5872c9295",
  "692ee10ad1e9b51ee5b02c90",
  "692ee114d1e9b51ee5b02c91",
  "692ee137d1e9b51ee5b02c92",
  "692ee148d1e9b51ee5b02c93",
  "692ee2a4d1e9b51ee5b02c9a",
  "692ee2b3d1e9b51ee5b02c9b",
  "692ee8f6d1e9b51ee5b02ca3",
  "6938461279f47950aba328f5",
  "693848c979f47950aba328fe",
];

// fetch images from pexels
async function fetchImages() {
  const res = await axios.get("https://api.pexels.com/v1/search", {
    headers: {
      Authorization: process.env.PEXELS_API_KEY!,
    },
    params: {
      query: "technology",
      per_page: 20,
    },
  });

  return res.data.photos.map((p: any) => ({
    src: p.src.large2x,
    width: p.width,
    height: p.height,
    name: p.photographer,
  }));
}

async function main() {
  console.log("Fetching images from Pexels...");
  // const images = await fetchImages();

  console.log("Creating blogs...");

  for (let i = 0; i < 10; i++) {
    // const randomImage = images[Math.floor(Math.random() * images.length)];
    const randomTopic = TOPIC_IDS[Math.floor(Math.random() * TOPIC_IDS.length)];

    const blog = await prisma.blog.create({
      data: {
        title: `Example Blog Post #${i + 1}`,
        content: {
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: "Sample blog content..." }],
            },
          ],
        },
        cover: {
          src: "https://picsum.photos/800/600",
          width: 800,
          height: 450,
          public_id: "",
          format: "jpg",
          created_at: new Date().toISOString(),
        },
        images: [],

        authorId: AUTHOR_ID,
        readingTime: Math.floor(Math.random() * 10) + 2,
      },
    });

    await prisma.blogTopics.create({
      data: {
        blogId: blog.id,
        topicId: randomTopic,
      },
    });

    console.log(`Created blog: ${blog.title}`);
  }

  console.log("Seeding finished!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
