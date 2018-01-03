import Highcharts from 'highcharts';
import HighchartsNoData from 'highcharts/modules/no-data-to-display';
import Exporting from 'highcharts/modules/exporting';

Exporting(Highcharts);
HighchartsNoData(Highcharts);

export default Highcharts;
