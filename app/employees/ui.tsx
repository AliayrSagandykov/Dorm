"use client";

import { useState } from "react";

type Employee = { id: string; name: string };

export default function EmployeesClient({ initialEmployees }: { initialEmployees: Employee[] }) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <form
        className="flex gap-2"
        onSubmit={async (e) => {
          e.preventDefault();
          setErr(null);
          const trimmed = name.trim();
          if (!trimmed) return;

          const res = await fetch("/api/employees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: trimmed }),
          });

          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            setErr(data?.error ?? "Failed to create employee");
            return;
          }

          const data = await res.json();
          setEmployees((prev) => [...prev, data.employee]);
          setName("");
        }}
      >
        <input
          className="border rounded px-3 py-2 w-full max-w-md"
          placeholder="Employee name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="px-4 py-2 rounded bg-black text-white">Add</button>
      </form>

      {err && <div className="text-sm text-red-600">{err}</div>}

      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50">
            <tr>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e.id} className="border-t">
                <td className="p-2">{e.name}</td>
                <td className="p-2 text-neutral-500">{e.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
