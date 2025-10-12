import { useEffect, useState } from "react";
import AddUserDrawer from "../users/components/AddUserDrawer";
import Panel from "./components/Panel";
import Statistics from "./components/Statistics";
import { getGraphs, getReminder, getStatistics, getTiers, getUsersSearch, getYearOption } from "../../http/get/getAPIs";
import QuickActions from "./components/QuickActions";
import AddMembershipDrawer from "./components/AddMembershipDrawer";
import AddPaymentsDrawer from "./components/AddPaymentsDrawer";
import { decodeJWT } from "../../utils/utils";
import SearchModal from "./components/SearchModal";
import AddReminderDrawer from "./components/AddReminderDrawer";
import Spinner from "../../components/ui/spinner/Spinner";

export default function Dashboard() {
  const user = decodeJWT();

  // Drawers and modals
  const [searchModel, setSearchModel] = useState(false);
  const [addUserDrawer, setAddUserDrawer] = useState(false);
  const [addMembershipDrawer, setAddMembershipDrawer] = useState(false);
  const [addPaymentsDrawer, setAddPaymentsDrawer] = useState(false);
  const [addReminderDrawer, setAddReminderDrawer] = useState(false);

  // Other states
  const [userSearch, setUserSearch] = useState('a');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // API data states
  const [statisticsData, setStatisticsData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [tiersData, setTiersData] = useState(null);
  const [yearOptions, setYearOptions] = useState(null);
  const [reminderData, setReminderData] = useState(null);

  const graphType = 'spline';
  const placeholderChart = {
    title: { text: '' },
    xAxis: { categories: [], crosshair: true, title: { text: 'Months' }, gridLineWidth: 1, gridLineColor: '#E0E0E0', gridLineDashStyle: 'Solid' },
    yAxis: { min: 0, title: { text: 'Counts / Revenue' } },
    tooltip: { shared: true, useHTML: true, style: { padding: '10px', borderRadius: '10px', backgroundColor: '#fff' } },
    series: [
      { name: 'Revenue', type: graphType, data: [], color: '#0F828C' },
      { name: 'Members', type: graphType, data: [], color: '#44444E' },
      { name: 'New Memberships', type: graphType, data: [], color: '#715A5A' },
      { name: 'Enquiries', type: graphType, data: [], color: '#211832' },
    ],
    responsive: {
      rules: [
        {
          condition: { maxWidth: 1400 },
          chartOptions: {
            xAxis: { labels: { style: { fontSize: '10px' } } },
            yAxis: { labels: { style: { fontSize: '10px' } } },
          },
        },
      ],
    },
  };
  const [chartOptions, setChartOptions] = useState(placeholderChart);

  // 1️⃣ Fetch static dashboard data once
  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const statistics = await getStatistics();
        setStatisticsData(statistics);

        const tiers = await getTiers({ page: 'all' });
        setTiersData(tiers);

        const years = await getYearOption();
        setYearOptions(years);

        const graphs = await getGraphs({ year: selectedYear });

        const reminders = await getReminder();
        setReminderData(reminders);

        if (graphs) {
          setChartOptions((prevOptions) => ({
            ...prevOptions,
            xAxis: { ...prevOptions.xAxis, categories: graphs[0] },
            series: prevOptions.series.map((series, index) => ({
              ...series,
              data: user?.role === 'trainer' && index === 0 ? 0 : graphs[index + 1],
              type: graphType,
            })),
          }));
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [selectedYear, user?.role]);

  // 2️⃣ Fetch user search independently
  useEffect(() => {
    async function fetchUserSearch() {
      try {
        const users = await getUsersSearch({ search: userSearch });
        setUserData(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }

    if (!loading) {
      fetchUserSearch();
    }
  }, [userSearch, loading]);

  if (loading) {
    return <Spinner />
  }

  return (
    <>
      <Panel setAddUserDrawer={setAddUserDrawer} />

      <Statistics statisticsData={statisticsData} />

      <QuickActions
        setAddMembershipDrawer={setAddMembershipDrawer}
        setAddPaymentsDrawer={setAddPaymentsDrawer}
        setAddReminderDrawer={setAddReminderDrawer}
        setSearchModel={setSearchModel}
        yearOptions={yearOptions}
        chartOptions={chartOptions}
        setSelectedYear={setSelectedYear}
        selectedYear={selectedYear}
        reminderData={reminderData}
      />

      {/* Drawers */}
      <AddUserDrawer open={addUserDrawer} setOpen={setAddUserDrawer} />
      <AddMembershipDrawer
        open={addMembershipDrawer}
        setOpen={setAddMembershipDrawer}
        userData={userData}
        tiersData={tiersData}
        setUserSearch={setUserSearch}
      />
      <AddPaymentsDrawer
        open={addPaymentsDrawer}
        setOpen={setAddPaymentsDrawer}
        setUserSearch={setUserSearch}
        userData={userData}
      />
      <AddReminderDrawer
        open={addReminderDrawer}
        setOpen={setAddReminderDrawer}
        setUserSearch={setUserSearch}
        userData={userData}
      />

      {/* Modals */}
      <SearchModal
        isOpen={searchModel}
        setIsOpen={setSearchModel}
        userData={userData}
        setUserSearch={setUserSearch}
      />
    </>
  );
}
