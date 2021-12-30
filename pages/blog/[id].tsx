import type { ReactElement } from "react";

import Image from "next/image";
import { GetStaticProps } from "next";

import Layout from "../../components/layout";

interface IBlogPost {
  title: string;
  author: string;
  date: string;
  body: Array<
    | {
        type: "heading" | "paragraph";
        value: string;
        id: string;
      }
    | {
        type: "image";
        value: {
          id: string;
          title: string;
          original: {
            width: number;
            height: number;
            src: string;
            alt: string;
          };
          thumbnail: {
            width: number;
            height: number;
            src: string;
            alt: string;
          };
        };
        id: string;
      }
  >;
}

const BlogPost = ({ title, author, date, body }: IBlogPost) => {
  return (
    <div>
      <h1>Blog Post page</h1>
      <h2>{title}</h2>
      <span>{author}</span>
      {body.map((block, index) => {
        if (block.type === "heading") {
          return <h1 key={index}>{block.value}</h1>;
        }

        if (block.type === "paragraph") {
          return (
            <div
              key={index}
              dangerouslySetInnerHTML={{ __html: block.value }}
            ></div>
          );
        }

        if (block.type === "image") {
          return (
            <div key={index}>
              <Image
                src={`http://localhost:8000${block.value.original.src}`}
                alt={block.value.original.alt}
                width={block.value.original.width}
                height={block.value.original.height}
              />
              <Image
                src={`http://localhost:8000${block.value.thumbnail.src}`}
                alt={block.value.thumbnail.alt}
                width={block.value.thumbnail.width}
                height={block.value.thumbnail.height}
              />
            </div>
          );
        }
      })}
    </div>
  );
};

BlogPost.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch("http://localhost:8000/api/v2/pages/");
  const data = await res.json();

  // Get the paths we want to pre-render based on data
  const paths = data.items.map((page: any) => ({
    params: { id: page.id.toString() },
  }));

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  // { fallback: blocking } will server-render pages
  // on-demand if the path doesn't exist.
  return { paths, fallback: "blocking" };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const res = await fetch(`http://localhost:8000/api/v2/pages/${params?.id}`);
  const data = await res.json();

  // if (!data) {
  //   return {
  //     notFound: true,
  //   }
  // }

  return {
    props: data,
  };
};

export default BlogPost;
