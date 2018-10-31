const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
	const { username, email } = user;
	return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
	Query: {
		getCurrentUser: async (_, args, { User, currentUser }) => {
			if (!currentUser) {
				return null;
			}
			const user = await User.findOne({
				username: currentUser.username
			}).populate({
				path: "favorites",
				model: "Post"
			});
			return user;
		},
		getPosts: async (_, args, { Post }) => {
			const posts = await Post.find({})
				.sort({ createdDate: "desc" })
				.populate({
					path: "createdBy",
					model: "User"
				});
			return posts;
		},
		getPost: async (_, { postId }, { Post }) => {
			const post = await Post.findOne({ _id: postId }).populate({
				path: "messages.messageUser",
				model: "User"
			});
			return post;
		},
		searchPost: async (_, { searchTerm }, { Post }) => {
			if (searchTerm) {
				const searchResult = await Post.find(
					//Perform text search for search value of 'searchTerm'
					{ $text: { $search: searchTerm } },
					//Asign 'searchTerm' a text score to provid best match
					{ score: { $meta: "textScore" } }
					//Sort result according to that textscore (as well as by likes)
				)
					.sort({
						score: { $meta: "textScore" },
						likes: "desc"
					})
					.limit(5);
				return searchResult;
			}
		},
		getUserPosts: async (_, { userId }, { Post }) => {
			const posts = await Post.find({ createdBy: userId });
			return posts;
		},
		infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
			let posts;
			if (pageNum === 1) {
				posts = await Post.find({})
					.sort({ createdDate: "desc" })
					.populate({
						path: "createdBy",
						model: "User"
					})
					.limit(pageSize);
			} else {
				// If page number is grater than one, figure out how many documents to skip
				const skips = pageSize * (pageNum - 1);
				posts = await Post.find({})
					.sort({ createdDate: "desc" })
					.populate({
						path: "createdBy",
						model: "User"
					})
					.skip(skips)
					.limit(pageSize);
			}
			const totalDocs = await Post.countDocuments();
			const hasMore = totalDocs > pageSize * pageNum;
			return { posts, hasMore };
		}
	},
	Mutation: {
		addPost: async (
			_,
			{ title, imageUrl, categories, description, creatorId },
			{ Post }
		) => {
			const newPost = await new Post({
				title,
				imageUrl,
				categories,
				description,
				createdBy: creatorId
			}).save();
			return newPost;
		},
		addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
			const newMessage = {
				messageBody,
				messageUser: userId
			};
			const post = await Post.findOneAndUpdate(
				{ _id: postId },
				{ $push: { messages: { $each: [newMessage], $position: 0 } } },
				{ new: true }
			).populate({
				path: "messages.messageUser",
				model: "User"
			});
			return post.messages[0];
		},
		updateUserPost: async (
			_,
			{ userId, postId, title, imageUrl, description, categories },
			{ Post }
		) => {
			const post = await Post.findOneAndUpdate(
				{
					_id: postId,
					createdBy: userId
				},
				{
					$set: { title, imageUrl, description, categories }
				},
				{ new: true }
			);
			return post;
		},
		likePost: async (_, { postId, username }, { Post, User }) => {
			const post = await Post.findOneAndUpdate(
				{ _id: postId },
				{ $inc: { likes: 1 } },
				{ new: true } //return updated value
			);
			const user = await User.findOneAndUpdate(
				{ username },
				{ $addToSet: { favorites: postId } },
				{ new: true }
			).populate({
				path: "favorites",
				model: "Post"
			});
			return {
				likes: post.likes,
				favorites: user.favorites
			};
		},
		unlikePost: async (_, { postId, username }, { Post, User }) => {
			const post = await Post.findOneAndUpdate(
				{ _id: postId },
				{ $inc: { likes: -1 } },
				{ new: true } //return updated value
			);
			const user = await User.findOneAndUpdate(
				{ username },
				{ $pull: { favorites: postId } },
				{ new: true }
			).populate({
				path: "favorites",
				model: "Post"
			});
			return {
				likes: post.likes,
				favorites: user.favorites
			};
		},
		signinUser: async (_, { username, password }, { User }) => {
			const user = await User.findOne({ username });
			if (!user) {
				throw new Error("Username or password is incorrect");
			}
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				throw new Error("Username or password is incorrect");
			}
			return { token: createToken(user, process.env.secret, "1hr") };
		},
		signupUser: async (_, { username, email, password }, { User }) => {
			const user = await User.findOne({ username });
			if (user) {
				throw new Error("User already exists");
			}
			const newUser = await new User({
				username,
				email,
				password
			}).save();
			return { token: createToken(newUser, process.env.secret, "1hr") };
		}
	}
};
