const Dashboard = async () => {
  const res = await fetch(`${process.env.BACKEND_URL}/api/users`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  return (
    <div className="my-12  pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-7 px-4 md:px-10 lg:px-16  ">
      <h1>Dashboard page</h1>
    </div>
  );
};

export default Dashboard;
