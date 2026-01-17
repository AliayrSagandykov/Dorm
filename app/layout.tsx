import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Timesheet MVP",
  description: "Simple timesheet planner",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-white text-neutral-900">
        <div className="max-w-[1600px] mx-auto">
          <div className="p-4 border-b flex items-center justify-between">
            <a href="/timesheets" className="font-semibold">Timesheet MVP</a>
            <div className="flex gap-4 text-sm">
              <a href="/timesheets" className="underline">Timesheets</a>
              <a href="/employees" className="underline">Employees</a>
            </div>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
