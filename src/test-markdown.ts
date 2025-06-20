// Test file to verify markdown imports work
import matter from 'gray-matter';

// Try to import the markdown file using a different approach
const testPostContent = `---
title: "This is a Test Post"
date: "2024-07-25"
summary: "This is a short summary of the test post, created to verify that the blog is working correctly."
---

This is the main content of the test blog post. It demonstrates how a new post will appear on your website.

You can use standard markdown syntax to format your posts, including:

*   Lists
*   **Bold text**
*   *Italic text*

Feel free to edit or delete this post as needed.`;

console.log('Test post content:', testPostContent);
const { data } = matter(testPostContent);
console.log('Parsed frontmatter:', data);

export { testPostContent, data }; 