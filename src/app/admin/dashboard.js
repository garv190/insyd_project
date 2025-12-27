import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]"; // Import authOptions

export default function AdminDashboard({ session }) {
  if (session?.user.role !== "admin") {
    return <p>You do not have permission to view this page</p>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      {/* Admin content */}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context, authOptions);
  if (!session || session.user.role !== "admin") {
    return {
      redirect: {
        destination: "/auth/signin", // Redirect to sign-in page if not admin
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
