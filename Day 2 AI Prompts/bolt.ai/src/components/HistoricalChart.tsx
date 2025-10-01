import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { format } from 'date-fns';
import { HistoricalRate } from '../types/currency';
import { useCurrencyData } from '../hooks/useCurrencyData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface HistoricalChartProps {
  fromCurrency: string;
  toCurrency: string;
}

export function HistoricalChart({ fromCurrency, toCurrency }: HistoricalChartProps) {
  const [historicalData, setHistoricalData] = useState<HistoricalRate[]>([]);
  const [loading, setLoading] = useState(false);
  const { getHistoricalData } = useCurrencyData();

  useEffect(() => {
    const fetchHistoricalData = async () => {
      if (fromCurrency === toCurrency) return;
      
      setLoading(true);
      try {
        const data = await getHistoricalData(fromCurrency, toCurrency, 30);
        setHistoricalData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [fromCurrency, toCurrency, getHistoricalData]);

  if (loading) {
    return (
      <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-emerald-200/20 backdrop-blur-xl">
        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
          Historical Exchange Rate ({fromCurrency} → {toCurrency})
        </h3>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-200 border-t-emerald-600"></div>
        </div>
      </div>
    );
  }

  if (historicalData.length === 0) {
    return (
      <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-emerald-200/20 backdrop-blur-xl">
        <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
          Historical Exchange Rate ({fromCurrency} → {toCurrency})
        </h3>
        <div className="text-gray-600 text-center py-12 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl">
          No historical data available
        </div>
      </div>
    );
  }

  const chartData = {
    labels: historicalData.map(item => format(new Date(item.date), 'MMM dd')),
    datasets: [
      {
        label: `${fromCurrency} to ${toCurrency}`,
        data: historicalData.map(item => item.rate),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgb(16, 185, 129)',
        pointBorderColor: 'rgb(255, 255, 255)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: 'rgb(5, 150, 105)',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `1 ${fromCurrency} = ${context.parsed.y.toFixed(4)} ${toCurrency}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value: any) {
            return Number(value).toFixed(4);
          }
        }
      },
    },
  };

  return (
    <div className="glass-effect p-8 rounded-2xl shadow-2xl border border-emerald-200/20 backdrop-blur-xl">
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
        Historical Exchange Rate ({fromCurrency} → {toCurrency}) - Last 30 Days
      </h3>
      <div className="h-80 bg-white/70 rounded-xl p-6 shadow-inner">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
}