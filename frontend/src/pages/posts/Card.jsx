import React, { useEffect, useState } from "react";

import CommentCard from "../comments/CommentCard";
import CommentForm from "../comments/CommentForm";
import CommentsApi from "../../api/CommentsApi";
import PostsApi from "../../api/PostsApi";

export default function PostCard({ post, onDeleteClick}) {
    const [comments, setComments] = useState([]);

    // A getComments work, but createComment doesn´t work (error 404),
    // smth wrong in how here is connected to CommentsApi path and CommentController method
    async function createComment(commentData) {
        try {
            const response = await CommentsApi.createComment(commentData, post.id);
            const comment = response.data;
            const newComment = comments.concat(comment);

            setComments(newComment);
        } catch (e) {
            console.error(e);
        }
    }

    async function deleteComment(post) {
        try {
            await CommentsApi.deleteComment(post.id);
            const newComments = comments.filter((p) => p.id !== post.id);

            setComments(newComments);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        CommentsApi.getComments(post.id)
            .then(({ data }) => setComments(data))
            .catch((err) => console.error(err));
    }, [setComments]);

    // Components
    const CommentsArray = comments.map((comment) => (
        <CommentCard key={post.id} comment={comment} onDeleteClick={() => deleteComment(comment)} />
    ));

  return (
    <div className="card mt-3">
      <div className="card-body">

          <p>{post.body}</p>

          <button className="btn btn-warning" onClick={onDeleteClick}>
              Delete post
          </button>

          <div className="comments-form">
              <CommentForm
                  onSubmit={(commentData) => createComment(commentData, post.id)}
              />
          </div>

          <div className="comments-container">{CommentsArray}</div>

      </div>
    </div>
  );
}
