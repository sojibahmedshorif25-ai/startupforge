import Post from '../models/Post.js';

export const getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category && category !== 'All' ? { category } : {};
    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(20);
    return res.status(200).json({ success: true, posts });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const user = req.user;

    const post = await Post.create({
      author_name: user.name,
      author_email: user.email,
      author_image: user.image || '',
      author_role: user.role,
      title,
      content,
      category: category || 'General',
      tags: tags || [],
    });

    return res.status(201).json({ success: true, post });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    const index = post.likes.indexOf(userEmail);
    if (index === -1) {
      post.likes.push(userEmail);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();
    return res.status(200).json({ success: true, likes: post.likes.length, isLiked: index === -1 });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user = req.user;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }

    post.comments.push({
      author_name: user.name,
      author_email: user.email,
      author_image: user.image || '',
      content
    });

    await post.save();
    return res.status(200).json({ success: true, comments: post.comments });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
