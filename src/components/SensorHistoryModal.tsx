import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { timestampFromDate } from '@bufbuild/protobuf/wkt';
import { measurementClient } from '../api/client';
import type { Measurement } from '../gen/models/v1/measurement_dash_pb';
import type { MetricType } from '../gen/models/v1/metric_type_dash_pb';
import { useLocale } from '../i18n/useLocale';

type Period = 'day' | 'week' | 'month';

const PERIOD_DAYS: Record<Period, number> = {
  day: 1,
  week: 7,
  month: 30,
};

const CHART_COLORS = [
  { stroke: '#16a34a', fill: '#bbf7d0' },
  { stroke: '#dc2626', fill: '#fecaca' },
  { stroke: '#ca8a04', fill: '#fef08a' },
  { stroke: '#2563eb', fill: '#bfdbfe' },
];

const HISTORY_LIMIT = 1000;

interface Props {
  open: boolean;
  onClose: () => void;
  sensorId: string;
  patientId: string;
  sensorName: string;
  metricTypes: MetricType[];
}

const roundTo2 = (n: number) => Math.round(n * 100) / 100;

const formatTick = (period: Period, date: Date) => {
  if (period === 'day') {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString([], { month: 'short', day: '2-digit' });
};

export default function SensorHistoryModal({
  open,
  onClose,
  sensorId,
  patientId,
  sensorName,
  metricTypes,
}: Props) {
  const { lang } = useLocale();
  const [period, setPeriod] = useState<Period>('day');
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const tabs: { value: Period; label: string }[] = useMemo(
    () => [
      { value: 'day', label: lang === 'ua' ? 'Доба' : 'Day' },
      { value: 'week', label: lang === 'ua' ? 'Тиждень' : 'Week' },
      { value: 'month', label: lang === 'ua' ? 'Місяць' : 'Month' },
    ],
    [lang]
  );

  const fetchHistory = useCallback(async () => {
    if (!sensorId || !patientId) return;
    setLoading(true);
    const now = new Date();
    const start = new Date(now.getTime() - PERIOD_DAYS[period] * 24 * 60 * 60 * 1000);
    try {
      const reply = await measurementClient.measurementHistoryGet({
        sensorId,
        patientId,
        startTime: timestampFromDate(start),
        endTime: timestampFromDate(now),
        limit: HISTORY_LIMIT,
        offset: 0,
      });
      setMeasurements(reply.measurements);
      setTotal(reply.total);
      setError('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load history';
      setError(msg);
      setMeasurements([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [sensorId, patientId, period]);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  const componentKeys = useMemo(() => {
    if (metricTypes.length > 0) return metricTypes.map((mt) => mt.code);
    return Array.from(new Set(measurements.flatMap((m) => m.components.map((c) => c.code))));
  }, [metricTypes, measurements]);

  const componentLabels = useMemo(() => {
    const labels: Record<string, { name: string; symbol: string }> = {};
    metricTypes.forEach((mt) => {
      labels[mt.code] = { name: mt.name || mt.code, symbol: mt.symbol };
    });
    measurements.forEach((m) => {
      m.components.forEach((c) => {
        if (!labels[c.code]) {
          labels[c.code] = { name: c.name || c.code, symbol: c.symbol };
        }
      });
    });
    return labels;
  }, [metricTypes, measurements]);

  const chartData = useMemo(() => {
    return [...measurements]
      .reverse()
      .map((m) => {
        const date = m.createdAt ? new Date(Number(m.createdAt.seconds) * 1000) : new Date();
        const entry: { time: string; ts: number; [k: string]: string | number } = {
          time: formatTick(period, date),
          ts: date.getTime(),
        };
        m.components.forEach((c) => {
          entry[c.code] = roundTo2(c.value);
        });
        return entry;
      });
  }, [measurements, period]);

  const stats = useMemo(() => {
    const out: Record<string, { latest: number; min: number; max: number; avg: number; count: number }> = {};
    componentKeys.forEach((k) => {
      const vals: number[] = [];
      measurements.forEach((m) => {
        m.components.forEach((c) => {
          if (c.code === k) vals.push(c.value);
        });
      });
      if (vals.length === 0) {
        out[k] = { latest: NaN, min: NaN, max: NaN, avg: NaN, count: 0 };
        return;
      }
      const latest = vals[0];
      let min = vals[0];
      let max = vals[0];
      let sum = 0;
      for (const v of vals) {
        if (v < min) min = v;
        if (v > max) max = v;
        sum += v;
      }
      out[k] = {
        latest,
        min,
        max,
        avg: sum / vals.length,
        count: vals.length,
      };
    });
    return out;
  }, [measurements, componentKeys]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-bold text-gray-800">{sensorName}</h2>
            <p className="text-xs text-gray-500">
              {lang === 'ua' ? 'Історія показників' : 'Metric history'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="close"
          >
            ✕
          </button>
        </div>

        <div className="px-6 pt-4">
          <div className="inline-flex rounded-full border border-green-200 bg-green-50 p-1">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setPeriod(tab.value)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                  period === tab.value
                    ? 'bg-green-600 text-white shadow-sm'
                    : 'text-green-700 hover:bg-green-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-6 py-5">
          {loading && (
            <p className="text-sm text-gray-500">
              {lang === 'ua' ? 'Завантаження...' : 'Loading...'}
            </p>
          )}

          {error && !loading && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
          )}

          {!loading && !error && measurements.length === 0 && (
            <p className="text-sm text-gray-500 italic">
              {lang === 'ua' ? 'Немає даних за цей період' : 'No data for this period'}
            </p>
          )}

          {!loading && !error && measurements.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {componentKeys.map((k, i) => {
                  const s = stats[k];
                  if (!s || s.count === 0) return null;
                  const color = CHART_COLORS[i % CHART_COLORS.length];
                  const label = componentLabels[k];
                  return (
                    <div key={k} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: color.stroke }}
                        />
                        <span className="text-xs font-semibold text-gray-700">
                          {label?.name ?? k}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-xs text-gray-600">
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">
                            {lang === 'ua' ? 'Поточне' : 'Latest'}
                          </div>
                          <div className="font-bold text-gray-800">
                            {roundTo2(s.latest).toFixed(2)} {label?.symbol ?? ''}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Min</div>
                          <div className="font-medium">{roundTo2(s.min).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Max</div>
                          <div className="font-medium">{roundTo2(s.max).toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-gray-400 uppercase">Avg</div>
                          <div className="font-medium">{roundTo2(s.avg).toFixed(2)}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                    <defs>
                      {componentKeys.map((k, i) => {
                        const c = CHART_COLORS[i % CHART_COLORS.length];
                        return (
                          <linearGradient
                            key={k}
                            id={`hgrad-${sensorId}-${k}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor={c.fill} stopOpacity={0.8} />
                            <stop offset="100%" stopColor={c.fill} stopOpacity={0.1} />
                          </linearGradient>
                        );
                      })}
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      minTickGap={32}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: '#6b7280' }}
                      axisLine={false}
                      tickLine={false}
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '0.5rem',
                        fontSize: '0.75rem',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                      formatter={(val, name) => {
                        const num = typeof val === 'number' ? val : Number(val ?? 0);
                        const key = String(name);
                        const label = componentLabels[key];
                        const unit = label?.symbol ?? '';
                        const displayName = label?.name ?? key;
                        return [`${roundTo2(num).toFixed(2)} ${unit}`, displayName];
                      }}
                    />
                    <Legend
                      formatter={(value) => {
                        const key = String(value);
                        return componentLabels[key]?.name ?? key;
                      }}
                      wrapperStyle={{ fontSize: 12 }}
                    />
                    {componentKeys.map((k, i) => {
                      const c = CHART_COLORS[i % CHART_COLORS.length];
                      return (
                        <Area
                          key={k}
                          type="monotone"
                          dataKey={k}
                          name={k}
                          stroke={c.stroke}
                          strokeWidth={2}
                          fill={`url(#hgrad-${sensorId}-${k})`}
                          dot={false}
                          activeDot={{ r: 4, fill: c.stroke, strokeWidth: 2, stroke: '#fff' }}
                        />
                      );
                    })}
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                <span>
                  {lang === 'ua' ? 'Записів у вікні' : 'Rows in range'}: {total}
                </span>
                <span>
                  {lang === 'ua' ? 'Відображається' : 'Showing'}: {measurements.length}{' '}
                  {lang === 'ua' ? 'вимірювань' : 'measurements'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
