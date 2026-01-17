import { prisma } from "@/lib/db/prisma";
import EmployeesClient from "./ui";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-xl font-semibold">Employees</h1>
        <div className="text-sm text-neutral-500">Добавь сотрудников, чтобы они появились в табеле.</div>
      </div>

      <EmployeesClient initialEmployees={employees} />
    </div>
  );
}
