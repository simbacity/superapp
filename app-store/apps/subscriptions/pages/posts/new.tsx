import Layout from "@app-store/apps/subscriptions/components/Layout";
import NewPostForm from "@app-store/apps/subscriptions/components/NewPostForm";

export default function PostEdit() {
  return (
    <Layout>
      <div className="bg-slate-800 rounded-md py-7">
        <h1 className="text-xl text-white border-b border-gray-300 px-4 pb-7">Add new post</h1>
        <div className="flex pt-7 px-4 border-b border-gray-200">
          <button className="text-lg text-gray-300 mx-2 pb-4 px-4 border-b-4 border-gray-300">
            MULTIMEDIA POST
          </button>
        </div>
        <div className="flex justify-center">
          <div className="w-1/2 py-8">
            <NewPostForm />
          </div>
        </div>
      </div>
    </Layout>
  );
}
