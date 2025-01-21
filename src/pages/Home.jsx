import Dashboardlayout from './../layout/Dashboardlayout'
import ApplicationSummary from "@/components/ui/ApplicationSummary";

const Home = () => {
  const newApplicationsCount = 10; // Replace 0 with the count of new applications
  const inProgressApplicationsCount = 30; // Replace 0 with the count of in-progress applications
  const completedApplicationsCount = 40; // Replace 0 with the count of completed
  return (
    <div>
      <Dashboardlayout>
        <h1 className='text-3xl font-bold p-4'>Dashboard</h1>
        <div className="grid grid-cols-1 p-8 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ApplicationSummary title="New Applications" count={newApplicationsCount} />
          <ApplicationSummary title="In Progress" count={inProgressApplicationsCount} />
          <ApplicationSummary title="Completed" count={completedApplicationsCount} />
        </div>
      </Dashboardlayout>

    </div>
  )
}

export default Home
