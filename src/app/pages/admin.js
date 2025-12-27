import { getSession } from "next-auth/react";
import { useRouter } from "next/router";

const AdminPage = ({ user }) => {
  const router = useRouter();

  if (user?.role !== "admin") {
    router.push("/"); // Redirect if not admin
    return null;
  }

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.username}. You are an admin.</p>
      {/* Admin content goes here */}
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);
  
  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}

export default AdminPage;
