import { useState } from 'react';

const SortableTable = ({ columns, data, onRowClick }) => {
  const [sort, setSort] = useState({ col: null, dir: 'asc' });

  const toggleSort = (col) => {
    setSort(prev => ({
      col,
      dir: prev.col === col && prev.dir === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sorted = [...data].sort((a, b) => {
    if (!sort.col) return 0;
    const valA = a[sort.col]?.toString().toLowerCase() ?? '';
    const valB = b[sort.col]?.toString().toLowerCase() ?? '';
    return sort.dir === 'asc'
      ? valA.localeCompare(valB)
      : valB.localeCompare(valA);
  });

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                onClick={() => col.sortable !== false && toggleSort(col.key)}
                className={`px-4 py-3 text-left 
                  ${col.sortable !== false ? 'cursor-pointer hover:bg-gray-100' : ''}
                `}
              >
                {col.label}
                {sort.col === col.key && (
                  <span className="ml-1">
                    {sort.dir === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {sorted.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-6 text-center text-gray-400"
              >
                No records found
              </td>
            </tr>
          ) : (
            sorted.map((row, i) => (
              <tr
                key={i}
                onClick={() => onRowClick?.(row)}
                className={`bg-white hover:bg-gray-50 
                  ${onRowClick ? 'cursor-pointer' : ''}
                `}
              >
                {columns.map(col => (
                  <td key={col.key} className="px-4 py-3 text-gray-700">
                    {col.render ? col.render(row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SortableTable;