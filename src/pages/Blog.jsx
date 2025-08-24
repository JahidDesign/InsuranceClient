// File: Blog.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import BlogListBigCard from "./BlogCard";
import VisitorNewsCards from "./VisitorNewsCards";

const Blog = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      {/* ✅ SEO Helmet + Favicon */}
      <Helmet>
        <title>Blog | Smart Insurance</title>
        <meta
          name="description"
          content="Read the latest news, insights, and articles from Smart Insurance. Stay updated with tips on policies, claims, and financial protection."
        />
        <meta
          name="keywords"
          content="insurance blog, smart insurance news, policy updates, insurance tips"
        />

        {/* ✅ Favicon setup */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Helmet>

      {/* Blog Content */}
      <BlogListBigCard />
      <VisitorNewsCards />
    </div>
  );
};

export default Blog;
