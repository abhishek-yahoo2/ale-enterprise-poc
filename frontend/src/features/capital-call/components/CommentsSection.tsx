//implement comments display and add new comment functionality for capital call details page in React using TypeScript and react-hook-form and make sure it is responsive and mobile-friendly and follows best practices for accessibility and user experience as well strictly follow the frontend-spec.md guidelines for styling and component structure.
//import React from 'react'; import { useForm, Controller } from 'react-hook-form'; import Table from '../../../components/ui/Table'; interface Comment { id: string; author: string; content: string; timestamp: string; } interface CommentsSectionProps { comments: Comment[]; onAddComment: (content: string) => void; } interface CommentFormValues { content: string; } const CommentsSection: React.FC<CommentsSectionProps> = ({ comments, onAddComment }) => { const { control, handleSubmit, reset } = useForm<CommentFormValues>({ defaultValues: { content: '', }, }); const onSubmit = (data: CommentFormValues) => { onAddComment(data.content); reset(); }; return ( <div className="comments-section"> <h2 className="text-xl font-semibold mb-4">Comments</h2> <Table><thead> <tr> <th className="text-left">Author</th> <th className="text-left">Comment</th> <th className="text-left">Timestamp</th> </tr> </thead> <tbody> {comments.map((comment) => ( <tr key={comment.id}> <td>{comment.author}</td> <td>{comment.content}</td> <td>{new Date(comment.timestamp).toLocaleString()}</td> </tr> ))} </tbody> </Table> <form onSubmit={handleSubmit(onSubmit)} className="mt-6"> <Controller name="content" control={control} rules={{ required: 'Comment content is required' }} render={({ field, fieldState }) => ( <> <textarea {...field} placeholder="Add a comment..." className={`w-full p-2 border ${fieldState.error ? 'border-red-500' : 'border-gray-300'} rounded-md`} rows={4}/> {fieldState.error && <p className="text-red-500 text-sm mt-1">{fieldState.error.message}</p>} </> )} /> <button type="submit" className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"> Add Comment </button> </form> </div> ); }; export default CommentsSection;
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Table from "../../../components/ui/Table";
interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}
interface CommentsSectionProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
}
interface CommentFormValues {
  content: string;
}
const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  onAddComment,
}) => {
  const { control, handleSubmit, reset } = useForm<CommentFormValues>({
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = (data: CommentFormValues) => {
    onAddComment(data.content);
    reset();
  };
  return (
    <div className="comments-section">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      
      <Table
        columns={[
          { header: "Author", accessor: "author" },
          { header: "Comment", accessor: "content" },
          { header: "Timestamp", accessor: "timestamp" },
        ]}
        data={comments.map((comment) => ({
          ...comment,
          timestamp: new Date(comment.timestamp).toLocaleString(),
        }))}
      />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6">
        <Controller
          name="content"
          control={control}
          rules={{ required: "Comment content is required" }}
          render={({ field, fieldState }) => (
            <>
              <textarea
                {...field}
                placeholder="Add a comment..."
                className={`w-full p-2 border ${fieldState.error ? "border-red-500" : "border-gray-300"} rounded-md`}
                rows={4}
              />
              {fieldState.error && (
                <p className="text-red-500 text-sm mt-1">
                  {fieldState.error.message}
                </p>
              )}
            </>
          )}
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {" "}
          Add Comment
        </button>
      </form>
    </div>
  );
};
export default CommentsSection;
