import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const Charts = ({ yearOptions = ['loading...'], chartOptions, setSelectedYear, selectedYear }) => {
  return (
    <section className="w-full mt-6 h-fit">
      <div className="bg-white rounded-lg border p-6 h-auto">
        <h3 className="mb-4 flex justify-between items-center">
          <span className="text-xl font-semibold line-clamp-1">
            Performance Overview
          </span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="rounded-md border-0 p-2 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset text-sm mt-0"
          >
            {yearOptions?.map((item) => (
              <option value={item} key={item}>{item}</option>
            ))}
          </select>
        </h3>

        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </div>
    </section>
  );
};

export default Charts;
